package com.example.oblig2;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
public class TicketController {
    private final ArrayList<Ticket> tickets = new ArrayList<>();

    @PostMapping( "/tickets")
    public List<Ticket> addTicket(@Valid @RequestBody Ticket ticket) {
        tickets.add(ticket);
        return tickets;
    }

    @DeleteMapping("/tickets")
    public List<Ticket> deleteTickets() {
        tickets.clear();
        return tickets;
    }
}
