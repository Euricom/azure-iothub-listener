# Azure IoT Hub Listener
IoTHubListener is a simple tool to log any incoming device event from the Azure IotHub.

## Install

First make sure you have installed the latest LTS version (or higher) of [node.js](http://nodejs.org/)

From NPM for use as a command line app:

    npm install @euricom/iothub-listener -g

## Command line usage

Usage

```
iothub-listener <cstr> [options]
```

Command and options

```bash
# print usage
$ iothub-listener --help
iothub-listener <cstr> [options]

Listen to Azure IoT Hub device events.

Positionals:
  cstr  Azure IoTHub connection string         [string]

Options:
  --help         Show help                     [boolean]
  --version      Show version number           [boolean]
  --verbose, -v  More verbose logging          [boolean]

# print version number
$ iothub-listener --version
1.0.5

# start listening
$ iothub-listener "HostName=yourname.azure-devices.net;Shar...."
Listening to Azure IoTHub events... (ctrl-c to quit)
Event from 'ValueSensorHub':  { id: 123, value: 12.0 } 

# start listening in verbose
$ iothub-listener "HostName=yourname.azu...." --verbose
Listening to Azure IoTHub events... (ctrl-c to quit)
```

