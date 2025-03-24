const settings = {
    formSelector: ".modal__form",
    inputSelector: ".modal__input",
    submitButtonSelector: ".modal__submit-btn",
    inactiveButtonClass: "modal__button_disabled",
    inputErrorClass: "modal__input_type_error",
    errorClass: "modal__error_visible"
  }

const showInputError = (formEl, inputEl, errorMsg) => {
    const errorMsgEl = formEl.querySelector(`#${inputEl.id}-error`);
    errorMsgEl.textContent = errorMsg;
    inputEl.classList.add(".modal__input_type_error");
};

const hideInputError = (formEl, inputEl,) => {
    const errorMsgEl = formEl.querySelector(`#${inputEl.id}-error`);
    errorMsgEl.textContent = "";
    inputEl.classList.remove(".modal__input_type_error");
};

const checkInputValidity = (formEl, inputEl) => {
    if (!inputEl.validity.valid) {
        showInputError(formEl, inputEl, inputEl.validationMessage)
    } else {
        hideInputError(formEl, inputEl)
    }
}

const hasInvalidInput = (inputList) => {
    return inputList.some((input) => {
        return !input.validity.valid;
    })
}

const toggleButtonState = (inputList, buttonEl) => {
    if (hasInvalidInput(inputList)) {
        disableButton(buttonEl);
        buttonEl.classList.add('modal__button_disabled');
    } else {
        buttonEl.disabled = false;
        buttonEl.classList.remove('modal__button_disabled');
    }
};

const disableButton = (buttonEl) => {
    buttonEl.disabled = true;
}

const setEventListeners = (formEl) => {
    const inputList = Array.from(formEl.querySelectorAll(".modal__input"));
    const buttonElement = formEl.querySelector(".modal__submit-btn");
    
        toggleButtonState(inputList, buttonElement);
    
    inputList.forEach((inputElement) => {
        inputElement.addEventListener("input", function () {
            checkInputValidity(formEl, inputElement);
             toggleButtonState(inputList, buttonElement);
        });
    });
};

const enableValidation = (config) => {
    console.log(config.formSelector);
    const formList = document.querySelectorAll(config.formSelector);
    formList.forEach((formEl) => {
        setEventListeners(formEl);
    });
};

enableValidation(settings);