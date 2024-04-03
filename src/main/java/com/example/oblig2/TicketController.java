package com.example.oblig2;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
public class TicketController {
    private final ArrayList<Ticket> tickets = new ArrayList<>();

    @PostMapping(
        value="/tickets",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<Ticket> addTicket(@Valid Ticket ticket) {
        tickets.add(ticket);
        return new ResponseEntity<>(ticket, HttpStatus.CREATED);
    }

    @DeleteMapping(
        value ="/tickets",
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<List<Ticket>> deleteTickets() {
        tickets.clear();
        return new ResponseEntity<>(tickets, HttpStatus.OK);
    }
}
