/* ============================================================
   PRÁCTICA: INTERACCIONES CON SELECTORES, EVENTOS Y FUNCIONES
   Archivo: eliminar-tareas.js
   ============================================================ */

/* ------------------------------------------------------------
   SELECTORES UTILIZADOS
   - getElementById: cuando el elemento tiene un ID único.
   - querySelector: cuando necesito el primer elemento que coincida.
   - querySelectorAll: cuando necesito todos los elementos similares.
   ------------------------------------------------------------ */

/* ------------------------------------------------------------
   VARIABLES GLOBALES
   ------------------------------------------------------------ */
let formularioPendiente = null;

/* ------------------------------------------------------------
   INTERACCIÓN 1: VALIDACIÓN DE FORMULARIO EN TIEMPO REAL
   Eventos: input, blur, submit
   Bootstrap: is-valid, is-invalid
   ------------------------------------------------------------ */

/**
 * Valida un campo de texto: si está vacío o es muy corto, marca
 * el campo como inválido; si tiene contenido válido, lo marca
 * como válido.
 * @param {HTMLInputElement} campo - El input a validar.
 * @param {number} minLength - Longitud mínima requerida.
 */
function validarCampo(campo, minLength) {
    const valor = campo.value.trim();
    if (valor.length === 0) {
        campo.classList.remove("is-valid");
        campo.classList.add("is-invalid");
    } else if (valor.length < minLength) {
        campo.classList.remove("is-valid");
        campo.classList.add("is-invalid");
    } else {
        campo.classList.remove("is-invalid");
        campo.classList.add("is-valid");
    }
}

/**
 * Maneja el evento de validación en tiempo real del formulario
 * de agregar tareas.
 * @param {Event} event - Evento disparado por el input.
 */
function manejarValidacionTiempoReal(event) {
    const campo = event.target;
    const minLength = parseInt(campo.dataset.minLength) || 3;
    validarCampo(campo, minLength);
}

/* ------------------------------------------------------------
   INTERACCIÓN 2: MODAL CON INFORMACIÓN DINÁMICA
   Eventos: click, show.bs.modal
   Bootstrap: Modal
   ------------------------------------------------------------ */

/**
 * Cuando se abre el modal, obtiene el nombre de la tarea del
 * botón que lo activó y lo muestra en el modal.
 * @param {Event} event - Evento show.bs.modal.
 */
function prepararModalEliminar(event) {
    const boton = event.relatedTarget;
    if (!boton) return;

    formularioPendiente = boton.dataset.formulario || null;

    // Busca el nombre de la tarea más cercana al botón
    const tareaItem = boton.closest(".tarea-item");
    const tituloTarea = tareaItem ? tareaItem.querySelector(".tarea-titulo").textContent : "esta tarea";

    const nombreTareaModal = document.getElementById("nombreTareaModal");
    if (nombreTareaModal) {
        nombreTareaModal.textContent = tituloTarea;
    }
}

/**
 * Confirma la eliminación de la tarea: elimina el elemento del DOM
 * y muestra el toast de notificación.
 */
function confirmarEliminacion() {
    if (!formularioPendiente) return;

    const formulario = document.getElementById(formularioPendiente);
    if (!formulario) return;

    const tareaItem = formulario.closest(".tarea-item");
    if (tareaItem) {
        // Animación de salida
        tareaItem.style.opacity = "0";
        tareaItem.style.transform = "translateX(-20px)";

        setTimeout(() => {
            tareaItem.remove();
            mostrarToast("¡Tarea eliminada correctamente!", "success");
        }, 300);
    }

    // Cerrar el modal
    const modal = bootstrap.Modal.getInstance(document.getElementById("confirmarEliminacion"));
    if (modal) modal.hide();

    formularioPendiente = null;
}

/* ------------------------------------------------------------
   INTERACCIÓN 3: TOAST DE NOTIFICACIÓN
   Eventos: click
   Bootstrap: Toast
   ------------------------------------------------------------ */

/**
 * Muestra un toast de notificación con un mensaje y estilo dinámico.
 * @param {string} mensaje - Texto a mostrar.
 * @param {string} tipo - "success", "danger", "warning", "info".
 */
