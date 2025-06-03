class Api {
  constructor(options) {
    // constructor body
  }

  getInitialCards() {
    return fetch("https://around-api.en.tripleten-services.com/v1/cards", {
  headers: {
    authorization: "78cc228a-a265-45af-8e57-e7b6402898d4"
  }
})
  .then(res => res.json());
  }

  // other methods for working with the API
}

export default Api;