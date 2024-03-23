import {getJSON, postJSON, deleteJSON} from "./modules/requests.js";
import {FormValidityMessenger} from "./modules/form-validity-messenger.js";


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


function addOptionElem(value, textContent) {
    let selectElem = document.querySelector("#movie");
    let option = document.createElement("option");
    option.value = value;
    option.textContent = textContent;
    selectElem.add(option);
}


let formSelector = "#ticket";
let form = document.querySelector(formSelector);
let formValidityMessenger = new FormValidityMessenger(formSelector);
formValidityMessenger.listen();

let buttonBuyTicket = document.querySelector("#buy-ticket");
let buttonDeleteTickets = document.querySelector("#delete-tickets");
let tableBodyAllTickets = document.querySelector("#all-tickets");


getJSON("/movies")
    .then(movies => {
        if (movies !== null) {
            for (let movie of movies) {
                addOptionElem(movie, movie);
            }
        }
    });

buttonBuyTicket.addEventListener("click", (event) => {
    // if form.checkValidity()
    if (true) {
       let formData = new FormData(form);
       let ticket = new Ticket(...formData.values());
       console.log(ticket);
        postJSON("/tickets", ticket)
            .then(allTickets => {
                if (allTickets !== null) {
                    insertIntoTableElement(ticket, tableBodyAllTickets);
                    form.reset();
                }
            })
    }
});

buttonDeleteTickets.addEventListener("click", (event) => {
    deleteJSON("/tickets")
        .then(allTickets => {
            console.log(allTickets);
            if (allTickets !== null && allTickets.length === 0) {
                sessionStorage.removeItem("tickets");

                while (tableBodyAllTickets.firstChild) {
                    // firstChild null if no children
                    tableBodyAllTickets.removeChild(
                        tableBodyAllTickets.firstChild
                    );
                }
            }
        })
});



