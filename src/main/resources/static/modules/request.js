export {request, HTTPError};


class HTTPError extends Error {
    constructor(response) {
        super(response.status.toString());
        this.name = "HTTPError";
        this.response = response;
    }

    responseText() {
        return this.response.text();
    }
}


function logException(urlStr, options, exc, additional) {
    console.group("Error requesting resource:", urlStr);
    console.error(exc);
    console.log("options:", options);
    if (additional) {
        console.log(additional);
    }
    console.groupEnd();
}


function request(urlStr, options) {
    return fetch(urlStr, options)
        .then(response => {
            if (!response.ok) {
                throw new HTTPError(response);
            }
            let type = response.headers.get("content-type");
            if (type !== "application/json") {
                throw new TypeError(`Expected json, got ${type}`);
            }
            return response.json();
        })
        .catch(exc => {
            if (exc instanceof HTTPError) {
                exc.responseText()
                    .then(text => {
                        logException(
                            urlStr, options, exc, `response body: ${text}`
                        );
                    });
            } else {
                logException(urlStr, options, exc);
            }
            return null;
        });
}