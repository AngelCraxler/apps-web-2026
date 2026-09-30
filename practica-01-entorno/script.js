console.log("Hola mundo");

const boton = document.getElementById("btnSaludo");

boton.addEventListener("click", () => {
    alert("¡Hola mundo desde JavaScript!");
});

function msj() {
    document.getElementById("saludo").innerHTML = "TIID_04_01JavaScript";
    document.getElementById("manifestacion").innerHTML = "<h2>Hola mundo desde JavaScript</h2>";
}