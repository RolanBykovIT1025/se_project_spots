const showInputError = (formEl, inputEl, errorMsg, settings) => {
    const errorMsgEl = formEl.querySelector(`#${inputEl.id}-error`);
    errorMsgEl.textContent = errorMsg;
    inputEl.classList.add(settings.inputErrorClass);
    errorMsgEl.classList.add(settings.errorClass);
};

const hideInputError = (formEl, inputEl, settings) => {
    const errorMsgEl = formEl.querySelector(`#${inputEl.id}-error`);
    errorMsgEl.textContent = "";
    inputEl.classList.remove(settings.inputErrorClass);
    errorMsgEl.classList.remove(settings.errorClass); 
};

const checkInputValidity = (formEl, inputEl, settings) => {
    if (!inputEl.validity.valid) {
        showInputError(formEl, inputEl, inputEl.validationMessage, settings)
    } else {
        hideInputError(formEl, inputEl, settings)
    }
}

const hasInvalidInput = (inputList) => {
    return inputList.some((input) => {
        return !input.validity.valid;
    })
}

const toggleButtonState = (inputList, buttonEl, settings) => {
    if (hasInvalidInput(inputList)) {
        disableButton(buttonEl, settings);
    } else {
        buttonEl.disabled = false;
        buttonEl.classList.remove(settings.inactiveButtonClass);
    }
};

const disableButton = (buttonEl, config) => {
    buttonEl.disabled = true;
    buttonEl.classList.add(config.inactiveButtonClass);
}

const resetValidation = (formEl, config) => {
    const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
    const buttonElement = formEl.querySelector(config.submitButtonSelector);
    inputList.forEach((inputElement) => {
        hideInputError(formEl, inputElement, config);
    });

    disableButton(buttonElement, config);
};

const setEventListeners = (formEl, config) => {
    const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
    const buttonElement = formEl.querySelector(config.submitButtonSelector);
    
        toggleButtonState(inputList, buttonElement, config);

    editFormElement.addEventListener("reset", () => {
        disableButton(buttonElement, config);
    });
    
    inputList.forEach((inputElement) => {
        inputElement.addEventListener("input", function () {
            checkInputValidity(formEl, inputElement, config);
             toggleButtonState(inputList, buttonElement, config);
        });
    });
};

const enableValidation = (config) => {
    const formList = document.querySelectorAll(config.formSelector);
    formList.forEach((formEl) => {
        setEventListeners(formEl, config);
    });
};