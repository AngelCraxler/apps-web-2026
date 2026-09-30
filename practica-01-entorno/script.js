// Espera a que el DOM esté cargado
document.addEventListener("DOMContentLoaded", function () {

    // 1. Mensaje de bienvenida en consola
    console.log("¡Bienvenido a Mi Sitio Web TIID 2026!");

    // 2. Cambiar el color del título al hacer clic
    const titulo = document.querySelector("h1");
    if (titulo) {
        titulo.addEventListener("click", function () {
            titulo.style.color = "blue";
        });
    }

    // 3. Alerta al hacer clic en los enlaces del menú
    const enlaces = document.querySelectorAll("nav a");
    enlaces.forEach(function (enlace) {
        enlace.addEventListener("click", function (e) {
            console.log("Navegando a: " + enlace.textContent);
        });
    });

    // 4. Mostrar la fecha actual en el footer
    const footer = document.querySelector("footer p");
    if (footer) {
        const fecha = new Date();
        footer.textContent += " | Fecha: " + fecha.toLocaleDateString();
    }

    // 5. Contar cuántos artículos hay en la página
    const articulos = document.querySelectorAll("article");
    console.log("Número de artículos en la página: " + articulos.length);

});