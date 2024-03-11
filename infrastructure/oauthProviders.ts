import * as pulumi from "@pulumi/pulumi";

const config = new pulumi.Config();

export const oathProviders = {
  github: {
    clientId: config.require('oauth.github.clientId'), //'0edb0ba561e1697bc032',
    secret: config.require('oauth.github.secret'), //'e74d9168600dccb0a4472482e1dfae2e859f0f8e',
    scopes: ['read:user', 'user:email']
  }
}

export type OAuthProvider = typeof oathProviders;