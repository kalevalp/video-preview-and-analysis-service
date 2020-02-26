const recorder = require('watchtower-recorder');
const eventsStreamName = process.env['WATCHTOWER_EVENT_KINESIS_STREAM'];
const publisher = recorder.createEventPublisher(eventsStreamName);
const crypto = require('crypto');

const debug = process.env.DEBUG_WATCHTOWER;

// Loading modules that fail when required via vm2
const aws = require('aws-sdk');
const cp = require('child_process');

let context, lambdaExecutionContext, lambdaInputEvent;
function updateContext(name, event, lambdaContext) { context = name; lambdaExecutionContext = lambdaContext; lambdaInputEvent = event; }


const proxyConditions = [];
proxyConditions.push({
    scope: 'S3',
    functionName: 'getObject',
    condition: () => true,
    opInSucc: (argumentsList) => (response) => {
        const hash = crypto.createHash('sha256');
        hash.update(response.data.Body);
        publisher({name: "GOT_OBJECT", params: {key: argumentsList[0].Key, data: hash.digest('base64')}}, lambdaExecutionContext, Date.now())
    }
})

const mock = {
    'aws-sdk' : recorder.createAWSSDKMock(proxyConditions),
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

module.exports.handler = recorder.createRecordingHandler('./status/index.js', 'handler', mock, false, updateContext, true);
