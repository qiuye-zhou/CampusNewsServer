import { IConfig } from './configs.interface';

export const generateDefaultConfig: () => IConfig = () => ({
  url: {
    adminUrl: 'http://127.0.0.1:2666/admin',
    serverUrl: 'http://127.0.0.1:2666',
    webUrl: 'http://127.0.0.1:3030',
    wsUrl: 'http://127.0.0.1:2666',
  },
  adminExtra: {
    backgroundUrl: '',
  },
});
