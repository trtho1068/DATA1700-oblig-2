export {
    request,
    ResponseNotOkError,
    doGet, doGetAndReThrowErrors,
    doPost, doPostAndReThrowErrors,
    doDelete, doDeleteAndReThrowErrors,
};


class ResponseNotOkError extends Error {
    constructor(response) {
        super(response.status.toString());
        this.name = "ResponseNotOkError";
        this.response = response;
    }

    get status() {
        return this.response.status;
    }

    responseJSON() {
        return this.response.json();
    }
}


function logError(error, url, options) {
    console.error(
        error, "while requesting resource", url.href, "with options", options
    );
}


function request(url, options, reThrowErrors = false) {
    return fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new ResponseNotOkError(response);
            }
            let type = response.headers.get("content-type");
            if (type !== "application/json") {
                throw new TypeError(`Expected json, got ${type}`);
            }
            return response.json();
        })
        .catch(error => {
            logError(error, url, options);
            if (reThrowErrors) {
                throw error;
            }
            return null;
        });
}


function buildOptions(method, options) {
    if (!options) {
        options = {};
    }
    options.method = method;
    return options;
}


function doGet(url, options) {
    return request(url, buildOptions("GET", options));
}


function doGetAndReThrowErrors(url, options) {
    return request(url, buildOptions("GET", options), true);
}


function doPost(url, options) {
    return request(url, buildOptions("POST", options));
}


function doPostAndReThrowErrors(url, options) {
    return request(url, buildOptions("POST", options), true);
}


function doDelete(url, options) {
    return request(url, buildOptions("DELETE", options));
}


function doDeleteAndReThrowErrors(url, options) {
    return request(url, buildOptions("DELETE", options), true);
}

