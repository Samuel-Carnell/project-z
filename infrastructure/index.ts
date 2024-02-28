import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";
import { createFrontendComponent } from "./frontend";
import { createBackendComponent } from "./backend";
import { createDatabaseComponent } from "./db";
import * as yaml from "yaml";

const config = new pulumi.Config();
const provider = new k8s.Provider("kubernetes-client", {
  kubeconfig: config.require("k8s-config"),
  deleteUnreachable: true,
});

const dbComponent = createDatabaseComponent({
  provider,
  storageClass: config.require("storage-class"),
});
const frontendComponent = createFrontendComponent({
  provider,
  image: {
    registry: config.require("image-registry"),
    repo: config.get("frontend-image-repo"),
    tag: config.get("image-tag"),
  },
  apiServer: config.require("host"),
});
const backendComponent = createBackendComponent({
  provider,
  image: {
    registry: config.require("image-registry"),
    repo: config.get("backend-image-repo"),
    tag: config.get("image-tag"),
  },
  database: {
    credentials: dbComponent.mongoDatabase.credentials,
    port: dbComponent.mongoDatabase.port,
    serviceName: dbComponent.mongoDatabase.serviceName,
  },
});

if (config.requireBoolean("include-ingress-controller")) {
  new k8s.helm.v3.Chart(
    "traefik",
    {
      chart: "traefik",
      repo: "traefik",
      fetchOpts: { repo: "https://helm.traefik.io/traefik" },
      values: {
        ingressClass: { enabled: true, isDefaultClass: true },
        providers: {
          kubernetesIngress: {
            enabled: true,
            publishedService: { enabled: true },
          },
        },
        publishedService: { enabled: true },
        ingress: {
          healthcheck: { enabled: true },
        },
        ports: {
          traefik: {
            expose: true,
          },
        },
      },
    },
    { provider }
  );
}

const ingressName = `app-ingress`;
const ingress = new k8s.networking.v1.Ingress(
  ingressName,
  {
    metadata: {
      name: ingressName,
    },
    spec: {
      rules: [
        {
          http: {
            paths: [
              {
                path: "/",
                pathType: "Prefix",
                backend: {
                  service: {
                    name: frontendComponent.service.metadata.name,
                    port: { number: frontendComponent.port },
                  },
                },
              },
              {
                path: "/api",
                pathType: "Prefix",
                backend: {
                  service: {
                    name: backendComponent.service.metadata.name,
                    port: { number: backendComponent.port },
                  },
                },
              },
              {
                path: "/database",
                pathType: "Prefix",
                backend: {
                  service: {
                    name: dbComponent.mongoExpress.servicesName,
                    port: { number: dbComponent.mongoExpress.port },
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
  { provider }
);

export const host = config.require("host");
const k8sConfig = yaml.parse(config.require("k8s-config"));
export const k8sContext = k8sConfig["current-context"];
export const imageTag = config.get("image-tag") ?? "";
