package com.example.oblig2;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
public class TicketOrderController {
    private final ArrayList<TicketOrder> tickets = new ArrayList<>();

    @PostMapping(
        value="/tickets",
        consumes = {MediaType.MULTIPART_FORM_DATA_VALUE,
                    MediaType.APPLICATION_FORM_URLENCODED_VALUE},
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<TicketOrder> addTicket(@Valid TicketOrder ticket) {
        tickets.add(ticket);
        return new ResponseEntity<>(ticket, HttpStatus.CREATED);
    }

    @DeleteMapping(
        value ="/tickets",
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<List<TicketOrder>> deleteTickets() {
        tickets.clear();
        return new ResponseEntity<>(tickets, HttpStatus.OK);
    }
}
