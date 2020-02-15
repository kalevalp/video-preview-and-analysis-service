const recorder = require('watchtower-recorder');
const eventsStreamName = process.env['WATCHTOWER_EVENT_KINESIS_STREAM'];
const debug = process.env.DEBUG_WATCHTOWER;

// Loading modules that fail when required via vm2
const aws = require('aws-sdk');

let context, lambdaExecutionContext, lambdaInputEvent;
function updateContext(name, event, lambdaContext) { context = name; lambdaExecutionContext = lambdaContext; lambdaInputEvent = event; }

const mock = {
    'aws-sdk' : aws,
};

module.exports.handler = recorder.createRecordingHandler('get-labels/index.js', 'handler', mock, false, updateContext, true);
