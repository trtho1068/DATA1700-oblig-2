package com.example.oblig2;


import jakarta.validation.constraints.*;

public class Ticket {
    @NotEmpty
    private String movie;

    @NotNull
    @Min(1)
    @Max(100)
    private Integer number;

    @Pattern(regexp =
        "^([a-zA-Z\\xC0-\uFFFF]+([ \\-']?[a-zA-Z\\xC0-\uFFFF]+)*[.]?){1,2}$"
    )
    private String firstname;

    @Pattern(regexp =
        "^([a-zA-Z\\xC0-\uFFFF]+([ \\-']?[a-zA-Z\\xC0-\uFFFF]+)*[.]?){1,2}$"
    )
    private String lastname;

    @Pattern(regexp = "[+]?(\\d+[.\\-\\s]?\\d+)+")
    private String phoneNumber;

    @Email
    private String emailAddress;

    public Ticket() {
    }

    public Ticket(
        String movie, Integer number, String firstname, String lastname,
        String phoneNumber, String emailAddress
    ) {
        this.movie = movie;
        this.number = number;
        this.firstname = firstname;
        this.lastname = lastname;
        this.phoneNumber = phoneNumber;
        this.emailAddress = emailAddress;
    }

    public String getMovie() {
        return movie;
    }

    public void setMovie(String movie) {
        this.movie = movie;
    }

    public Integer getNumber() {
        return number;
    }

    public void setNumber(Integer number) {
        this.number = number;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
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