function mostrarToast(mensaje, tipo = "success") {
    const toastElemento = document.getElementById("toastNotificacion");
    const toastMensaje = document.getElementById("toastMensaje");

    // Elimina clases anteriores
    toastElemento.classList.remove("bg-success", "bg-danger", "bg-warning", "bg-info");
    toastElemento.classList.add("bg-" + tipo);
    toastMensaje.textContent = mensaje;

    const toast = new bootstrap.Toast(toastElemento, { delay: 3000 });
    toast.show();
}

/* ------------------------------------------------------------
   INTERACCIÓN 4: FILTRADO DE ELEMENTOS EN TIEMPO REAL
   Eventos: input, keyup
   Bootstrap: utilidad d-none, Cards/List-group
   ------------------------------------------------------------ */

/**
 * Filtra las tareas según el texto ingresado en el input de búsqueda.
 * @param {Event} event - Evento input.
 */
function filtrarTareas(event) {
    const texto = event.target.value.toLowerCase().trim();
    // querySelectorAll para obtener todas las tareas
    const tareas = document.querySelectorAll(".tarea-item");

    tareas.forEach((tarea) => {
        const contenido = tarea.textContent.toLowerCase();
        // classList.toggle con d-none para ocultar/mostrar
        tarea.classList.toggle("d-none", !contenido.includes(texto));
    });
}

/* ------------------------------------------------------------
   INTERACCIÓN 5: AGREGAR ELEMENTOS CON DELEGACIÓN DE EVENTOS
   Eventos: submit, click
   Métodos: createElement, appendChild, remove()
   Bootstrap: List-group / Card
   ------------------------------------------------------------ */

/**
 * Agrega una nueva tarea al listado dinámicamente.
 * @param {Event} event - Evento submit.
 */
function agregarNuevaTarea(event) {
    event.preventDefault();

    const campoMateria = document.getElementById("nuevaMateria");
    const campoDescripcion = document.getElementById("nuevaDescripcion");

    const materia = campoMateria.value.trim();
    const descripcion = campoDescripcion.value.trim();

    if (!materia || !descripcion) {
        mostrarToast("Por favor completa ambos campos.", "warning");
        return;
    }

    const lista = document.getElementById("listaTareas");

    // Crear contenedor de la tarea
    const tareaItem = document.createElement("div");
    tareaItem.className = "tarea-item";
    tareaItem.dataset.materia = materia.toLowerCase();

    // Crear info
    const tareaInfo = document.createElement("div");
    tareaInfo.className = "tarea-info";

    const titulo = document.createElement("h2");
    titulo.className = "tarea-titulo";
    titulo.textContent = materia;

    const desc = document.createElement("p");
    desc.className = "tarea-descripcion";
    desc.textContent = descripcion;

    tareaInfo.appendChild(titulo);
    tareaInfo.appendChild(desc);

    // Crear formulario con botón eliminar
    const formulario = document.createElement("form");
    formulario.action = "#";
    formulario.method = "post";
    const idForm = "form-eliminar-" + Date.now();
    formulario.id = idForm;

    const inputHidden = document.createElement("input");
    inputHidden.type = "hidden";
    inputHidden.name = "id_tarea";
    inputHidden.value = Date.now();

    const botonEliminar = document.createElement("button");
    botonEliminar.type = "button";
    botonEliminar.className = "btn-eliminar";
    botonEliminar.textContent = "Eliminar";
    botonEliminar.dataset.bsToggle = "modal";
    botonEliminar.dataset.bsTarget = "#confirmarEliminacion";
    botonEliminar.dataset.formulario = idForm;

    formulario.appendChild(inputHidden);
    formulario.appendChild(botonEliminar);

    tareaItem.appendChild(tareaInfo);
    tareaItem.appendChild(formulario);

    lista.appendChild(tareaItem);

    // Limpiar campos
    campoMateria.value = "";
    campoDescripcion.value = "";
    campoMateria.classList.remove("is-valid", "is-invalid");
    campoDescripcion.classList.remove("is-valid", "is-invalid");

    mostrarToast("Tarea agregada correctamente.", "success");
}

