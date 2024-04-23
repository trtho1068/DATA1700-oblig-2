# DATA 1700 3rd obligatory exercise

A dummy application that reads, creates and deletes database records
based on user input.

> [!IMPORTANT]
> [The requested video is found here](https://youtu.be/YUEVcP0p__o).

## Technologies
Uses Spring Boot, JDBC and an in memory H2 database
on the server side. Bootstrap CSS and vanilla JavaScript using
ES6 JavaScript modules on the client side.

## Features
- Database read, create and delete based on user input.
- Client side input validation with a mix of Constraint Validation API
  and custom logic.
- Server side input validation with jakarta.validation.
- Friendly server side validation error responses enabling
  the client to easily integrate server messages in the UI
  (used as an intro to error handling/responses in Spring Boot).

> [!NOTE]
> Reviewer of oblig 1 claimed that email and phone client side validation
> had to be done with regex, I assume he/she meant specifically using
> the pattern attribute of html input elements. This is not stated
> anywhere in the exercise text, and I do not expect it to be a problem.
> 
> Nevertheless, phone number was already being validated this way,
> while using type=email just delegates to the browser,
> which typically uses a regex anyway, probably putting more thought
> into it that I could reasonably do in this project.
  


  
