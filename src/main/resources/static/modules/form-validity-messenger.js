export {FormValidityMessenger};


class ElementValidityMessenger {
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
        this.messages = this.constructor.defaultMessages(this.inputElem);

        if (inputElem instanceof HTMLSelectElement) {
            this.eventType = "change";
        } else {
            this.eventType = "input";
        }
    }

    // TODO! report invalid validityAttr
    setMessage(validityAttr, text) {
        this.messages.set(validityAttr, text);
    }

    showRelevantMessage(validityState) {
        for (let validityAttr of this.messages.keys()) {
            if (validityState[validityAttr]) {
                let text = this.messages.get(validityAttr);
                if (this.outputElem.textContent !== text) {
                    this.outputElem.textContent = text;
                }
                return;
            }
        }
        // TODO! the toString of validityState is not helpful
        console.warn(`No relevant message found for: ${validityState}`);
    }

    update() {
        let validityState = this.inputElem.validity;
        if (validityState.valid) {
            if (this.outputElem.textContent) {
                this.outputElem.textContent = "";
            }
        } else {
            this.showRelevantMessage(validityState);
        }
    }

    listen() {
        this.update();
        this.inputElem.addEventListener(this.eventType, event => {
            this.update()
        });
    }

    toString() {
        return `${this.constructor.name}(\n`
            + `    ${this.inputElem},\n`
            + `    ${this.outputElem},\n`
    }
}


class FormValidityMessenger {
    constructor(formSelector) {
        this.selector = formSelector;
        this.elementMessengers = new Map();

        let form = document.querySelector(this.selector);
        if (!(form instanceof HTMLFormElement)) {
            throw new Error(`No such form: ${this.selector}`);
        }
        for (let elem of form.elements) {
            // Same policy as form data objects
            if (!elem.name) {
                continue;
            }
            this.elementMessengers.set(
                elem.name,
                new ElementValidityMessenger(
                    // Assumes message element is the next sibling
                    elem, document.querySelector(`#${elem.id} + *`)
                )
            )
        }
    }

    // TODO! report invalid elementName
    setMessage(elementName, validityAttr, text) {
        let elem = this.elementMessengers.get(elementName);
        elem.setMessage(validityAttr, text);
    }

    // TODO! report invalid elementName || eventType
    setEventType(elementName, eventType) {
        let elem = this.elementMessengers.get(elementName);
        elem.eventType = eventType;
    }

    listen() {
        for (let elemMsgr of this.elementMessengers.values()) {
            elemMsgr.listen();
        }
    }

    toString() {
        return `${this.constructor.name}(${this.selector})`;
    }
}