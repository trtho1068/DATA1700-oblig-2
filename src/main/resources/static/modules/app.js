// The client side application core.


import {request} from "./request.js";
import {getValidators, PATTERN_MISMATCH, ValidatorGroup} from "./validate.js";


const MOVIES_PATH = "/movies";
const TICKETS_PATH = "/tickets";

// bootstrap scopes css :invalid and :valid to parent .was-validated
const BS_CSS_VALIDITY_SCOPE = "was-validated";


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


function addTableRow(tableBody, ticket) {
    let newRow = tableBody.insertRow();
    for (let key in ticket) {
        let cell = newRow.insertCell();
        cell.textContent = ticket[key];
    }
}


function clearTableBody(tableBody) {
    // firstChild null if no children
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }
}


export default class App {
    constructor() {
        this.form = document.querySelector("form");
        this.form.noValidate = true;
        this.validators = new ValidatorGroup(
            ...getValidators(
                this.form,
                e => document.querySelector(`#${e.id} ~ .invalid-feedback`)
            )
        );
        this.tableBodyTickets = document.querySelector("tbody");

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
            "Apologies, we failed to validate your name, we hope it is a typo?"
        )
        lastNameValidator.setConstraintErrorMessage(
            PATTERN_MISMATCH,
            "Apologies, we failed to validate your name, we hope it is a typo?"
        )
    }

    setErrorMessageVisible(validator, visible) {
        let parentElem = validator.inputElem.parentElement;
        if (visible) {
            parentElem.classList.add(BS_CSS_VALIDITY_SCOPE);
        } else {
            parentElem.classList.remove(BS_CSS_VALIDITY_SCOPE);
        }
    }

    startValidation() {
        for (let validator of this.validators) {
            validator.inputElem.addEventListener(
                "blur", event => {
                    validator.validate();
                    this.setErrorMessageVisible(validator, true);
                })
            validator.inputElem.addEventListener(
                "focus", event => {
                    this.setErrorMessageVisible(validator, false);
                }
            )
        }
    }

    handleValidForm() {
        let formData = new FormData(this.form);
        trimFormData(formData);
        request(TICKETS_PATH, {method: "POST", body: formData})
            .then(ticket => {
                if (ticket !== null) {
                    for (let validator of this.validators) {
                        this.setErrorMessageVisible(validator, false);
                    }
                    this.form.reset();
                    addTableRow(this.tableBodyTickets, ticket);
                }
            });
    }

    handleInvalidForm() {
        for (let validator of this.validators) {
            validator.validate();
            this.setErrorMessageVisible(validator, true);
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

    handleDeleteTickets(event) {
        request(TICKETS_PATH, {method: "DELETE"})
            .then(tickets => {
                if (tickets !== null) {
                    if (tickets.length === 0) {
                        clearTableBody(this.tableBodyTickets);
                    } else {
                        console.warn(
                            "DELETE /tickets : unexpected response body: ",
                            tickets
                        );
                    }
                }
            })
    }

    run() {
        request(MOVIES_PATH, {method: "GET"})
            .then(movies => {
                if (movies !== null) {
                    let select = document.querySelector("#movie");
                    movies.forEach(movie => addOption(select, movie, movie));
                }
            });
        this.startValidation();

        this.form.addEventListener("submit", event => {
            this.handleFormSubmit(event);
        });
        document.querySelector("#delete-tickets").addEventListener(
            "click", event => {
            this.handleDeleteTickets(event);
        });
    }
}