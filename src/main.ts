import HTTP2, {Http2SecureServer, Http2Server} from 'http2';
import Koa from 'koa';

import {config} from './config';
import {getKeys} from './keys';
import {router} from './router';

const app = new Koa();

app.use(router.routes()).use(router.allowedMethods());

let keys = getKeys();

let server: Http2Server | Http2SecureServer;

if (keys) {
  server = HTTP2.createSecureServer(
    {...keys, allowHTTP1: true},
    app.callback(),
  );
} else {
  console.log(`No SSL keys, creating non-ssl http2 server...`);
  server = HTTP2.createServer(app.callback());
}

app.listen(config.http1Port, () => {
  console.info(`HTTP1 mock service listening on port: ${config.http1Port}...`);
});
server.listen(config.port, () => {
  console.info(`HTTP2 mock service listening on port: ${config.port}...`);
});
