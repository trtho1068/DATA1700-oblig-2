package com.example.oblig2;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MovieController {
    private static final String[] movies = {
        "Trolljegeren",
        "Børning 1",
        "Børning 2",
        "Into the Wild"
    };

    @GetMapping(
        value = "/movies",
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<String[]> getMovies() {
        return new ResponseEntity<>(movies, HttpStatus.OK);
    }
}
