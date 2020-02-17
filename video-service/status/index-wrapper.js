const recorder = require('watchtower-recorder');
const eventsStreamName = process.env['WATCHTOWER_EVENT_KINESIS_STREAM'];
const debug = process.env.DEBUG_WATCHTOWER;

// Loading modules that fail when required via vm2
const aws = require('aws-sdk');
const cp = require('child_process');

let context, lambdaExecutionContext, lambdaInputEvent;
function updateContext(name, event, lambdaContext) { context = name; lambdaExecutionContext = lambdaContext; lambdaInputEvent = event; }

const mock = {
    'aws-sdk' : aws,
    'child_process': {
        'exec': cp.exec,
        'spawn': (...params) => {
            const command = params[0];
            const args = params[1];
            const recoveredArgs = []
            for (const arg of args) {
                recoveredArgs.push(arg);
            }

            return cp.spawn(command, recoveredArgs);
        },
    },
};

module.exports.handler = recorder.createRecordingHandler('status/index.js', 'handler', mock, false, updateContext, true);
