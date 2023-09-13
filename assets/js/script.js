// Conseguir la URL actual
var url = window.location.href;

// Conseguir todos los elementos <a> de la barra de navegación
var links = document.querySelectorAll('.nav-menu a');

// Recorro cada elemento
for (var i = 0; i < links.length; i++) {
    // Si la URL del enlace coincide con la URL actual
    if (links[i].href === url) {
        // Agrega la clase 'active' al elemento li padre del enlace
        links[i].parentNode.classList.add('active');

        // Agrega un listener al elemento para prevenir que se haga click
        links[i].addEventListener('click', function(event) {
            event.preventDefault();
        });
    }
}