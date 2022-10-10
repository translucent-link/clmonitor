const { parentPort } = require('node:worker_threads');
const process = require('node:process');
const axios = require('axios');
const fs = require('fs').promises;
const yaml = require('js-yaml');

const Cabin = require('cabin');
const cabin = new Cabin();

const notifyHeartbeat = async (url) => {
  return axios.post(url);
}

const checkUptime = async ({url, method = "get", headers = {}, data}) => {
  try {
    const response = await axios({
      method,
      url,
      data,
      headers
    })
    return response.status===200;
  } catch (error) {
    cabin.error(error.message);
    return false;
  }
}

const loadConfig = async () => {
  const configPath = process.env.CONFIG_PATH;
  if (configPath === undefined) {
    throw new Error("CONFIG_PATH not set");
  }
  return yaml.load(await fs.readFile(configPath, 'utf8'));
}

const run = async () => {
  const config = await loadConfig();

  for (const service of config.services) {
    const statusOk = await checkUptime(service);
    if (statusOk) {
      try {
        const heartbeatResponse = await notifyHeartbeat(service.heartbeat_notification);        
        cabin.info({heartbeat: heartbeatResponse.status});
      } catch (error) {
        cabin.error(error.message);
      }
    }
    cabin.info(`${service.name}:${statusOk}`);
  }
}
run().then(() => {
  // signal to parent that the job is done
  if (parentPort) parentPort.postMessage('done');
  // eslint-disable-next-line unicorn/no-process-exit
  else process.exit(0);
})
