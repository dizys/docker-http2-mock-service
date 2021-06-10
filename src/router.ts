import KoaRouter from '@koa/router';

import {config} from './config';
import {getRandomString, waitFor} from './utils';

const router = new KoaRouter();

const AMPLIFY_RATIO = 3;

const ERROR_RESPONSE = `
<xml>
<component>
BFF Error Response
</component>
</xml>
`;

const BFF_RESPONSE = (content: string) => `
<xml>
<component>
${content}
</component>
</xml>
`;

router.get('/', (context, next) => {
  context.body =
    '<html><head><title>Mock HTTP2 service</title></head><body>hello!</body></html>';
});

router.all('/bff', async (context, next) => {
  let requestHeaderSize = context.req.rawHeaders.join('\n').length;

  let responseDelay = getRandomResponseDelay();
  await waitFor(responseDelay);
  if (getRandomlyGated()) {
    context.body = ERROR_RESPONSE;
    return;
  }

  context.body = BFF_RESPONSE(
    getRandomString(requestHeaderSize * AMPLIFY_RATIO),
  );
});

function getRandomlyGated(): boolean {
  return Math.random() < config.failureRate;
}

function getRandomResponseDelay(): number {
  let {responseTimeDeviation, averageResponseTime} = config;

  return (
    ((Math.random() - 0.5) / 0.5) * responseTimeDeviation + averageResponseTime
  );
}

export {router};
