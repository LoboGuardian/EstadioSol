let url = window.location.href;
let links = document.querySelectorAll(".nav-menu a");
for (let i = 0; i < links.length; i++) {
  if (links[i].href === url) {
    links[i].parentNode.classList.add("active");
    links[i].addEventListener("click", function (event) {
      event.preventDefault();
    });
  }
}
const navMenu = document.querySelector("#navMenu");
const navSocial = document.querySelector("#navSocial");
const abrir = document.querySelector("#abrir");
const cerrar = document.querySelector("#cerrar");

abrir.addEventListener("click", () => {
  navMenu.classList.add("visible");
  navSocial.classList.add("visible");
});
cerrar.addEventListener("click", () => {
  navMenu.classList.remove("visible");
  navSocial.classList.remove("visible");
});

const section = document.querySelector(".bar-start");
let button = document.querySelector("button");
if (button) {
  button.addEventListener("click", () => {
    section.classList.toggle("active");
  });
}
function validarFormulario() {
  let nombre = document.getElementById("nombre").value;
  let apellido = document.getElementById("apellido").value;
  let dni = document.getElementById("dni").value;
  let correo = document.getElementById("correo").value;
  let password = document.getElementById("password").value;
  if (
    nombre.trim() == "" ||
    apellido.trim() == "" ||
    dni.trim() == "" ||
    correo.trim() == "" ||
    password.trim() == ""
  ) {
    alert("Todos los campos son obligatorios.");
    return false;
  }
  if (isNaN(dni) || dni < 0) {
    alert("Por favor, ingrese un DNI válido.");
    return false;
  }

  let regexCorreo = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  if (!regexCorreo.test(correo)) {
    alert("Por favor, ingrese un correo electrónico válido.");
    return false;
  }
  let confirmacion = confirm(
    "Por favor, revise los datos ingresados:\n\n" +
      "Nombre: " +
      nombre +
      "\n" +
      "Apellido: " +
      apellido +
      "\n" +
      "DNI: " +
      dni +
      "\n" +
      "Correo: " +
      correo +
      "\n\n" +
      "¿Son correctos estos datos?"
  );
  return confirmacion;
}
function enviarCorreo() {
  console.log("Entra a enviar correo");
  let correo = document.getElementById("correo").value;

  Email.send({
    Host: "smtp.gmail.com",
    Username: "testpython899@gmail.com",
    Password: "54N;HtHcV!Sij&!",
    To: correo,
    From: "testpython899@gmail.com",
    Subject: "Confirmación de compra de entradas",
    Body: "Gracias por tu compra. Te esperamos en el concierto.",
  }).then((message) => alert("Correo enviado exitosamente"));
}
let form = document.querySelector("form");
if (form) {
  form.addEventListener("submit", function (event) {
    console.log("Entra a validar formulario");
    event.preventDefault();

    if (validarFormulario()) {
      enviarCorreo();
      this.submit();
    }
  });
}
let container = document.getElementById("container_reviews");
fetch("https://rickandmortyapi.com/api/character")
  .then((response) => response.json())
  .then((data) => {
    let fragment = document.createDocumentFragment();

    data.results.forEach((character) => {
      let characterContainer = document.createElement("div");
      characterContainer.className = "character-container";

      let img = document.createElement("img");
      img.src = character.image;
      img.alt = character.name;
      img.className = "img-promo";

      let pName = document.createElement("p");
      pName.textContent = character.name;

      let review = Math.floor(Math.random() * 5) + 1;
      let reviewText = "";
      switch (review) {
        case 1:
          reviewText = "Muy malo 👎🏻";
          break;
        case 2:
          reviewText = "Malo";
          break;
        case 3:
          reviewText = "Regular";
          break;
        case 4:
          reviewText = "Muy bueno";
          break;
        case 5:
          reviewText = "¡Excelente! 🎉";
          break;
      }

      let stars = "";
      for (let i = 0; i < review; i++) {
        stars += "⭐";
      }

      let pStars = document.createElement("p");
      pStars.textContent = stars;

      let pReview = document.createElement("p");
      pReview.textContent = reviewText;

      characterContainer.appendChild(img);
      characterContainer.appendChild(pName);
      characterContainer.appendChild(pStars);
      characterContainer.appendChild(pReview);

      fragment.appendChild(characterContainer);
    });

    container.appendChild(fragment);
  })
  .catch((error) => console.error("Error:", error));

let h2 = document.querySelector(".photos h2");
let colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];
let i = 0;

setInterval(function () {
  h2.style.color = colors[i];
  i = (i + 1) % colors.length;
}, 500);
