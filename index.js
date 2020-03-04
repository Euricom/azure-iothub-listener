#!/usr/bin/env node
/* eslint-disable */
const eventHub = require('@azure/event-hubs');
const { EventHubClient, EventPosition } = eventHub;

const yargs = require('yargs');

const argv = yargs
  .usage('$0 <cstr> [options]', 'Listen to Azure IoT Hub device events.', (yargs) => {
    yargs.positional('cstr', {
      describe: 'Azure IoTHub connection string',
      type: 'string'
    })
  } )
  .options({
    'verbose': {
      alias: 'v',
      description: 'More verbose logging',
      type: 'boolean'
    }
  })
  .epilog('Copyright Euricom 2020')
  .argv;

if (!argv.cstr.startsWith('HostName=') || !argv.cstr.includes('SharedAccessKeyName')) {
  yargs.showHelp();
  console.log();
  console.log('ERROR: Bad or invalid connection string, must start with "HostName="');
  process.exit(-1);
}

listenForMessages()
  .then(() => {
    console.log('Listening to Azure IoTHub events... (ctrl-c to quit)');
  })
  .catch((err) => {
    console.log('ERROR:', err.message);
    process.exit(-1);
  });

async function listenForMessages() {
  const eventHubClient = await EventHubClient.createFromIotHubConnectionString(argv.cstr, 'ntt-event-hub');
  return listen(eventHubClient, (eventData, err) => {
    if (err) {
      console.log('ERROR', err);
    }
    const deviceId = eventData.annotations['iothub-connection-device-id'];
    if (argv.verbose) {
      console.log(`Event from '${deviceId}': `, eventData);
    } else {
      console.log(`Event from '${deviceId}': `, eventData.body);
    }
  });
}

async function listen(eventHubClient, callback) {
  const partitionIds = await eventHubClient.getPartitionIds();
  function onMessage(eventData) {
    callback(eventData, null);
  }
  function onError(error) {
    callback(null, error);
  }
  partitionIds.forEach((partitionId) => {
    eventHubClient.receive(partitionId, onMessage, onError, {
      eventPosition: EventPosition.fromEnqueuedTime(Date.now()),
    });
  });
}
