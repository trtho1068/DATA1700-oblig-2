package com.example.oblig2;


import jakarta.validation.constraints.*;

public class TicketOrder {
    @NotBlank
    private String movie;

    @NotNull
    @Min(1)
    @Max(100)
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
    private String emailAddress;

    public TicketOrder() {
    }

    public TicketOrder(
        String movie, Integer numberOfTickets, String firstName,
        String lastName, String phoneNumber, String emailAddress
    ) {
        this.movie = movie;
        this.numberOfTickets = numberOfTickets;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.emailAddress = emailAddress;
    }

    public String getMovie() {
        return movie;
    }

    public void setMovie(String movie) {
        this.movie = movie;
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
}