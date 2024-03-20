"use strict";

/*
* Not necessary to solve the assignment, but an opportunity
* for me to learn a little about js objects and prototypes
*/
function InputValidator(inputElem, errorElem, missingValueMsg, badValueMsg) {
    this.inputElem = inputElem;
    this.errorElem = errorElem;
    this.missingValueMsg = missingValueMsg;
    this.badValueMsg = badValueMsg;
}

InputValidator.prototype.register = function (eventType) {
    this.inputElem.addEventListener(eventType, this);
};

// Enable registering instances as event handlers
InputValidator.prototype.handleEvent = function() {
    this.validate();
}

/*
 * Can not be used directly with addEventListener as "this" in that
 * context would refer to the event target i.e. inputElem --> TypeError
 * Some options:
 * 1) Implement the required interface (handleEvent)
 * 2) Register an anonymous func calling validate
 */
InputValidator.prototype.validate = function () {
    let validityState = this.inputElem.validity;
    if (validityState.valid) {
        if (this.errorElem.textContent) {
            this.errorElem.textContent = "";
        }
    } else {
        this.showErrorMessage(validityState);
    }
};

InputValidator.prototype.showErrorMessage = function (validityState) {
    if (validityState.valueMissing) {
        this.errorElem.textContent = this.missingValueMsg;
    } else {
        this.errorElem.textContent = this.badValueMsg;
    }
};


function Ticket(movie, number, firstname, lastname, phoneNumber, emailAddress) {
    this.movie = movie;
    this.number = number;
    this.firstname = firstname;
    this.lastname = lastname;
    this.phoneNumber = phoneNumber;
    this.emailAddress = emailAddress;
}


function insertIntoTableElement(ticket, tableElement) {
    let newRow = tableElement.insertRow();
    for (let key in ticket) {
        let cell = newRow.insertCell();
        cell.textContent = ticket[key];
    }
}


function addOptionElem(selectElem, value, textContent) {
    let option = document.createElement("option");
    option.value = value;
    option.textContent = textContent;
    selectElem.add(option);
}


/******************************************************************************/
let tickets = [];
let form = document.querySelector("#ticket");

let movieValidator = new InputValidator(
    document.querySelector("#movie"),
    document.querySelector("#error-movie"),
    "Må velge film"
)
let numberValidator = new InputValidator(
    document.querySelector("#number"),
    document.querySelector("#error-number"),
    "Antall må fylles ut",
    "Ugyldig antall"
);
let firstnameValidator = new InputValidator(
    document.querySelector("#firstname"),
    document.querySelector("#error-firstname"),
    "Fornavn må fylles ut",
    "Ugyldig fornavn"
);
let lastNameValidator = new InputValidator(
    document.querySelector("#lastname"),
    document.querySelector("#error-lastname"),
    "Etternavn må fylles ut",
    "Ugyldig etternavn"
);
let phoneNumberValidator = new InputValidator(
    document.querySelector("#phone-number"),
    document.querySelector("#error-phone-number"),
    "",
    "Ugyldig telefonnr"
);
let emailValidator = new InputValidator(
    document.querySelector("#email"),
    document.querySelector("#error-email"),
    "Epost addresse må fylles ut",
    "Ugyldig epost addresse"
);

let buttonBuyTicket = document.querySelector("#buy-ticket");
let buttonDeleteTickets = document.querySelector("#delete-tickets");
let tableBodyAllTickets = document.querySelector("#all-tickets");


if (sessionStorage.getItem("tickets")) {
    tickets = JSON.parse(sessionStorage.getItem("tickets"));
}

for (let ticket of tickets) {
    insertIntoTableElement(ticket, tableBodyAllTickets);
}


function initMovies(selectElem) {
    fetch("/movies")
        .then(response => {
            if (!response.ok) {
                return null;
            }
            let type = response.headers.get("content-type");
            if (type !== "application/json") {
                throw new TypeError(`Expected JSON, got ${type}`);
            }
            return response.json();
        })
        .then(movies => {
            if (movies) {
                for (let movie of movies) {
                    addOptionElem(selectElem, movie, movie);
                }
            }
        })
        .catch(exc => {
            console.error(exc);
        })
}
initMovies(movieValidator.inputElem);

if (sessionStorage.getItem("selectedIndex")) {
    movieValidator.inputElem.selectedIndex =
        sessionStorage.getItem("selectedIndex");
}

let initErrorMessages = () => {
    movieValidator.validate();
    numberValidator.validate();
    firstnameValidator.validate();
    lastNameValidator.validate();
    phoneNumberValidator.validate();
    emailValidator.validate();
};
initErrorMessages();

movieValidator.register("change");
movieValidator.inputElem.addEventListener("change", (event) => {
   sessionStorage.setItem(
       "selectedIndex", movieValidator.inputElem.selectedIndex
   )
});
numberValidator.register("input");
firstnameValidator.register("input");
lastNameValidator.register("input");
phoneNumberValidator.register("input");
emailValidator.register("input");

buttonBuyTicket.addEventListener("click", (event) => {
    // if form.checkValidity()
    if (true) {
        let ticket = new Ticket(
            movieValidator.inputElem.value,
            parseInt(numberValidator.inputElem.value),
            firstnameValidator.inputElem.value,
            lastNameValidator.inputElem.value,
            phoneNumberValidator.inputElem.value,
            emailValidator.inputElem.value,
        )
        tickets.push(ticket);

        fetch("/tickets", {
            method: "POST",
            headers: new Headers({"Content-Type": "application/json"}),
            body: JSON.stringify(ticket)
        })
            .then(response => response.text())
            .then(reply => console.log(`Server says ${reply}`));


        insertIntoTableElement(ticket, tableBodyAllTickets);
        sessionStorage.setItem("tickets", JSON.stringify(tickets));
        sessionStorage.removeItem("selectedIndex");

        form.reset();
        initErrorMessages();
    }
});

buttonDeleteTickets.addEventListener("click", (event) => {
    tickets.splice(0, tickets.length);
    sessionStorage.removeItem("tickets");

    while (tableBodyAllTickets.firstChild) {
        // firstChild null if no children
        tableBodyAllTickets.removeChild(tableBodyAllTickets.firstChild);
    }
    fetch("/tickets", {
        method: "DELETE"
    })
        .then(response => response.text())
        .then(text => console.log(`Server says ${text}`));
});
