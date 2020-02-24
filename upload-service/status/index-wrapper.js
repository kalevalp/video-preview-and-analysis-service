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

if (require.main === module) {
    const handler = recorder.createRecordingHandler('./status/index.js', 'handler', mock, true, updateContext, true);

    const event = JSON.parse(`{
        "Records": [
            {
                "EventSource": "aws:sns",
                "EventVersion": "1.0",
                "EventSubscriptionArn": "arn:aws:sns:eu-west-2:432356059652:video-render-ready-topic-dev:8ac73ad8-1520-4ad6-98ca-6a385a326a14",
                "Sns": {
                    "Type": "Notification",
                    "MessageId": "ad7f290b-b0a4-501a-a1ed-7fc71a1ab5bc",
                    "TopicArn": "arn:aws:sns:eu-west-2:432356059652:video-render-ready-topic-dev",
                    "Subject": "Amazon S3 Notification",
                    "Message": "{\"Records\":[{\"eventVersion\":\"2.1\",\"eventSource\":\"aws:s3\",\"awsRegion\":\"eu-west-2\",\"eventTime\":\"2020-02-23T16:29:48.348Z\",\"eventName\":\"ObjectCreated:Put\",\"userIdentity\":{\"principalId\":\"AWS:AROAWJKTN5ICOWPPJOUI6:et-video-service-dev-status\"},\"requestParameters\":{\"sourceIPAddress\":\"35.178.44.48\"},\"responseElements\":{\"x-amz-request-id\":\"626AD3EC15411F0A\",\"x-amz-id-2\":\"fOdzNsCOPv16Wn2JeAZ7Wxvmr3xrHnFcgw5xLYF/2bMx+Rbj32ZDtXiFF+eEUy6Meu31QwP148RVROAHM1q5uOVwYZnR8HlO\"},\"s3\":{\"s3SchemaVersion\":\"1.0\",\"configurationId\":\"3f99a240-7ad5-4e01-ad5e-1bf2a861bbab\",\"bucket\":{\"name\":\"et-video-service-dev-renderbucket-1jka4zqaac42b\",\"ownerIdentity\":{\"principalId\":\"ADMDWF3VACH9R\"},\"arn\":\"arn:aws:s3:::et-video-service-dev-renderbucket-1jka4zqaac42b\"},\"object\":{\"key\":\"3e650a38-2cb8-44de-baf1-41d01481c5bf/metadata.json\",\"size\":17845,\"eTag\":\"fb8d00b7ba638954b8e6c5d6ab6891c1\",\"sequencer\":\"005E52A87D43C29EBB\"}}}]}",
                    "Timestamp": "2020-02-23T16:29:50.152Z",
                    "SignatureVersion": "1",
                    "Signature": "enrenQymKH3yez8nS24HbBYUhFSUdx+hE4V0fI0IPiu7jE1PWxMLsY3INWyoQxVNBREVtSl3R286+/IABssyVBUib7F09a+/Q1/dAVB5E4Bmq9XifAK9M/vNGha1lq08ESFGAuTF0nbFLhJjGrOeFkQW4FesbFcTO/WKOcQxYn5gKvlj0LyBsnEi2QbBSpz/vksigDzh2Fdoomn5KyheMukD+sbKDWoeuo4XnS4Y8BpGcB8Fr+839hO8EwZyfsTC4whdNc1JJpYEJQpTHjDvnO1KJv0XtbOrV32559Tz6+DvYHlmyQR2xTxJ5IQyuYGd2clPB+rwfnlgJ1rvS7hBrA==",
                    "SigningCertUrl": "https://sns.eu-west-2.amazonaws.com/SimpleNotificationService-a86cb10b4e1f29c941702d737128f7b6.pem",
                    "UnsubscribeUrl": "https://sns.eu-west-2.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:eu-west-2:432356059652:video-render-ready-topic-dev:8ac73ad8-1520-4ad6-98ca-6a385a326a14",
                    "MessageAttributes": {}
                }
            }
        ]
    }`);
    console.log(event);
    // const event = {}
    // const callback = (err, data) => console.log("Callback called with", err ? `err: ${JSON.stringify(err)}` : `data: ${JSON.stringify(data)}`);

    // handler(event, {}, callback);

} else {
    module.exports.handler = recorder.createRecordingHandler('./status/index.js', 'handler', mock, false, updateContext, true);
}
