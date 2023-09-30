import * as k8s from "@pulumi/kubernetes";
import * as docker from "@pulumi/docker";
import { jsonStringify } from "@pulumi/pulumi";

// docker.io/samuelcarnell

export function createFrontendComponent({
  provider,
  appName,
  imageRepo,
  apiServer,
}: {
  provider: k8s.Provider;
  appName: string;
  imageRepo: string;
  apiServer: string;
}) {
  const imageName = `${appName}-frontend-image-${Date.now()}`;
  const frontendImage = new docker.Image(imageName, {
    imageName: `${imageRepo}/samuel-carnell:${imageName}`,
    build: {
      args: {
        platform: "linux/amd64",
      },
      context: "../frontend",
      platform: "linux/amd64",
    },
  });

  const configMap = new k8s.core.v1.ConfigMap(
    "frontend-config-map",
    {
      metadata: {
        name: "frontend-config-map",
      },
      data: {
        "config.json": jsonStringify({
          apiServer,
        }),
      },
    },
    { provider }
  );

  const frontendPort = 3000;
  const serviceName = `${appName}-frontend-service`;
  const deploymentName = `${appName}-frontend-deployment`;

  const frontendLabel = { app: appName, component: "frontend" };
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
                image: frontendImage.imageName,
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
