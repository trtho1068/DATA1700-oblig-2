package com.example.oblig2;

import jakarta.validation.constraints.*;


public class TicketOrder {
    private Integer id;

    @NotNull
    private Integer movieId;

    @NotNull
    @Min(1)
    @Max(20)
    private Integer numberOfTickets;

    @NotBlank
    @Pattern(
        regexp = "[a-zA-Z\\xC0-\uFFFF]+([ \\-']?[a-zA-Z\\xC0-\uFFFF]+){0,2}[.]?"
    )
    private String firstName;

    @NotBlank
    @Pattern(
        regexp = "[a-zA-Z\\xC0-\uFFFF]+([ \\-']?[a-zA-Z\\xC0-\uFFFF]+){0,2}[.]?"
    )
    private String lastName;

    @NotBlank
    @Pattern(regexp = "[0-9]{2}[0-9 -.]*[0-9]{2}")
    private String phoneNumber;

    @NotBlank
    @Email
    @Pattern(regexp = "john@doe.com")
    private String emailAddress;

    public TicketOrder() {
    }

    public TicketOrder(
        Integer id, Integer movieId, Integer numberOfTickets, String firstName,
        String lastName, String phoneNumber, String emailAddress
    ) {
        this.id = id;
        this.movieId = movieId;
        this.numberOfTickets = numberOfTickets;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.emailAddress = emailAddress;
    }

    public TicketOrder(
        Integer movieId, Integer numberOfTickets, String firstName,
        String lastName, String phoneNumber, String emailAddress
    ) {
        this.movieId = movieId;
        this.numberOfTickets = numberOfTickets;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.emailAddress = emailAddress;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getMovieId() {
        return movieId;
    }

    public void setMovieId(Integer movieId) {
        this.movieId = movieId;
    }

    public Integer getNumberOfTickets() {
        return numberOfTickets;
    }

    public void setNumberOfTickets(Integer numberOfTickets) {
        this.numberOfTickets = numberOfTickets;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmailAddress() {
        return emailAddress;
    }

    public void setEmailAddress(String emailAddress) {
        this.emailAddress = emailAddress;
    }

    @Override
    public String toString() {
        return "TicketOrder{" +
            "id=" + id +
            ", movieId=" + movieId +
            ", numberOfTickets=" + numberOfTickets +
            ", firstName='" + firstName + '\'' +
            ", lastName='" + lastName + '\'' +
            ", phoneNumber='" + phoneNumber + '\'' +
            ", emailAddress='" + emailAddress + '\'' +
            '}';
    }
}