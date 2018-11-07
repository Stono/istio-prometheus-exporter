# istio-prometheus-exporter
Exports some interesting metrics about the health of istio, so that you can consume them into Prometheus and Prometheus Alert Manager

## Metrics
Metrics are defined as collectors in `lib/collector`.  Each metric is collected every 10 seconds.

### pilot_conflict_outbound_listener_tcp_over_current_tcp
This metric will tell you if you have multiple TCP services requesting the same port, resulting in a conflict, along with a timestamp for when the event was seen.

```
# HELP pilot_conflict_outbound_listener_tcp_over_current_tcp Multiple TCP services requesting the same port
# TYPE pilot_conflict_outbound_listener_tcp_over_current_tcp gauge
pilot_conflict_outbound_listener_tcp_over_current_tcp{listener="0.0.0.0:2181",accepted="zookeeper-headless.kafka.svc.cluster.local",rejected="zookeeper-headless.search-solr.svc.cluster.local"} 1 1541618867467
pilot_conflict_outbound_listener_tcp_over_current_tcp{listener="0.0.0.0:2888",accepted="zookeeper-headless.kafka.svc.cluster.local",rejected="zookeeper-headless.search-solr.svc.cluster.local"} 1 1541618867468
pilot_conflict_outbound_listener_tcp_over_current_tcp{listener="0.0.0.0:3888",accepted="zookeeper-headless.kafka.svc.cluster.local",rejected="zookeeper-headless.search-solr.svc.cluster.local"} 1 1541618867468
```

## Getting Started
Install the dependencies with `npm install`.  Once done, you can do the following:

### npm run start
You'll need to set up a port-forward for pilot if you're running locally: `kubectl --namespace=istio-system port-forward $(kubectl --namespace=istio-system get pods -l istio=pilot | tail -n 1 | awk '{print $1}') 8081:808`

Then do `npm run start`, which will start the server, on port 8080, with metrics available on `/metrics`;

### npm run build
Will compile the typescript to javascript into the `/built` folder.  You largely never need to do this unlesss debugging build issues.

### npm run test
Will run the linting and tests.

## Running on a kubernetes cluster
I've not got round to writing any manifests just yet, sorry.

## Release History
_(Nothing yet)_

## License
Copyright (c) 2018 Karl Stoney
Licensed under the MIT license.
