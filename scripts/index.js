const initialCards = [
    {
      name: "Val Thorens",
      link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg"
    },
    {
      name: "Restaurant terrace",
      link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg"
    },
    {
      name: "An outdoor cafe",
      link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg"
    },
    {
      name: "A very long bridge, over the forest and through the trees",
      link: "https://example.com/colosseum.jpg"
    },
    {
      name: "Tunnel with morning light",
      link: "https://example.com/machu-picchu.jpg"
    },
    {
      name: "Mountain house",
      link: "https://example.com/pyramids-of-giza.jpg"
    }
  ];

  const profileEditButton = document.querySelector(".profile__edit-btn");
  const profileName = document.querySelector(".profile__name");
  const profileDescription = document.querySelector(".profile__description");

  const editModal = document.querySelector("#edit-modal");
  const editFormElement = editModal.querySelector(".modal__form");
  const editModalCloseButton = editModal.querySelector(".modal__close-btn");
  const editModalNameInput =  editModal.querySelector("#profile-name-input");
  const editModalDescriptionInput = editModal.querySelector("#profile-description-input");

  const cardTemplate = document.querySelector("#card-template");
  const cardsList = document.querySelector(".cards__list");

  function getCardElement(data) {
    const cardElement = cardTemplate.textContent
    .querySelector(".card")
    .cloneNode(true);

    const cardNameEl = cardElement.querySelector(".card__title");

    cardNameEl.textContent = data.name;

    return cardElement;
  }

  function openModal() {
    editModalNameInput.value = profileName.textContent;
    editModalDescriptionInput.value = profileDescription.textContent;
    editModal.classList.add("modal__opened");
  }

  function closeModal() {
    editModal.classList.remove("modal__opened");
  }

  function handleEditFormSubmit(evt) {
    evt.preventDefault();
    profileName.textContent = editModalNameInput.value;
    profileDescription.textContent = editModalDescriptionInput.value;
    closeModal();
  }

  profileEditButton.addEventListener("click", openModal);
  editModalCloseButton.addEventListener("click", closeModal);
  editFormElement.addEventListener("submit", handleEditFormSubmit);

  for (let i = 0; i < initialCards.length; i++) {
    const cardElement = getCardElement(initialCards[i]);
    cardsList.prepend(cardElement)
  }