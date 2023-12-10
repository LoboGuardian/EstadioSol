//DETECTAR LA PAGINA ACTIVA (hay efecto en css)

// Conseguir la URL actual
let url = window.location.href;

// Conseguir todos los elementos <a> de la barra de navegación
let links = document.querySelectorAll(".nav-menu a");

//Recorro cada elemento
for (let i = 0; i < links.length; i++) {
  //Si la URL del enlace coincide con la URL actual
  if (links[i].href === url) {
    //Agrega la clase 'active' al elemento li padre del enlace
    links[i].parentNode.classList.add("active");

    //Agrega un listener al elemento para prevenir que se haga click
    links[i].addEventListener("click", function (event) {
      event.preventDefault();
    });
  }
}

//APARECER/DESAPARECER EL MENU HAMBURGUESA (nav-menu y nav-social)
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

//VALIDACIONES DEL FORMULARIO
function validarFormulario() {
  let nombre = document.getElementById("nombre").value;
  let apellido = document.getElementById("apellido").value;
  let dni = document.getElementById("dni").value;
  let correo = document.getElementById("correo").value;
  let password = document.getElementById("password").value;

  //Validar que los campos no estén vacíos
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

  //Validar el DNI
  if (isNaN(dni) || dni < 0) {
    alert("Por favor, ingrese un DNI válido.");
    return false;
  }

  //Validar el correo electrónico
  let regexCorreo = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  if (!regexCorreo.test(correo)) {
    alert("Por favor, ingrese un correo electrónico válido.");
    return false;
  }

  // Mostrar un cartel de confirmación con los datos ingresados
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
  return confirmacion; // Si el usuario acepta, se envía el formulario
}

/* Asignar la función de validación al evento de envío del formulario
document.querySelector("form").addEventListener("submit", function (event) {
  event.preventDefault();

  if (validarFormulario()) {
    this.submit();
  }
});
*/

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

//API OPINIONES
let container = document.getElementById("container_reviews");
if (container !== null) {
  fetch("https://rickandmortyapi.com/api/character")
    .then((response) => response.json())
    .then((data) => {
      let fragment = document.createDocumentFragment();

      // Selecciona 5 personajes aleatorios
      let characters = [];
      for (let i = 0; i < 5; i++) {
        let index = Math.floor(Math.random() * data.results.length);
        characters.push(data.results[index]);
        data.results.splice(index, 1); // Elimina el personaje seleccionado de los resultados
      }

      characters.forEach((character) => {
        let characterContainer = document.createElement("div");
        characterContainer.className = "character-container";

        let img = document.createElement("img");
        img.src = character.image;
        img.alt = character.name;
        img.className = "img-promo";

        let pName = document.createElement("p");
        pName.textContent = character.name;

        let review = Math.floor(Math.random() * 4) + 1;
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
}

let h2 = document.querySelector(".photos h2");
let colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];
let i = 0;

setInterval(function () {
  if (h2 !== null) {
    h2.style.color = colors[i];
    i = (i + 1) % colors.length;
  }
}, 500);

// Hashes de usuario y contraseña
const hashedUser =
  "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918"; // Nuestro user
const hashedPassword =
  "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4"; // Nuestra pass

document
  .getElementById("adminButton")
  .addEventListener("click", function (event) {
    event.preventDefault(); // Previene la acción por defecto del enlace

    // Comprueba si el usuario ya está en la página ADMIN_index.html
    if (window.location.pathname.endsWith("ADMIN_index.html")) {
      return;
    }

    // Comprueba si el usuario ya ha iniciado sesión
    let loginTime = localStorage.getItem("loginTime");
    if (loginTime && new Date().getTime() - loginTime < 300000) {
      // 5 minutos = 300000 milisegundos
      // Si han pasado menos de 5 minutos desde el inicio de sesión, redirige al panel de administración
      window.location.href = "./ADMIN_index.html";
      return;
    }

    let user = prompt("Usuario:");
    if (!user) {
      return;
    }
    let password = prompt("Contraseña:");
    if (!password) {
      return;
    }
    let shaObj = new jsSHA("SHA-256", "TEXT");
    shaObj.update(user);
    let hashUser = shaObj.getHash("HEX");

    shaObj = new jsSHA("SHA-256", "TEXT");
    shaObj.update(password);
    let hashPassword = shaObj.getHash("HEX");

    if (hashUser === hashedUser && hashPassword === hashedPassword) {
      // Acceso permitido
      alert("Bienvenido ADMIN");
      localStorage.setItem("loginTime", new Date().getTime()); // Almacena la hora del inicio de sesión
      window.location.href = "./ADMIN_index.html"; // Redirige al panel de administración
    } else {
      // Acceso denegado
      alert("Acceso denegado");
    }
  });
