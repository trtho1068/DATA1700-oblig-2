export {
    VALUE_MISSING, TYPE_MISMATCH, PATTERN_MISMATCH, RANGE_UNDERFLOW,
    RANGE_OVERFLOW, TOO_SHORT, TOO_LONG,
    Validator, ValidatorGroup, getValidators
};


const VALUE_MISSING = "valueMissing";
const TYPE_MISMATCH = "typeMismatch";
const PATTERN_MISMATCH = "patternMismatch";
const RANGE_UNDERFLOW = "rangeUnderflow";
const RANGE_OVERFLOW = "rangeOverflow";
const TOO_SHORT = "tooShort";
const TOO_LONG = "tooLong";


const defaultErrorMessages = {
    VALUE_MISSING: "Field is required",
    EMAIL: "Expecting an email address, missing @?",
    URL: "Expecting an url address, typo?",
    PATTERN_MISMATCH: "Input does not match expected format, typo?",
    RANGE_UNDERFLOW: "Value too small, %min is the minimum",
    RANGE_OVERFLOW: "Value too large, %max is the maximum",
    TOO_SHORT: "Must contain at least %minlength characters",
    TOO_LONG: "Can not contain more than %maxlength characters"
};


class Constraint {
    static forValidityState(validityProp, errorMessage) {
        return new this(
            validityProp,
            validationContext => !validationContext.validityState[validityProp],
            errorMessage
        )
    }

    constructor(name, func, errorMessage) {
        this.name = name;
        this.func = func;
        this.errorMessage = errorMessage;
    }

    getValidationMessage(validationContext) {
        if (!this.func(validationContext)) {
            return this.errorMessage;
        }
        return "";
    }
}


function *defaultConstraints(inputElem) {
    if (inputElem.required) {
        yield Constraint.forValidityState(
            VALUE_MISSING, defaultErrorMessages.VALUE_MISSING
        );
    }
    if (inputElem.min) {
        yield Constraint.forValidityState(
            RANGE_UNDERFLOW,
            defaultErrorMessages.RANGE_UNDERFLOW.replace("%min", inputElem.min)
        )
    }
    if (inputElem.max) {
        yield Constraint.forValidityState(
            RANGE_OVERFLOW,
            defaultErrorMessages.RANGE_UNDERFLOW.replace("%max", inputElem.max)
        )
    }
    if (inputElem.minLength && inputElem.minLength !== -1) {
        yield Constraint.forValidityState(
            TOO_SHORT,
            defaultErrorMessages.TOO_SHORT.replace(
                "%minlength", inputElem.minLength
            )
        )
    }
    if (inputElem.maxLength && inputElem.maxLength !== -1) {
        yield Constraint.forValidityState(
            TOO_LONG,
            defaultErrorMessages.TOO_LONG.replace(
                "%maxlength", inputElem.maxLength
            )
        )
    }
    if (inputElem.type === "email") {
        yield Constraint.forValidityState(
            TYPE_MISMATCH, defaultErrorMessages.EMAIL
        );
    }
    if (inputElem.type === "url") {
        yield Constraint.forValidityState(
            TYPE_MISMATCH, defaultErrorMessages.URL
        );
    }
    if (inputElem.pattern) {
        yield Constraint.forValidityState(
            PATTERN_MISMATCH, defaultErrorMessages.PATTERN_MISMATCH
        )
    }
}


class Validator {
    #constraints;

    constructor(inputElem, outputElem) {
        this.inputElem = inputElem;

        if (!outputElem.ariaLive || outputElem.ariaLive === "off") {
            console.warn(this, "setting 'aria-live=polite' on output elem");
            outputElem.ariaLive = "polite";
        }
        this.outputElem = outputElem;
        this.#constraints = new Map();

        for (let constraint of defaultConstraints(this.inputElem)) {
            this.#constraints.set(constraint.name, constraint);
        }
    }

    #getValidationMessage() {
        let message = "";
        let validationContext = {
            value: this.inputElem.value,
            validityState: this.inputElem.validity,
        }
        for (let constraint of this.#constraints.values()) {
            message = constraint.getValidationMessage(validationContext);
            if (message) {
                break;
            }
        }
        return message;
    }

    get name() {
        return this.inputElem.name;
    }

    setConstraint(name, func, errorMessage) {
        let constraint = new Constraint(name, func, errorMessage);
        this.#constraints.set(name, constraint);
    }

    setConstraintErrorMessage(name, errorMessage) {
        let constraint = this.#constraints.get(name);
        constraint.errorMessage = errorMessage;
    }

    checkValidity() {
        /*
        *  As long as there is support for non-validityState constraints
        *  client code can't rely on input- or form.checkValidity()
        */
        return !this.#getValidationMessage();
    }

    validate() {
        /*
        *  The call to setCustomValidity ensures that the css pseudo-classes
        *  :valid & :invalid apply as appropriate for all constraints.
        *  Otherwise non-validityState constraints could fail to
        *  validate, but still be styled as :valid
        */
        let message = this.#getValidationMessage();
        this.inputElem.setCustomValidity(message);
        if (this.outputElem.textContent !== message) {
            this.outputElem.textContent = message;
        }
    }

    forceValidationMessage(message) {
        // A convenience if server side validation fails with useful message
        this.inputElem.setCustomValidity(message);
        this.outputElem.textContent = message;
    }
}


function *getValidators(form, getOutputElem) {
    for (let elem of form.elements) {
        if (elem.name) {
            yield new Validator(elem, getOutputElem(elem));
        }
    }
}


class ValidatorGroup {
    #validators;

    constructor(...validators) {
        this.#validators = new Map();
        for (let validator of validators) {
            this.#validators.set(validator.name, validator);
        }
    }

    *[Symbol.iterator]() {
        for (let validator of this.#validators.values()) {
            yield validator;
        }
    }

    getValidator(name) {
        return this.#validators.get(name);
    }

    checkValidity() {
        for (let validator of this.#validators.values()) {
            if (!validator.checkValidity()) {
                return false;
            }
        }
        return true;
    }
    validate() {
        for (let validator of this.#validators.values()) {
            validator.validate();
        }
    }
}