document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userId");
    const adminId = params.get("adminId");

    if (!userId || !adminId) {
        alert("Error: Faltan datos.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/sanciones");
        if (!response.ok) throw new Error("No se pudieron obtener las sanciones");

        const sanciones = await response.json();
        const selectMagnitud = document.getElementById("filtroMagnitud");
        const selectSancion = document.getElementById("sancion");

        function filtrarSanciones() {
            const magnitudSeleccionada = selectMagnitud.value;
            selectSancion.innerHTML = "";

            sanciones
                .filter(sancion => magnitudSeleccionada === "todas" || sancion.magnitud === magnitudSeleccionada)
                .forEach(sancion => {
                    const option = document.createElement("option");
                    option.value = sancion.id;
                    option.textContent = sancion.descripcion;
                    option.dataset.magnitud = sancion.magnitud;
                    selectSancion.appendChild(option);
                });
        }

        selectMagnitud.addEventListener("change", filtrarSanciones);
        filtrarSanciones();
    } catch (error) {
        console.error("Error cargando sanciones:", error);
    }

    document.getElementById("aplicarSancion").addEventListener("click", async () => {
        const sancionId = document.getElementById("sancion").value;
        const sancionSeleccionada = document.getElementById("sancion").selectedOptions[0];
        const magnitud = sancionSeleccionada ? sancionSeleccionada.dataset.magnitud : null;

        if (!sancionId) {
            alert("Selecciona una sanción.");
            return;
        }

        let puntosARestar = 0;
        if (magnitud === "leve") puntosARestar = 1;
        else if (magnitud === "grave") puntosARestar = 3;
        else if (magnitud === "muy grave") puntosARestar = 5;

        try {
            // Obtener los puntos actuales del usuario
            const userResponse = await fetch(`http://localhost:5000/usuarios/${userId}`);
            if (!userResponse.ok) throw new Error("No se pudo obtener el usuario");

            const userData = await userResponse.json();
            let puntosActuales = userData.puntos;

            // Asegurar que los puntos no bajen de 0
            let nuevosPuntos = Math.max(puntosActuales - puntosARestar, 0);

            // Registrar la sanción en el historial
            await fetch("http://localhost:5000/historial", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usuario_id: userId, sancion_id: sancionId, admin_id: adminId })
            });

            // Actualizar los puntos en la base de datos
            await fetch(`http://localhost:5000/usuarios/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ puntos: nuevosPuntos })
            });

            alert("Sanción aplicada correctamente.");
            window.location.href = "index.html";
        } catch (error) {
            alert("Error al aplicar sanción.");
            console.error(error);
        }
    });
});