/* ------------------------------------------------------------
   INTERACCIÓN 6: CAMBIO DE TEMA (CLARO/OSCURO)
   Eventos: change
   Bootstrap: data-bs-theme
   ------------------------------------------------------------ */

/**
 * Cambia el tema de la página entre claro y oscuro.
 * @param {Event} event - Evento change.
 */
function cambiarTema(event) {
    const modoOscuro = event.target.checked;
    const body = document.body;

    if (modoOscuro) {
        body.setAttribute("data-bs-theme", "dark");
        mostrarToast("Modo oscuro activado.", "info");
    } else {
        body.setAttribute("data-bs-theme", "light");
        mostrarToast("Modo claro activado.", "info");
    }
}

/* ------------------------------------------------------------
   DELEGACIÓN DE EVENTOS
   Un solo listener en el contenedor padre maneja los clics
   de los botones "Eliminar" (incluso los agregados dinámicamente).
   ------------------------------------------------------------ */

/**
 * Maneja los clics en la lista de tareas usando delegación de eventos.
 * Detecta si se hizo clic en un botón "Eliminar" y abre el modal.
 * @param {Event} event - Evento click.
 */
function manejarClicListaTareas(event) {
    const boton = event.target.closest(".btn-eliminar");
    if (!boton) return;

    const formularioId = boton.dataset.formulario;
    if (!formularioId) return;

    formularioPendiente = formularioId;

    // Obtener nombre de la tarea
    const tareaItem = boton.closest(".tarea-item");
    const tituloTarea = tareaItem ? tareaItem.querySelector(".tarea-titulo").textContent : "esta tarea";
    document.getElementById("nombreTareaModal").textContent = tituloTarea;

    // Abrir modal manualmente
    const modal = new bootstrap.Modal(document.getElementById("confirmarEliminacion"));
    modal.show();
}

/* ------------------------------------------------------------
   INICIALIZACIÓN: REGISTRO DE EVENTOS
   Todos los eventos se registran con addEventListener (sin onclick)
   ------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {

    // INTERACCIÓN 1: Validación en tiempo real
    const campoMateria = document.getElementById("nuevaMateria");
    const campoDescripcion = document.getElementById("nuevaDescripcion");

    if (campoMateria) {
        campoMateria.addEventListener("input", manejarValidacionTiempoReal);
        campoMateria.addEventListener("blur", manejarValidacionTiempoReal);
    }
    if (campoDescripcion) {
        campoDescripcion.addEventListener("input", manejarValidacionTiempoReal);
        campoDescripcion.addEventListener("blur", manejarValidacionTiempoReal);
    }

    // INTERACCIÓN 2: Modal dinámico
    const modalEliminacion = document.getElementById("confirmarEliminacion");
    if (modalEliminacion) {
        modalEliminacion.addEventListener("show.bs.modal", prepararModalEliminar);
    }

    const btnConfirmarEliminar = document.getElementById("confirmarEliminar");
    if (btnConfirmarEliminar) {
        btnConfirmarEliminar.addEventListener("click", confirmarEliminacion);
    }

    // INTERACCIÓN 3: Toast (ya se usa dentro de otras funciones)

    // INTERACCIÓN 4: Filtrado en tiempo real
    const filtroMateria = document.getElementById("filtroMateria");
    if (filtroMateria) {
        filtroMateria.addEventListener("input", filtrarTareas);
        filtroMateria.addEventListener("keyup", filtrarTareas);
    }

    // INTERACCIÓN 5: Agregar tareas + Delegación de eventos
    const formAgregarTarea = document.getElementById("formAgregarTarea");
    if (formAgregarTarea) {
        formAgregarTarea.addEventListener("submit", agregarNuevaTarea);
    }

    // DELEGACIÓN: un solo listener para todos los botones "Eliminar"
    const listaTareas = document.getElementById("listaTareas");
    if (listaTareas) {
        listaTareas.addEventListener("click", manejarClicListaTareas);
    }

    // INTERACCIÓN 6: Cambio de tema
    const switchTema = document.getElementById("switchTema");
    if (switchTema) {
        switchTema.addEventListener("change", cambiarTema);
    }

    console.log("✅ Interacciones de eliminar-tareas.js cargadas correctamente.");
});