import { Engine } from 'json-rules-engine';
import 'dotenv/config'

const FUNCTION_ERROR_CODES_BEGIN = "82001"
const FUNCTION_ERROR_CODES_END = "82009"
const STUDIO_ERROR_CODES_BEGIN = "81000"
const STUDIO_ERROR_CODES_END = "81026"
const mainAccountSid = process.env.TWILIO_MAIN_ACCOUNT_SID;
const subAccounts = [ "ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", "ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" ] //Here you can list all your subaccounts
const FUNCTION_SID = "ZHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"

const rulejson1 = {  
    conditions: {
      any: [{
        all: [
          {
          fact: 'webhookData',
          operator: 'in',
          value: subAccounts,
          path: '$.AccountSid'
        },
        {
          all: [
              {
              fact: 'webhookData',
              operator: 'greaterThanInclusive',
              value: FUNCTION_ERROR_CODES_BEGIN,
              path: '$.Payload.error_code'
            },
            {
              fact: 'webhookData',
              operator: 'lessThanInclusive',
              value: FUNCTION_ERROR_CODES_END,
              path: '$.Payload.error_code'
            },
            {
                fact: 'webhookData',
                operator: 'equal',
                value: 'ERROR',
                path: '$.Level'
            }
            ]
        }]
    },
  ]
    },
    event: {
      type: 'subAccountError',
      params: {
        message: 'Error in Twilio Function',
        action: 'send-email',
        data: {
            fact: 'webhookData',
        }
      }
    }
}

const rulejson2 = {
  conditions: {
    any: [{
      all: [
        {
        fact: 'webhookData',
        operator: 'equal',
        value: mainAccountSid,
        path: '$.AccountSid'
      },
      {
        all: [
            {
            fact: 'webhookData',
            operator: 'equal',
            value: FUNCTION_SID,
            path: '$.Payload.service_sid'
          },
          {
              fact: 'webhookData',
              operator: 'equal',
              value: 'ERROR',
              path: '$.Level'
            }
          ]
      }]
  }
]
  },
  event: {
    type: 'functionError',
    params: {
      message: `Error in Function ${functionSid}`,
      action: 'send-email',
      data: {
          fact: 'webhookData',
      }
    }
  }
}

const rulejson3 = {
  conditions: {
    any: [{
      all: [
        {
        fact: 'webhookData',
        operator: 'equal',
        value: mainAccountSid,
        path: '$.AccountSid'
      },
      {
        all: [
          {
          fact: 'webhookData',
          operator: 'greaterThanInclusive',
          value: STUDIO_ERROR_CODES_BEGIN,
          path: '$.Payload.error_code'
        },
        {
          fact: 'webhookData',
          operator: 'lessThanInclusive',
          value: STUDIO_ERROR_CODES_END,
          path: '$.Payload.error_code'
        },
        {
            fact: 'webhookData',
            operator: 'equal',
            value: 'ERROR',
            path: '$.Level'
        }
        ]
      }]
  }
]
  },
  event: {
    type: 'studioError',
    params: {
      message: 'Error in Studio flow',
      action: 'send-email',
      eventType: "condition",
      data: {
          fact: 'webhookData',
      }
    }
  }
}

const thresholdRule = {
  [rulejson1.event.type]: {
    count: 3,
    threshold: 60000 // in milliseconds
  },
  [rulejson2.event.type]: {
    count: 5,
    threshold: 60000
  },
  [rulejson3.event.type]: {
    count: 10,
    threshold: 60000
  }
}

const engine = new Engine([], { replaceFactsInEventParams: true })
engine.addRule(rulejson1)
engine.addRule(rulejson2)
engine.addRule(rulejson3)
export { engine, thresholdRule };