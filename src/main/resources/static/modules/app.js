/*
*  The core client side app.
*  Extracting this into its own module gives me a dead simple entry point,
*  and a structure that makes somewhat sense in my head, at the expense of
*  a few extra lines of code.
*/


import {request} from "./request.js";
import {GroupValidator} from "./validate.js";


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
    static moviesPath = "/movies";
    static ticketsPath = "/tickets";
    // bootstrap scopes css :invalid and :valid to parent .was-validated
    static bsWasValidated = "was-validated";

    static getOutputElem(inputElem) {
        return document.querySelector(`#${inputElem.id} ~ .invalid-feedback`);
    }

    constructor() {
        this.form = document.querySelector("form");
        this.formValidator = GroupValidator.forForm(
            this.form, App.getOutputElem
        );
        this.tableBodyTickets = document.querySelector("tbody");
    }

    handleValidForm() {
        let formData = new FormData(this.form);
        trimFormData(formData);
        request(App.ticketsPath, {method: "POST", body: formData})
            .then(ticket => {
                addTableRow(this.tableBodyTickets, ticket);
                this.formValidator.stopValidation();
                this.form.classList.remove(App.bsWasValidated);
                this.form.reset();
            });
    }

    handleInvalidForm() {
        this.formValidator.ensureValidation();
        // classList.add omits already present tokens
        this.form.classList.add(App.bsWasValidated);
    }

    handleFormSubmit(event) {
        event.preventDefault();
        if (this.form.checkValidity()) {
            this.handleValidForm();
        } else {
            this.handleInvalidForm();
        }
    }

    handleDeleteTickets(event) {
        request(App.ticketsPath, {method: "DELETE"})
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
        request(App.moviesPath, {method: "GET"})
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