// The client side application core.

import {doGet, doDelete, doPostAndReThrowErrors,
        ResponseNotOkError} from "./request.js";
import {getValidators, PATTERN_MISMATCH, ValidatorGroup} from "./validate.js";


const MOVIES_PATH = "/movies";
const ORDERS_PATH = "/ticket-orders";

// bootstrap scopes css :invalid and :valid to parent .was-validated
const VALIDATION_VISIBLE_CSS = "was-validated";


function trimFormData(formData) {
    for (let key of formData.keys()) {
        formData.set(key, formData.get(key).trim());
    }
    return formData;
}


function addOption(select, value, textContent) {
    let option = document.createElement("option");
    option.value = value;
    option.textContent = textContent;
    select.add(option);
}


function insertTableRow(tableBody, cellContent) {
    let newRow = tableBody.insertRow()
    for (let arg of cellContent) {
        let cell = newRow.insertCell();
        if (arg instanceof HTMLElement) {
            cell.appendChild(arg);
        } else {
            cell.textContent = arg;
        }
    }
}


function clearTableBody(tableBody) {
    // firstChild null if no children
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }
}


export default class TicketOrderClient {
    constructor(baseUrl) {
        this.urls = {
            get movies() {return new URL(MOVIES_PATH, baseUrl)},
            get orders() {return new URL(ORDERS_PATH, baseUrl)}
        }
        this.form = document.querySelector("form");
        this.form.noValidate = true;
        this.validators = new ValidatorGroup(
            ...getValidators(
                this.form,
                e => document.querySelector(`#${e.id} ~ .invalid-feedback`)
            )
        );
        this.tableBody = document.querySelector("tbody");
        this.movieMap = new Map();
    }

    setValidationVisible(validator, visible) {
        let parentElem = validator.inputElem.parentElement;
        if (visible) {
            parentElem.classList.add(VALIDATION_VISIBLE_CSS);
        } else {
            parentElem.classList.remove(VALIDATION_VISIBLE_CSS);
        }
    }

    createDeleteByIdButton(orderId) {
        let url = this.urls.orders;
        url.pathname = url.pathname.concat(`/${orderId}`);

        let btnDelete = document.createElement("button");
        btnDelete.textContent = "Delete";
        btnDelete.classList.add("btn", "btn-secondary", "btn-sm");

        btnDelete.addEventListener("click", event => {
            doDelete(url).then(numRows => {
                this.processDeleteResponse(url, numRows);
            });
        });
        return btnDelete;
    }

    processDeleteResponse(url, numRows) {
        if (numRows !== null) {
            console.debug("DELETE", url.href, numRows, "row/-s deleted");
            this.updateTableBody();
        }
    }

    updateTableBody() {
        clearTableBody(this.tableBody);
        // This extra GET because explicitly asked to sort on server
        let url = this.urls.orders;
        // above returns a new URL instance
        url.search = "order_by=lastname.asc";
        doGet(url).then(orders => {
            if (orders !== null) {
                for (let order of orders) {
                    let btnDelete = this.createDeleteByIdButton(order.id);
                    insertTableRow(
                        this.tableBody, [
                            this.movieMap.get(order.id).title,
                            order.numberOfTickets,
                            order.firstName,
                            order.lastName,
                            order.phoneNumber,
                            order.emailAddress,
                            btnDelete
                        ]
                    )
                }
            }
        });
    }

    configureValidators() {
        let numberValidator = this.validators.getValidator("numberOfTickets");
        let firstNameValidator = this.validators.getValidator("firstName");
        let lastNameValidator = this.validators.getValidator("lastName");

        numberValidator.setConstraintErrorMessage(
            PATTERN_MISMATCH, "please enter a positive number"
        );
        numberValidator.setConstraint(
            "numberTooLow",
            validationContext => validationContext.value >= 1,
            "Must order at least 1 ticket"
        );
        numberValidator.setConstraint(
            "numberTooHigh",
            validationContext => validationContext.value <= 100,
            "Sorry, our max capacity is 100"
        );

        firstNameValidator.setConstraintErrorMessage(
            PATTERN_MISMATCH,
            "Apologies, failed to validate your name, we hope it is a typo?"
        )
        lastNameValidator.setConstraintErrorMessage(
            PATTERN_MISMATCH,
            "Apologies, we failed to validate your name, we hope it is a typo?"
        )
    }

    startValidation() {
        for (let validator of this.validators) {
            validator.inputElem.addEventListener("blur", event => {
                    validator.validate();
                    this.setValidationVisible(validator, true);
                })
            validator.inputElem.addEventListener("focus", event => {
                    this.setValidationVisible(validator, false);
                }
            )
        }
    }

    handleServerSideConstraintViolation(response) {
        if (!response.hasOwnProperty("failedValidations")) {
            // Something unexpected happened, logged by request.js
            return;
        }
        for (let failed of response["failedValidations"]) {
            let validator = this.validators.getValidator(failed["fieldName"]);
            validator.forceValidationMessage(failed["message"]);
        }
        for (let validator of this.validators){
            this.setValidationVisible(validator, true);
        }
    }

    handleValidForm() {
        let url = this.urls.orders;
        let formData = new FormData(this.form);
        trimFormData(formData);

        doPostAndReThrowErrors(url, {body: formData}).then(newId => {
            console.debug("Ticket order created, resource id =", newId);
            for (let validator of this.validators) {
                this.setValidationVisible(validator, false);
            }
            this.form.reset();
            this.updateTableBody();
        }).catch(error => {
            if (error instanceof ResponseNotOkError
                && error.status === 400) {
                error.responseJSON().then(response => {
                    this.handleServerSideConstraintViolation(response);
                });
            }
        });
    }

    handleInvalidForm() {
        for (let validator of this.validators) {
            validator.validate();
            this.setValidationVisible(validator, true);
        }
    }

    handleFormSubmit(event) {
        event.preventDefault();
        if (this.validators.checkValidity()) {
            this.handleValidForm();
        } else {
            this.handleInvalidForm();
        }
    }

    handleDeleteAll(event) {
        let url = this.urls.orders;
        doDelete(url).then(numRows => {
            this.processDeleteResponse(url, numRows);
        });
    }

    run() {
        doGet(this.urls.movies).then(movies => {
            if (movies !== null) {
                let select = document.querySelector("select");
                movies.forEach(movie => {
                    addOption(select, movie.id, movie.title);
                    this.movieMap.set(movie.id, movie);
                });
            }
        });

        this.configureValidators();
        this.startValidation();

        this.form.addEventListener("submit", event => {
            this.handleFormSubmit(event);
        });
        document.querySelector("#delete-tickets").addEventListener(
            "click", event => {
            this.handleDeleteAll(event);
        });
    }
}