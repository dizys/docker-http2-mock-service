# HTTP2 Mock Server

A mock HTTP2 (/HTTP1 also)
server. Docker image available [here](https://hub.docker.com/r/dizy/http2-mock-server).

## Getting started

Pull image from the command line:

```bash
$ docker pull dizy/http2-mock-server:latest
```

or use as base image in DockerFile:

```bash
FROM dizy/http2-mock-server:latest
```

## Configuration

The server is reading from two places in the container for configuration: `/node_app/mock-config.json`, `/etc/http2/mock-config.json` (seek in this order). If the configuration file changes, the server will restart and apply the changes automatically.

Example config JSON:

```jsonc
{
  "port": 3000, // main HTTP/2 port
  "http1Port": 3001, // HTTP/1.1 port for testing purposes
  "failureRate": 0.5, // Rate for mocking requests to fail
  "averageResponseTime": 500, // Mock response delay time (average) in milliseconds
  "responseTimeDeviation": 100 // Deviation on the delay time (+/- milliseconds at most)
}
```

### Enable HTTP/2 SSL

Putting SSL keys (`mock-server.key` and `mock-server.crt`) under one of these two folders: `/node_app/keys/` or `/etc/http2/` (seek in this order). If the keys exist, the server will enable SSL for HTTP/2 transport automatically. If the keys change, the server will restart and apply the changes automatically.

### Configure through Env variables

- PORT: `port` main HTTP/2 port
- HTTP1_PORT: `http1Port` HTTP/1.1 port for testing purposes
- FAILURE_RATE: `failureRate`
- AVERAGE_RESPONSE_TIME: `averageResponseTime`
- RESPONSE_TIME_DEVIATION: `responseTimeDeviation`

You can set environment variables when [Docker run](https://docs.docker.com/engine/reference/commandline/run/#set-environment-variables--e---env---env-file) or when using [Docker Compose](https://docs.docker.com/compose/environment-variables/).

### Kubernetes YAML

When deploy this image as services/deployments in Kubernetes, you can utilize ConfigMap to manage config files and SSL keys.

Example:

```yml
---
apiVersion: v1
kind: Service
metadata:
  name: http2-mock
spec:
  ports:
    - name: http2
      port: 81
      targetPort: 3000
    - name: http1
      port: 80
      targetPort: 3001
  selector:
    app: http2-mock
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: http2-mock
spec:
  replicas: 1
  selector:
    matchLabels:
      app: http2-mock
  strategy:
    type: RollingUpdate
  template:
    metadata:
      labels:
        app: http2-mock
    spec:
      containers:
        - name: http2-mock
          image: docker.io/dizy/http2-mock-server:latest
          ports:
            - name: http2
              containerPort: 3000
            - name: http1
              containerPort: 3001
          volumeMounts:
            - name: http2-mock-volume
              mountPath: '/etc/http2'
              readOnly: true
      volumes:
        - name: http2-mock-volume
          configMap:
            name: http2-mock-config
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: http2-mock-config
data:
  mock-config.json: |
    {
      "port": 3000,
      "http1Port": 3001,
      "failureRate": 0.5,
      "averageResponseTime": 500,
      "responseTimeDeviation": 100
    }
  mock-server.key: |
    ...
  mock-server.crt: |
    ...
```

## License

MIT license
