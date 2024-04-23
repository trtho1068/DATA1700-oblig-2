package com.example.oblig3.ticketorder;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/ticket-orders")
public class TicketOrderController {

    private final TicketOrderRepository repository;

    @Autowired
    public TicketOrderController(TicketOrderRepository repository) {
        this.repository = repository;
    }

    @GetMapping(
        value = "/{id}",
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<TicketOrder> getOrder(@PathVariable int id) {
        TicketOrder ticketOrder = repository.getOrder(id);
        return new ResponseEntity<>(ticketOrder, HttpStatus.OK);
    }

    @GetMapping(
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<List<TicketOrder>> getAllOrders(
        @RequestParam(name = "order_by",defaultValue = "") String orderBy
    ) {
        List<TicketOrder> allTicketOrders
            = repository.getAllOrders(orderBy);
        return new ResponseEntity<>(allTicketOrders, HttpStatus.OK);
    }

    @PostMapping(
        consumes = {MediaType.MULTIPART_FORM_DATA_VALUE,
                    MediaType.APPLICATION_FORM_URLENCODED_VALUE},
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<Integer> addOrder(
        @Valid TicketOrder ticketOrder
    ) {
        Integer newId = repository.addOrder(ticketOrder);
        return new ResponseEntity<>(newId, HttpStatus.CREATED);
    }

    @DeleteMapping(
        value = "/{id}",
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<Integer> deleteOrderById(@PathVariable int id) {
        Integer numRows = repository.deleteOrderById(id);
        return new ResponseEntity<>(numRows, HttpStatus.OK);
    }

    @DeleteMapping(
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<Integer> deleteAllOrders() {
        Integer numRows = repository.deleteAllOrders();
        return new ResponseEntity<>(numRows, HttpStatus.OK);
    }
}
