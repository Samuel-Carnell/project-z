import * as k8s from "@pulumi/kubernetes";
import { RandomPassword } from "@pulumi/random";

//"local-storage"

export function createDatabaseComponent({
  provider,
  storageClass,
  mePassword,
}: {
  provider: k8s.Provider;
  storageClass: string;
  mePassword: string;
}) {
  const rootCredentials = {
    user: "root",
    password: new RandomPassword("mongo-db-password", {
      length: 24,
      special: false,
    }),
  };
  const persistentVolumeClaim = new k8s.core.v1.PersistentVolumeClaim(
    "mongodb-pvc",
    {
      metadata: {
        name: "mongodb-pvc",
      },
      spec: {
        storageClassName: storageClass,
        accessModes: ["ReadWriteOnce"],
        resources: {
          requests: {
            storage: "1Gi",
          },
        },
      },
    },
    { protect: true, dependsOn: [rootCredentials.password], provider }
  );

  const statefulSetName = "app-mongodb-stateful-set";
  const serviceName = "app-mongodb-service";
  const containerPort = 27017;
  const statefulSet = new k8s.apps.v1.StatefulSet(
    statefulSetName,
    {
      metadata: {
        name: statefulSetName,
      },
      spec: {
        selector: {
          matchLabels: { component: "database" },
        },
        replicas: 1,
        serviceName: "mongodb-headless-service",
        template: {
          metadata: {
            labels: { component: "database" },
          },
          spec: {
            containers: [
              {
                name: "mongodb",
                image: "mongo:latest",
                ports: [{ containerPort }],
                env: [
                  {
                    name: "MONGO_INITDB_ROOT_USERNAME",
                    value: rootCredentials.user,
                  },
                  {
                    name: "MONGO_INITDB_ROOT_PASSWORD",
                    value: rootCredentials.password.result,
                  },
                ],
                volumeMounts: [
                  {
                    name: "mongodb-volume",
                    mountPath: "/data/db",
                  },
                ],
              },
            ],
            volumes: [
              {
                name: "mongodb-volume",
                persistentVolumeClaim: {
                  claimName: "mongodb-pvc",
                },
              },
            ],
          },
        },
      },
    },
    { provider }
  );
  const mongoService = new k8s.core.v1.Service(
    serviceName,
    {
      metadata: {
        name: serviceName,
      },
      spec: {
        type: "ClusterIP",
        ports: [{ port: containerPort, targetPort: containerPort }],
        selector: statefulSet.spec.template.metadata.labels,
      },
    },
    { provider }
  );

  const mongoExpressDeploymentName = `mongo-express-deployment`;
  const mongoExpressLabel = { component: "mongo-express" };
  const mongoExpressPort = 8081;
  const meCredentials = {
    user: "admin",
    password: mePassword,
  };
  const mongoExpressDeployment = new k8s.apps.v1.Deployment(
    mongoExpressDeploymentName,
    {
      metadata: {
        name: mongoExpressDeploymentName,
      },
      spec: {
        selector: { matchLabels: mongoExpressLabel },
        replicas: 1,
        template: {
          metadata: { labels: mongoExpressLabel },
          spec: {
            containers: [
              {
                name: "mongo-express",
                image: "mongo-express",
                ports: [{ containerPort: mongoExpressPort }],
                env: [
                  {
                    name: "ME_CONFIG_MONGODB_SERVER",
                    value: mongoService.metadata.name,
                  },
                  {
                    name: "ME_CONFIG_MONGODB_PORT",
                    value: containerPort.toString(),
                  },
                  {
                    name: "ME_CONFIG_MONGODB_ADMINUSERNAME",
                    value: rootCredentials.user,
                  },
                  {
                    name: "ME_CONFIG_MONGODB_ADMINPASSWORD",
                    value: rootCredentials.password.result,
                  },
                  { name: "ME_CONFIG_SITE_BASEURL", value: "/database" },
                  {
                    name: "ME_CONFIG_BASICAUTH_USERNAME",
                    value: meCredentials.user,
                  },
                  {
                    name: "ME_CONFIG_BASICAUTH_PASSWORD",
                    value: meCredentials.password,
                  },
                ],
              },
            ],
          },
        },
      },
    },
    { provider }
  );
  const meServicesName = "mongo-express-service";
  const meService = new k8s.core.v1.Service(
    meServicesName,
    {
      metadata: {
        name: meServicesName,
      },
      spec: {
        type: "ClusterIP",
        ports: [{ port: mongoExpressPort, targetPort: mongoExpressPort }],
        selector: mongoExpressDeployment.spec.template.metadata.labels,
      },
    },
    { provider }
  );

  return {
    mongoExpress: {
      servicesName: meService.metadata.name,
      port: mongoExpressPort,
      credentials: meCredentials,
    },
    mongoDatabase: {
      serviceName: mongoService.metadata.name,
      port: containerPort,
      credentials: rootCredentials,
    },
  };
}
