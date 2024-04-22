package com.example.oblig2;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class MovieRepository {

    private static class MovieRowMapper implements RowMapper<Movie> {
        @Override
        public Movie mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new Movie(rs.getInt("MovieId"), rs.getString("Title"));
        }
    }

    static final String SQL_GET_MOVIE
        = "SELECT * FROM Movie WHERE MovieId=?";
    static final String SQL_GET_ALL_MOVIES
        = "SELECT * FROM Movie";

    private final JdbcTemplate jdbcTemplate;
    private final MovieRowMapper rowMapper;

    @Autowired
    public MovieRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
        this.rowMapper = new MovieRowMapper();
    }

    public Movie getMovie(int movieId) {
        return jdbcTemplate.queryForObject(SQL_GET_MOVIE, rowMapper, movieId);
    }

    public List<Movie> getAllMovies() {
        return this.jdbcTemplate.query(SQL_GET_ALL_MOVIES, rowMapper);
    }
}
