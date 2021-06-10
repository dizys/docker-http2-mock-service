import FS from 'fs';
import {
  GLOBAL_SERVER_CERT_PATH,
  GLOBAL_SERVER_KEY_PATH,
  PROJECT_SERVER_CERT_PATH,
  PROJECT_SERVER_KEY_PATH,
} from './path';
import {camelToSnakeCase, fatalError} from './utils';

let keyPath;

if (FS.existsSync(PROJECT_SERVER_KEY_PATH)) {
  keyPath = PROJECT_SERVER_KEY_PATH;
} else if (FS.existsSync(GLOBAL_SERVER_KEY_PATH)) {
  keyPath = GLOBAL_SERVER_KEY_PATH;
} else {
  fatalError('Fatal Error: SSL key file not found');
}

let certPath;

if (FS.existsSync(PROJECT_SERVER_CERT_PATH)) {
  certPath = PROJECT_SERVER_CERT_PATH;
} else if (FS.existsSync(GLOBAL_SERVER_CERT_PATH)) {
  certPath = GLOBAL_SERVER_CERT_PATH;
} else {
  fatalError('Fatal Error: SSL cert file not found');
}

let key: string;
let cert: string;

try {
  key = FS.readFileSync(keyPath, {encoding: 'utf8'});
  cert = FS.readFileSync(certPath, {encoding: 'utf8'});
  console.log(`Using SSL key from: ${keyPath}...`);
  console.log(`Using SSL cert from: ${certPath}...`);
} catch (error) {
  fatalError(`Failed to read keys: ${String(error)}`);
}

export {key, cert};
