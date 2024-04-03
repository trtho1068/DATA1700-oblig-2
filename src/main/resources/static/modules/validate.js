export {ElementValidator, GroupValidator};


class GroupValidator {
    static forForm(form, getOutputElem) {
        let elemValidators = [];
        for (let elem of form.elements) {
            if (elem.name) {
                elemValidators.push(
                    new ElementValidator(elem, getOutputElem(elem))
                );
            }
        }
        return new GroupValidator(...elemValidators);
    }

    constructor(...elemValidators) {
        this.elemValidators = elemValidators || [];
    }

    *[Symbol.iterator]() {
        for (let validator of this.elemValidators) {
            yield [validator.inputElem.name, validator];
        }
    }

    ensureValidation() {
        for (let validator of this.elemValidators) {
            validator.ensureValidation();
        }
    }

    stopValidation() {
        for (let validator of this.elemValidators) {
            validator.stopValidation();
        }
    }
}


class ElementValidator {
    #messages;
    #isValidating;

    static defaultMessages(inputElem) {
        let labelName = inputElem.labels[0].textContent.toLowerCase();
        return new Map([
            ["valueMissing", `${labelName} is required`],
            ["patternMismatch", `invalid ${labelName}`],
            ["typeMismatch", `invalid ${labelName}`]
        ]);
    }

    constructor(inputElem, outputElem) {
        this.inputElem = inputElem;

        if (!outputElem.ariaLive || outputElem.ariaLive === "off") {
            console.warn(`Correcting aria-live for element #${outputElem.id}`);
            outputElem.ariaLive = "polite";
        }
        this.outputElem = outputElem;

        if (this.inputElem instanceof HTMLSelectElement){
            this.eventType = "change";
        } else {
            this.eventType = "input";
        }
        this.#messages = this.constructor.defaultMessages(this.inputElem);
        this.#isValidating = false;
    }

    // TODO! report invalid validityAttr
    setMessage(validityAttr, text) {
        this.#messages.set(validityAttr, text);
    }

    showRelevantMessage(validityState) {
        for (let validityAttr of this.#messages.keys()) {
            if (validityState[validityAttr]) {
                let text = this.#messages.get(validityAttr);
                if (this.outputElem.textContent !== text) {
                    this.outputElem.textContent = text;
                }
                return;
            }
        }
        // TODO! the toString of validityState is not helpful
        console.warn(`No relevant message found for: ${validityState}`);
    }

    handleEvent(event) {
        let validityState = this.inputElem.validity;
        if (validityState.valid) {
            if (this.outputElem.textContent) {
                this.outputElem.textContent = "";
            }
        } else {
            this.showRelevantMessage(validityState);
        }
    }

    ensureValidation() {
        if (!this.#isValidating) {
            this.handleEvent();
            this.inputElem.addEventListener(this.eventType, this);
            this.#isValidating = true;
        }
    }

    stopValidation() {
        if (this.#isValidating) {
            this.inputElem.removeEventListener(this.eventType, this);
            this.#isValidating = false;
        }
    }

    toString() {
        return `${this.constructor.name}(\n`
            + `    ${this.inputElem},\n`
            + `    ${this.outputElem},\n`
    }
}