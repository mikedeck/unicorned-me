#!/usr/bin/env python

import boto3
import json

cwlogs = boto3.client('logs')
lambda_client = boto3.client('lambda')

log_paginator = cwlogs.get_paginator('filter_log_events')
for page in log_paginator.paginate(logGroupName='/aws/lambda/SesUnicornTracker', filterPattern='"Received Event: "'):
    for log_event in page['events']:
        message = log_event['message']
        idx = message.find("Received Event: ")
        event_json = message[(idx + len("Received Event: ")):]
        event = json.loads(event_json)
        result = lambda_client.invoke(
            FunctionName='UnicornedMe-Dev-SesHandler-1LGDXMMEDAV7E',
            Payload=json.dumps(event).encode()
        )
        print(result['StatusCode'])

