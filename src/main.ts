import HTTP2 from 'http2';
import Koa from 'koa';

import {config} from './config';
import {key, cert} from './keys';
import {router} from './router';

const app = new Koa();

app.use(router.routes()).use(router.allowedMethods());

const server = HTTP2.createSecureServer(
  {key, cert, allowHTTP1: true},
  app.callback(),
);

server.listen(config.port, () => {
  console.info(`HTTP2 mock service listening on port: ${config.port}...`);
});
