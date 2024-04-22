# DATA 1700 3rd obligatory exercise
A dummy application that reads, creates and deletes database records
based on user input.

## Technologies
Uses Spring Boot, JDBC and an in memory H2 database
on the server side. Bootstrap CSS and vanilla JavaScript on
the client side.

## Features
- Database read, create and delete based on user input.
- Client side input validation with a mix of Constraint Validation API
  and custom logic.
- Server side input validation with jakarta.validation.
- Friendly server side validation error responses enabling
  the client to easily integrate server messages in the UI
  (used as an intro to error handling/responses in Spring Boot).
- Includes custom re-usable JavaScript modules request.js (much more 
  fun than jQuery) and validate.js.

> [!NOTE]
> Whoever reviewed oblig 1 claimed that email and phone validation
> had to be done with regex. This is not stated anywhere in the
> exercise text, and hence simply not true.
> 
> Nevertheless, phone number was already being validated using regex,
> while using type=email just delegates email validation to the browser,
> which typically uses a regex anyway, probably putting more thought
> into it that I could do in this amount of time.
  


  
