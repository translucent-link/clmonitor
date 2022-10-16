# CLMonitor

CLMonitor checks the health endpoint of services and notifies UptimeRobot of a "healthy" service. UptimeRobot can observe public internet-facing services. It cannot "see behind" a firewall. This is where CLMonitor comes in.

First you setup a "heartbeat" monitor for the service you want to observe. This heartbeat monitor has a URL that needs to be pinged within the configured timeframe otherwise it triggers a "service down" alarm.

CLMonitor sits behind the firewall and has access to your internal services. CLMonitor observes those services and if the service goes down, stops notifying UptimeRobot thereby triggering the heartbeat's "service down" alarm.

# Demo

You can see CLMonitor in action by checking out the [Translucent Status Page](https://status.translucent.link).

# Uptime Robot Affiliate Link

If you find this repo useful, please consider using our affiliate link to [Sign up to Uptime Robot](https://uptimerobot.com/?rid=908ba6bc109eb1).

# Configuration

CLMonitor is configured through single YAML configuration file, as outlined below

    services:
      - name: chainlink-goerli
        healthcheck: http://localhost:6688/metrics
        heartbeat_notification: https://heartbeat.uptimerobot.com/<alert 1>

      - name: chainlink-arbitrum-goerli
        healthcheck: http://localhost:6688/metrics
        heartbeat_notification: https://heartbeat.uptimerobot.com/<alert 2>

      - name: prometheus
        healthcheck: http://localhost:9090/status
        heartbeat_notification: https://heartbeat.uptimerobot.com/<alert 3>

      - name: arbitrum-rpc
        healthcheck: http://localhost:8547
        method: POST
        payload: "{\"jsonrpc\":\"2.0\",\"method\":\"eth_blockNumber\",\"params\":[],\"id\":1}"
        headers:
          "Content-Type": "application/json"
        heartbeat_notification: https://heartbeat.uptimerobot.com/<alert 4>

The services section defines a list of hosts to monitor using a health check URL that returns a 200 status code. By default it will use a GET method. You can use `method` to use POST instead. You can use `payload` to send data along with the POST request. You can specify `headers` to specify content types as well as API keys such as bearer tokens.

# To deploy using Docker

This repo publishes prebuilt Docker containers located at https://hub.docker.com/repository/docker/translucentlink/clmonitor.

You can run the container as follows

    docker run -it -v ./config.yaml:/app/config.yaml -e "CONFIG_PATH=/app/config.yaml" translucentlink/clmonitor:0.0.3