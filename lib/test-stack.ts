import { Stack, StackProps } from "aws-cdk-lib"
import { StateMachine, Wait, WaitTime } from "aws-cdk-lib/aws-stepfunctions"
import { Construct } from "constructs"
// import * as sqs from 'aws-cdk-lib/aws-sqs';

function* genWaitSeconds(stack: TestStack): Generator<Wait> {
  let idx = 1
  while (true) {
    yield new Wait(stack, "Wait" + `${idx++}`, {
      time: WaitTime.secondsPath("$.wait_seconds"),
    })
  }
}

export class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'TestQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    // new aws_s3.Bucket(this, 'MyFirstBucketOld', {
    //   versioned: true,
    //   removalPolicy: RemovalPolicy.DESTROY,
    //   autoDeleteObjects: true
    // });

    const waitStartAt = new Wait(this, "Wait timestamp path", {
      time: WaitTime.timestampPath("$.start_at"),
    })

    const gen = genWaitSeconds(this)

    new StateMachine(this, "TestMachine", {
      definition: waitStartAt.next(gen.next().value).next(gen.next().value).next(gen.next().value),
    })
  }
}
