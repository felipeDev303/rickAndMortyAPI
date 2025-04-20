function getCharacter() {
  const characterID = Math.floor(Math.random() * 826) + 1; // Random number between 1 and 826

  fetch("getCharacter.php?id=" + characterID)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const resultDiv = document.getElementById("result");
      resultDiv.innerHTML =
        '<img src="' +
        data.image +
        '" style="border-radius: 50%; width: 150px;">' +
        "<h2>" +
        data.name +
        "</h2>" +
        "<p><strong>Status: </strong> " +
        data.status +
        "</p>";
    })
    .catch(function (error) {
      console.error("Error fetching character:", error);
    });
}
