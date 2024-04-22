package com.example.oblig2;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;


@ControllerAdvice
public class CustomExceptionHandler extends ResponseEntityExceptionHandler {

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
        MethodArgumentNotValidException ex,
        @NonNull HttpHeaders headers,
        @NonNull HttpStatusCode status,
        @NonNull WebRequest request
    ) {
        Object target = ex.getBindingResult().getTarget();
        ValidationErrorResponse response = new ValidationErrorResponse();

        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            FailedValidation failedValidation = new FailedValidation(
                fieldError.getField(),
                fieldError.getDefaultMessage()
            );
            response.addFailedValidation(failedValidation);
            logger.warn(String.format("%s for %s", failedValidation, target));

        }
        return new ResponseEntity<>(response, headers, status);
    }
}