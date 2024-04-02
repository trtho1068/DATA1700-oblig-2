export {getJSON, postJSON, deleteJSON};


class HTTPError extends Error {
    constructor(response) {
        super(response.status.toString());
        this.name = "HTTPError";
        this.response = response;
    }

    // Log the error whenever the response body is ready
    logWhenReady() {
        this.response.text()
            .then(text => {
                console.error(
                    this.name, this.message, "\n  response body:", text
                );
            })
    }
}


function request(urlStr, options) {
    return fetch(urlStr, options)
        .then(response => {
            if (!response.ok) {
                throw new HTTPError(response);
            }
            let type = response.headers.get("content-type");
            if (type !== "application/json") {
                throw new TypeError(`Expected JSON, got ${type}`);
            }
            return response.json();
        })
        .catch(exc => {
            if (exc instanceof HTTPError) {
                exc.logWhenReady();
            }
            else {
                console.error(exc.name, exc.message);
            }
            return null;
        })
}