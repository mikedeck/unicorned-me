'use strict';

exports.handler = (event, context, callback) => {
    const uri = event.Records[0].cf.request.uri;
    const alias = calcAlias(uri);
    if(!alias) {
        callback(null, {
            status: '400',
            statusDescription: 'Bad Request',
            headers: {
                'cache-control': [{
                    key: 'Cache-Control',
                    value: 'max-age=300'
                }],
                'content-type': [{
                    key: 'Content-Type',
                    value: 'text/html'
                }],
                'content-encoding': [{
                    key: 'Content-Encoding',
                    value: 'UTF-8'
                }],
            },
            body: '<!doctype html><head></head><body><p>If you specify a path on this domain it must be a valid local-part of an email address.</p></body>',
        });
        return;
    }
    
    callback(null, buildRedirectResponse(alias));
};

function calcAlias(uri) {
    const match = uri.match(/^\/([a-zA-z_\-.+]+)$/);
    return match ? match[1] : null;
}

function buildRedirectResponse(alias) {
    const redirectLocation = `mailto:aws-sa-partners@amazon.com?bcc=${alias}@awsunicorns.com&subject=I Love Unicorns!!!&body=I can't help it, but I love UNICORNS! I really do!!`
    return {
        status: '301',
        statusDescription: 'Moved Permanently',
        headers: {
            'cache-control': [{
                key: 'Cache-Control',
                value: 'max-age=31536000'
            }],
            'location': [{
                key: 'Location',
                value: redirectLocation
            }]
        },
        body: `<!doctype html><head><title>Send a Unicorn</title></head><body><p>An email window should have already popped up, but if not, use this <a href="${redirectLocation}">link</a></p></body>`
    }
}