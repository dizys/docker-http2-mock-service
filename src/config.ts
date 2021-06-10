import FS from 'fs';
import {GLOBAL_CONFIG_PATH, PROJECT_CONFIG_PATH} from './path';
import {camelToSnakeCase} from './utils';

export interface Config {
  port: number;
  /**
   * Failure rate (0~1)
   */
  failureRate: number;
  /**
   * Average response time in milliseconds
   */
  averageResponseTime: number;
  /**
   * Response time deviation in milliseconds
   */
  responseTimeDeviation: number;
}

const DEFAULT_CONFIG: Config = {
  port: 3000,
  failureRate: 0.2,
  averageResponseTime: 500,
  responseTimeDeviation: 100,
};

let configPath;

if (FS.existsSync(PROJECT_CONFIG_PATH)) {
  configPath = PROJECT_CONFIG_PATH;
} else if (FS.existsSync(GLOBAL_CONFIG_PATH)) {
  configPath = GLOBAL_CONFIG_PATH;
}

let config: Config = {...DEFAULT_CONFIG};

if (configPath) {
  console.log(`Config file found at ${configPath}.`);

  try {
    let configStr = FS.readFileSync(configPath, {encoding: 'utf8'});
    let configFromFile: Partial<Config> = JSON.parse(configStr);
    config = {...config, ...configFromFile};
    console.log(`- Config file successfully loaded.`);
  } catch (error) {
    console.error(
      `Failed to load config file (${configPath}): ${String(error)}`,
    );
  }
} else {
  console.log(`Config file not found, using default values...`);
}

for (let configKey of Object.keys(config)) {
  let envKey = camelToSnakeCase(configKey).toLocaleUpperCase();

  if (envKey in process.env) {
    let value = Number(process.env[envKey]);
    if (isNaN(value)) {
      console.warn(`Invalid value for env variable ${envKey}, ignoring...`);
      continue;
    }
    config[configKey as keyof Config] = value;
    console.log(
      `Env variable ${envKey} found, overriding config: ${configKey}=${value}`,
    );
  }
}

export {config};
