//DETECTAR LA PAGINA ACTIVA (hay efecto en css)

// Conseguir la URL actual
var url = window.location.href;

// Conseguir todos los elementos <a> de la barra de navegación
var links = document.querySelectorAll(".nav-menu a");

// Recorro cada elemento
for (var i = 0; i < links.length; i++) {
  // Si la URL del enlace coincide con la URL actual
  if (links[i].href === url) {
    // Agrega la clase 'active' al elemento li padre del enlace
    links[i].parentNode.classList.add("active");

    // Agrega un listener al elemento para prevenir que se haga click
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

abrir.addEventListener("click",()=>{
    navMenu.classList.add("visible");
    navSocial.classList.add("visible");
})
cerrar.addEventListener("click",()=>{
    navMenu.classList.remove("visible");
    navSocial.classList.remove("visible");
})

const section = document.querySelector(".bar-start");

button.addEventListener("click", () => {
  section.classList.toggle("active");
});



//VALIDACIONES DEL FORMULARIO
function validarFormulario() {
  var nombre = document.getElementById("nombre").value;
  var apellido = document.getElementById("apellido").value;
  var dni = document.getElementById("dni").value;
  var correo = document.getElementById("correo").value;
  var password = document.getElementById("password").value;

  // Validar que los campos no estén vacíos
  if (
    nombre == "" ||
    apellido == "" ||
    dni == "" ||
    correo == "" ||
    password == ""
  ) {
    alert("Todos los campos son obligatorios.");
    return false;
  }

  // Validar el DNI
  if (isNaN(dni) || dni < 0) {
    alert("Por favor, ingrese un DNI válido.");
    return false;
  }

  // Validar el correo electrónico
  var regexCorreo = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  if (!regexCorreo.test(correo)) {
    alert("Por favor, ingrese un correo electrónico válido.");
    return false;
  }

  // Mostrar un cartel de confirmación con los datos ingresados
  var confirmacion = confirm(
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

  // Si el usuario acepta, se envía el formulario
  return confirmacion;
}

// Asignar la función de validación al evento de envío del formulario
document.querySelector("form").addEventListener("submit", function (event) {
  event.preventDefault();

  if (validarFormulario()) {
    this.submit();
  }
});
