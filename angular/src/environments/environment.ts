import { Environment } from '@abp/ng.core';

const baseUrl = 'http://localhost:4200';

export const environment = {
  production: false,
  application: {
    baseUrl,
    name: 'GLOTTER',
    logoUrl: '',
  },
  oAuthConfig: {
    issuer: 'https://localhost:44376/',
    redirectUri: baseUrl,
    clientId: 'SistemLang_App',
    responseType: 'code',
    scope: 'offline_access SistemLang',
    requireHttps: true,
  },
  apis: {
    default: {
      url: 'https://localhost:44376/',
      rootNamespace: 'JLara.SistemLang',
    },
  },
} as Environment;
