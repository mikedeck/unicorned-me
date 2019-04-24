'use strict';

const url = require('url');
const https = require('https');

const USERNAME = "Unicorn Tracker",
      ICON_EMOJI = ":unicorn_face:",
      ATTACHMENT_COLOR = "#f400af";


class SlackUnicornSender {
    constructor(options) {
        this.channel = options.channel;
        this.trackingDomain = options.trackingDomain;
        this.hookUrl = options.hookUrl;
    }

    sendUnicornMessage(params) {
        return this.postSlackMessage({
            "channel": this.channel,
              "username": USERNAME,
              "icon_emoji": ICON_EMOJI,
              "attachments": [
                  {
                      "fallback": `${params.attacker} just unicorned ${params.victim}!`,
                      "color": ATTACHMENT_COLOR,
                      "title": `${params.attacker} just got ${params.victim}`,
                      "text": `This is the ${toOrdinal(params.count)} time ${params.attacker} has unicorned ${params.victim}.`,
                      "fields": [
                          {
                              "title": `All-time by ${params.attacker}`,
                              "value": params.totalAttacks,
                              "short": true
                          },
      
                          {
                              "title": `All-time against ${params.victim}`,
                              "value": params.totalVictimizations,
                              "short": true
                          }
                      ],
                      "footer": `cc <your_alias>@${this.trackingDomain} to start tracking your unicorns!`,
                      "footer_icon": "https://platform.slack-edge.com/img/default_application_icon.png"
                  }
              ]
          });
    }

    postSlackMessage(message) {
      const body = JSON.stringify(message);
      const options = url.parse(this.hookUrl);
      options.method = 'POST';
      options.headers = {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
      };

      console.log("Sending notification to slack: " + body);

      return new Promise((resolve, reject) => {
          var postReq = https.request(options, function(res) {
              var chunks = [];
              res.setEncoding('utf8');
              res.on('data', function(chunk) {
                  return chunks.push(chunk);
              });
              res.on('end', function() {
                  var body = chunks.join('');
                  resolve({
                      body: body,
                      statusCode: res.statusCode,
                      statusMessage: res.statusMessage
                  });
              });
              return res;
          });

          postReq.write(body);
          postReq.end();
      });
    }
}

function toOrdinal(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

module.exports = SlackUnicornSender;