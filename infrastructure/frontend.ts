import * as k8s from "@pulumi/kubernetes";
import * as docker from "@pulumi/docker";
import { jsonStringify } from "@pulumi/pulumi";
import { oathProviders } from './oauthProviders'

type DockerImage = {
  buildOnDeploy: boolean;
  registry: string;
  repo?: string;
  tag?: string;
};

const frontendImageName = ({
  buildOnDeploy,
  registry,
  repo = "frontend",
  tag,
}: DockerImage) => {
  if (buildOnDeploy) {
    const image = new docker.Image(`frontend-image`, {
      imageName: `${registry}/${repo}:${Date.now()}`,
      build: {
        args: {
          platform: "linux/amd64",
        },
        context: "../frontend",
        platform: "linux/amd64",
      },
    });

    return image.imageName;
  }

  return `${registry}/${repo}:${tag}`;
};

export function createFrontendComponent({
  provider,
  image,
  apiServer,
}: {
  provider: k8s.Provider;
  image: DockerImage;
  apiServer: string;
}) {
  const imageName = frontendImageName(image);

  const configMap = new k8s.core.v1.ConfigMap(
    "frontend-config-map",
    {
      metadata: {
        name: "frontend-config-map",
      },
      data: {
        "config.json": jsonStringify({
          apiServer,
          oauth: {
            'github': {
              'clientId': oathProviders.github.clientId,
              'scope': oathProviders.github.scopes.join(' ')
            }
          }
        }),
      },
    },
    { provider }
  );

  const frontendPort = 3000;
  const serviceName = `app-frontend-service`;
  const deploymentName = `app-frontend-deployment`;

  const frontendLabel = { component: "frontend" };
  const frontendDeployment = new k8s.apps.v1.Deployment(
    deploymentName,
    {
      metadata: {
        name: deploymentName,
      },
      spec: {
        selector: { matchLabels: frontendLabel },
        replicas: 1,
        template: {
          metadata: { labels: frontendLabel },
          spec: {
            containers: [
              {
                name: "frontend",
                image: imageName,
                ports: [{ containerPort: frontendPort }],
                volumeMounts: [
                  {
                    name: "config",
                    mountPath: "/app/config.json",
                    subPath: "config.json",
                    readOnly: true,
                  },
                ],
              },
            ],
            volumes: [
              {
                name: "config",
                configMap: {
                  name: configMap.metadata.name,
                  items: [{ key: "config.json", path: "config.json" }],
                },
              },
            ],
          },
        },
      },
    },
    { provider }
  );

  const frontendService = new k8s.core.v1.Service(
    serviceName,
    {
      metadata: {
        name: serviceName,
        labels: frontendDeployment.spec.template.metadata.labels,
      },
      spec: {
        type: "ClusterIP",
        ports: [{ port: frontendPort, targetPort: frontendPort }],
        selector: frontendDeployment.spec.template.metadata.labels,
      },
    },
    { provider }
  );

  return {
    service: frontendService,
    port: frontendPort,
  };
}
