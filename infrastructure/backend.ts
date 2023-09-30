import * as k8s from "@pulumi/kubernetes";
import * as docker from "@pulumi/docker";
import { Output, jsonStringify } from "@pulumi/pulumi";
import { RandomPassword } from "@pulumi/random";

// docker.io/samuelcarnell
// "mongodb://root:password@mongodb-service:27017/"

export function createBackendComponent({
  provider,
  appName,
  imageRepo,
  database,
}: {
  provider: k8s.Provider;
  appName: string;
  imageRepo: string;
  database: {
    serviceName: Output<string>;
    port: number;
    credentials: {
      user: string;
      password: RandomPassword;
    };
  };
}) {
  const imageName = `${appName}-backend-image-${Date.now()}`;
  const backendImage = new docker.Image(imageName, {
    imageName: `${imageRepo}/samuel-carnell:${imageName}`,
    build: {
      args: {
        platform: "linux/amd64",
      },
      context: "../backend",
      platform: "linux/amd64",
    },
  });

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
  const serviceName = `${appName}-backend-service`;
  const deploymentName = `${appName}-backend-deployment`;

  const label = { app: appName, component: "backend" };

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
                image: backendImage.imageName,
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
