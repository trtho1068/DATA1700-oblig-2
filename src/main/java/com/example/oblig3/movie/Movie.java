package com.example.oblig3.movie;


public class Movie {
    private final Integer id;
    private final String title;

    public Movie(Integer id, String title) {
        this.id = id;
        this.title = title;
    }

    public Integer getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }
}
