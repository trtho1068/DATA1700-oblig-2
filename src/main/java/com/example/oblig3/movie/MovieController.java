package com.example.oblig3.movie;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
public class MovieController {
    private final MovieRepository repository;

    @Autowired
    public MovieController(MovieRepository repository) {
        this.repository = repository;
    }

    @GetMapping(
        value = "/movies",
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<List<Movie>> getMovies() {
        List<Movie> movies = this.repository.getAllMovies();
        return new ResponseEntity<>(movies, HttpStatus.OK);
    }

    @GetMapping(
        value = "/movies/{id}",
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<Movie> getMovie(@PathVariable int id) {
        Movie movie = repository.getMovie(id);
        return new ResponseEntity<>(movie, HttpStatus.OK);
    }
}
