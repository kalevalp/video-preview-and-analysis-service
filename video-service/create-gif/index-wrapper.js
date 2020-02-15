const recorder = require('watchtower-recorder');
const eventsStreamName = process.env['WATCHTOWER_EVENT_KINESIS_STREAM'];
const debug = process.env.DEBUG_WATCHTOWER;

// Loading modules that fail when required via vm2
const aws = require('aws-sdk');
const fse = require('fs-extra');

let context, lambdaExecutionContext, lambdaInputEvent;
function updateContext(name, event, lambdaContext) { context = name; lambdaExecutionContext = lambdaContext; lambdaInputEvent = event; }

const mock = {
    'aws-sdk' : aws,
    'fs-extra': fse,
};

module.exports.handler = recorder.createRecordingHandler('create-gif/index.js', 'handler', mock, false, updateContext, true);
