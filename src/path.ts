import Path from 'path';

export const GLOBAL_CONFIG_PATH = '/etc/http2/mock-config.json';
export const GLOBAL_SERVER_KEY_PATH = '/etc/http2/mock-server.key';
export const GLOBAL_SERVER_CERT_PATH = '/etc/http2/mock-server.crt';

export const PROJECT_DIR = Path.join(__dirname, '..');
export const PROJECT_CONFIG_PATH = Path.join(PROJECT_DIR, 'mock-config.json');
export const PROJECT_KEYS_DIR = Path.join(PROJECT_DIR, 'keys');
export const PROJECT_SERVER_KEY_PATH = Path.join(
  PROJECT_KEYS_DIR,
  'mock-server.key',
);
export const PROJECT_SERVER_CERT_PATH = Path.join(
  PROJECT_KEYS_DIR,
  'mock-server.crt',
);
