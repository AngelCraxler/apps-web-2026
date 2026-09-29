// =============================
// 1. MODAL DE CONFIRMACIÓN
// =============================
var modalEliminar = document.getElementById('modalEliminar');

modalEliminar.addEventListener('show.bs.modal', function (event) {
    // Botón que activó el modal
    var boton = event.relatedTarget;
    // Extraemos el nombre de la tarea desde el atributo data-tarea
    var nombreTarea = boton.getAttribute('data-tarea');
    // Actualizamos el texto dentro del modal
    var nombreEnModal = modalEliminar.querySelector('#nombreTareaModal');
    nombreEnModal.textContent = nombreTarea;
});

// =============================
// 2. ALERTA AL CONFIRMAR ELIMINACIÓN
// =============================
document.getElementById('btnConfirmarEliminar').addEventListener('click', function () {
    // Cerramos el modal
    var modal = bootstrap.Modal.getInstance(modalEliminar);
    modal.hide();

    // Mostramos una alerta dinámica
    var alerta = document.createElement('div');
    alerta.className = 'alert alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3 shadow';
    alerta.style.zIndex = '9999';
    alerta.style.backgroundColor = 'var(--color-rosa)';
    alerta.style.color = 'var(--color-azul-oscuro)';
    alerta.style.borderRadius = '8px';
    alerta.style.padding = '12px 16px';
    alerta.style.fontSize = '16px';
    alerta.style.fontWeight = '500';
    alerta.innerHTML = `
        <strong>¡Tarea eliminada!</strong> La acción se ha realizado con éxito.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
    `;
    document.body.appendChild(alerta);

    // Removemos la alerta automáticamente después de 3 segundos
    setTimeout(function () {
        alerta.remove();
    }, 3000);
});