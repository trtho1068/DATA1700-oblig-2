package com.example.oblig2;

import java.util.ArrayList;
import java.util.List;


public class ValidationErrorResponse {

    private final List<FailedValidation> failedValidations;

    public ValidationErrorResponse() {
        failedValidations = new ArrayList<>();
    }

    public void addFailedValidation(FailedValidation failedValidation) {
        failedValidations.add(failedValidation);
    }

    public List<FailedValidation> getFailedValidations() {
        return failedValidations;
    }

    @Override
    public String toString() {
        return "ValidationErrorResponse{" +
            "failedValidations=" + failedValidations +
            '}';
    }
}
