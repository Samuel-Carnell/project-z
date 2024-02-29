import * as k8s from "@pulumi/kubernetes";
import * as docker from "@pulumi/docker";
import { Output, jsonStringify } from "@pulumi/pulumi";
import { RandomPassword } from "@pulumi/random";

type DockerImage = {
  buildOnDeploy: boolean;
  registry: string;
  repo?: string;
  tag?: string;
};

const backendImageName = ({
  buildOnDeploy,
  registry,
  repo = "backend",
  tag,
}: DockerImage) => {
  if (buildOnDeploy) {
    const image = new docker.Image(`backend-image`, {
      imageName: `${registry}/${repo}:${Date.now()}`,
      build: {
        args: {
          platform: "linux/amd64",
        },
        context: "../backend",
        platform: "linux/amd64",
      },
    });

    return image.imageName;
  }

  return `${registry}/${repo}:${tag}`;
};

export function createBackendComponent({
  provider,
  image,
  database,
}: {
  provider: k8s.Provider;
  image: DockerImage;
  database: {
    serviceName: Output<string>;
    port: number;
    credentials: {
      user: string;
      password: RandomPassword;
    };
  };
}) {
  const imageName = backendImageName(image);

  const configMap = new k8s.core.v1.ConfigMap(
    "backend-config-map",
    {
      metadata: {
        name: "backend-config-map",
      },
      data: {
        "appsettings.json": jsonStringify({
          mongodb: {
            connection_string: database.serviceName.apply((serviceName) =>
              database.credentials.password.result.apply(
                (password) =>
                  `mongodb://${database.credentials.user}:${password}@${serviceName}:${database.port}`
              )
            ),
          },
        }),
      },
    },
    { provider }
  );

  const port = 5100;
  const serviceName = `app-backend-service`;
  const deploymentName = `app-backend-deployment`;

  const label = { component: "backend" };

  const backendDeployment = new k8s.apps.v1.Deployment(
    deploymentName,
    {
      metadata: {
        name: deploymentName,
      },
      spec: {
        selector: { matchLabels: label },
        replicas: 1,
        template: {
          metadata: { labels: label },
          spec: {
            containers: [
              {
                name: "backend",
                image: imageName,
                ports: [{ containerPort: port }],
                volumeMounts: [
                  {
                    name: "config",
                    mountPath: "/app/appsettings.json",
                    subPath: "appsettings.json",
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
                  items: [
                    { key: "appsettings.json", path: "appsettings.json" },
                  ],
                },
              },
            ],
          },
        },
      },
    },
    { provider }
  );

  const backendService = new k8s.core.v1.Service(
    serviceName,
    {
      metadata: {
        name: serviceName,
        labels: backendDeployment.spec.template.metadata.labels,
      },
      spec: {
        type: "ClusterIP",
        ports: [{ port, targetPort: port }],
        selector: backendDeployment.spec.template.metadata.labels,
      },
    },
    { provider }
  );

  return {
    service: backendService,
    port: port,
  };
}
