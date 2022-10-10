const Bree = require('bree');
const Cabin = require('cabin');
const Graceful = require('@ladjs/graceful');

const cabin = new Cabin();

const bree = new Bree({
  logger: cabin,

  jobs: [
    {
      name: 'services',
      interval: '1m'
    }
  ]
});

const graceful = new Graceful({ brees: [bree] });
graceful.listen();

(async () => {
  cabin.info("CLMonitor started.");
  await bree.start();
})();
