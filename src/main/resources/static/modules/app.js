/*
*  The core client side app.
*  Extracting this into its own module gives me a dead simple entry point,
*  and a structure that makes somewhat sense in my head, at the expense of
*  a few extra lines of code.
*/


import {request} from "./request.js";
import {getValidators, ValidatorGroup} from "./validate.js";


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
        this.validators = new ValidatorGroup(
            ...getValidators(
                this.form,
                e => document.querySelector(`#${e.id} ~ .invalid-feedback`)
            )
        );
        this.tableBodyTickets = document.querySelector("tbody");
    }

    handleValidForm() {
        let formData = new FormData(this.form);
        trimFormData(formData);
        request(TICKETS_PATH, {method: "POST", body: formData})
            .then(ticket => {
                addTableRow(this.tableBodyTickets, ticket);
                this.validators.stopLiveUpdates();
                this.form.classList.remove(BS_CSS_VALIDITY_SCOPE);
                this.form.reset();
            });
    }

    handleInvalidForm() {
        this.validators.startLiveUpdates();
        // classList.add omits already present tokens
        this.form.classList.add(BS_CSS_VALIDITY_SCOPE);
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

        this.form.addEventListener("submit", event => {
            this.handleFormSubmit(event);
        });
        document.querySelector("#delete-tickets").addEventListener(
            "click", event => {
            this.handleDeleteTickets(event);
        });
    }
}