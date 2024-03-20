package com.example.oblig2;

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

    @GetMapping("/movies")
    public String[] getMovies() {
        return movies;
    }
}
