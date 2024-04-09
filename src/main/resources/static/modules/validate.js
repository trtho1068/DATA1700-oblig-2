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
    let labelName = inputElem.labels[0].textContent.toLowerCase();

    if (inputElem.required) {
        yield Constraint.forValidityState(
            VALUE_MISSING,`${labelName} is required`
        )
    }
    if (inputElem.type === "url" || inputElem.type === "email") {
        yield Constraint.forValidityState(
            TYPE_MISMATCH, `invalid ${labelName}`
        )
    }
    if (inputElem.pattern) {
        yield Constraint.forValidityState(
            PATTERN_MISMATCH, `invalid ${labelName}`
        )
    }
    if (inputElem.min) {
        yield Constraint.forValidityState(
            RANGE_UNDERFLOW, `${labelName} must be larger than ${inputElem.min}`
        )
    }
    if (inputElem.max) {
        yield Constraint.forValidityState(
            RANGE_OVERFLOW, `${labelName} must be smaller than ${inputElem.max}`
        )
    }
    if (inputElem.minLength && inputElem.minLength !== -1) {
        yield Constraint.forValidityState(
            TOO_SHORT,
            `${labelName} must be at least ${inputElem.minLength} chars`
        )
    }
    if (inputElem.maxLength && inputElem.maxLength !== -1) {
        yield Constraint.forValidityState(
            TOO_LONG, `${labelName} can not exceed ${inputElem.maxLength} chars`
        )
    }
}


class Validator {
    #constraints;
    #isValidating;

    constructor(inputElem, outputElem) {
        this.inputElem = inputElem;

        if (!outputElem.ariaLive || outputElem.ariaLive === "off") {
            console.warn(`${this} setting 'aria-live=polite' on output elem`);
            outputElem.ariaLive = "polite";
        }
        this.outputElem = outputElem;

        if (this.inputElem instanceof HTMLSelectElement) {
            this.eventType = "change";
        } else {
            this.eventType = "input";
        }
        this.#constraints = new Map();

        for (let constraint of defaultConstraints(this.inputElem)) {
            this.#constraints.set(constraint.name, constraint);
        }
        this.#isValidating = false;
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

    handleEvent(event) {
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

    startLiveUpdates() {
        if (!this.#isValidating) {
            this.handleEvent();
            this.inputElem.addEventListener(this.eventType, this);
            this.#isValidating = true;
        }
    }

    stopLiveUpdates() {
        if (this.#isValidating) {
            this.inputElem.removeEventListener(this.eventType, this);
            this.#isValidating = false;
        }
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

    startLiveUpdates() {
        for (let validator of this.#validators.values()) {
            validator.startLiveUpdates();
        }
    }

    stopLiveUpdates() {
        for (let validator of this.#validators.values()) {
            validator.stopLiveUpdates();
        }
    }
}