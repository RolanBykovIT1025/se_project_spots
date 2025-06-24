import "./index.css";
import {
  enableValidation,
  resetValidation,
  validationConfig,
} from "../scripts/validation.js";
import { setButtonText } from "../utils/helpers.js";
import Api from "../utils/Api.js";

// Import the image
import imagePlus from "../images/plus.svg";
import imageHeader from "../images/logo.svg";
import imagePencil from "../images/pencil.svg";
import imageAvatar from "../images/avatar.jpg";

// Select the element and set the src
const plusImage = document.getElementById("image-plus");
const headerImage = document.getElementById("image-header");
const pencilImage = document.getElementById("image-pencil");
const avatarImage = document.getElementById("image-avatar");

plusImage.src = imagePlus;
headerImage.src = imageHeader;
pencilImage.src = imagePencil;

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "78cc228a-a265-45af-8e57-e7b6402898d4",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, user]) => {
    cards.forEach((item, i, arr) => {
      const card = getCardElement(item);
      cardsList.prepend(card);
    });

    avatarImage.src = user.avatar;
    profileName.textContent = user.name;
    profileDescription.textContent = user.about;
  })
  .catch(console.error);

// Profile elements
const profileEditButton = document.querySelector(".profile__edit-btn");
const cardModalBtn = document.querySelector(".profile__add-btn");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

// Form elements
const editModal = document.querySelector("#edit-modal");
const editFormElement = document.forms["edit-profile"];
const editModalCloseButton = editModal.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

// Card elements
const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardSubmitBtn = cardModal.querySelector(".modal__submit-btn");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

//Avatar form elements
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

// Delete form elements
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = document.querySelector("#delete-form");
const confirmBtn = document.querySelector(".modal__delete-btn");
const cancelBtn = document.querySelector(".modal__cancel-btn");

//Select the modal
const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const closeModalBtn = document.querySelector(".modal__close-btn_preview");

// Card related elements
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");
const cardElement = cardTemplate.content;

let selectedCardID;

function handleAddCardSubmit(item, method = "prepend") {
  const cardEl = getCardElement(item);
  cardsList[method](cardEl);
  closeModal(cardModal);
  setTimeout(() => {
    cardForm.reset();
  }, 100);
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  console.log(avatarInput.value);

  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true, "Save", "Saving...");
  
  api
    .editAvatarInfo({ avatar: avatarInput.value })
    .then((data) => {
      console.log(data.avatar);
      avatarImage.src = data.avatar;
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Save", "Saving...");
    });
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  console.log("Deleting card with ID:", selectedCardID);

  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true, "Delete", "Deleting...");

  api
    .deleteCard(selectedCardID)
    .then(() => {
      const cardElement = document.querySelector(
        `[data-id="${selectedCardID}"]`
      );
      if (cardElement) {
        cardElement.remove();
         console.log("Card removed from DOM");
      }
      closeModal(deleteModal);
    })
    .catch((err) => {
      console.error("Delete failed:", err);
    })
    .finally(() => {
    setButtonText(submitBtn, false, "Delete", "Deleting...");
    });
}

function handleLike(evt, id) {
  const likeButton = evt.target;
  const isLiked = likeButton.classList.contains("card__like-btn_liked");

  api.changeLikeStatus(id, isLiked)
  .then((updatedCard) => {
    
    const likedByUser = updatedCard.isLiked;

    if (likedByUser) {
      likeButton.classList.add("card__like-btn_liked");
    } else {
      likeButton.classList.remove("card__like-btn_liked");
    }
  })
}

function getCardElement(data) {
  const element = cardElement.querySelector(".card").cloneNode(true);

  element.dataset.id = data._id;

  const cardNameEl = element.querySelector(".card__title");
  const cardImageEl = element.querySelector(".card__image");

  const cardLikeBtn = element.querySelector(".card__like-btn");

  if (data.isLiked) {
    cardLikeBtn.classList.add("card__like-btn_liked");
  }

  cardLikeBtn.addEventListener("click", (evt) => {
    handleLike(evt, data._id);
  });

  const cardDeleteBtn = element.querySelector(".card__delete-btn");
  cardDeleteBtn.addEventListener("click", () => {
    selectedCardID = data._id;
    openModal(deleteModal);
  });

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.alt;

  cardImageEl.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.alt;
    previewModalCaptionEl.textContent = data.name;
  });

  return element;
}

cancelBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

function fillProfileForm() {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", closeModalOnEscape); // add
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", closeModalOnEscape); // remove
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true, "Save", "Saving...");

  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Save", "Saving...");
    });
}

function closeModalOnOverlayClick(evt) {
  if (evt.target === evt.currentTarget) {
    closeModal(evt.target);
  }
}

const allModals = document.querySelectorAll(".modal");

allModals.forEach((modal) => {
  modal.addEventListener("click", closeModalOnOverlayClick);
});

function closeModalOnEscape(evt) {
  if (evt.key === "Escape") {
    const openModal = document.querySelector(".modal_opened");
    if (openModal) {
      closeModal(openModal);
    }
  }
}

profileEditButton.addEventListener("click", () => {
  resetValidation(editFormElement, validationConfig);
  fillProfileForm();
  openModal(editModal);
});

cardModalBtn.addEventListener("click", () => {
  openModal(cardModal);
});

avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});

avatarForm.addEventListener("submit", handleAvatarSubmit);

deleteForm.addEventListener("submit", handleDeleteSubmit);

const closeButtons = document.querySelectorAll(".modal__close-btn");

closeButtons.forEach((button) => {
  const modal = button.closest(".modal");
  button.addEventListener("click", () => closeModal(modal));
});

editFormElement.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", function (evt) {
  evt.preventDefault();
  const item = {
    name: cardNameInput.value,
    link: cardLinkInput.value,
    alt: cardNameInput.value,
  };
  
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true, "Save", "Saving...");

  api.addCard(item)
    .then((newCard) => {
      handleAddCardSubmit(newCard);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Save", "Saving...");
    });
});

enableValidation(validationConfig);
