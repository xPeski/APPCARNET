document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("id");

    if (!userId) {
        document.getElementById("user-info").innerText = "ID de usuario no encontrado.";
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/usuarios/${userId}`);
        if (!response.ok) throw new Error("Usuario no encontrado");

        const usuario = await response.json();
        document.getElementById("user-info").innerHTML = `
            <p><strong>ID:</strong> ${usuario.id}</p>
            <p><strong>Puntos:</strong> ${usuario.puntos}</p>
        `;
        cargarHistorial(userId);
        
        // Agregar escáner para el admin
        document.getElementById("scanAdmin").addEventListener("click", () => {
            iniciarEscaner((adminId) => {
                alert("Administrador ID: " + adminId);
                validarAdmin(adminId, userId);
            });
        });

    } catch (error) {
        document.getElementById("user-info").innerText = "Error al obtener los datos.";
    }
});

async function cargarHistorial(userId) {
    try {
        const response = await fetch(`http://localhost:5000/historial/${userId}`);
        if (!response.ok) throw new Error("No se pudo obtener el historial");

        const historial = await response.json();
        const historialDiv = document.getElementById("historial-sanciones");
        
        if (historial.length === 0) {
            historialDiv.innerHTML = "<p>No hay sanciones registradas.</p>";
            return;
        }

        let tabla = `
            <table border="1">
                <tr>
                    <th>Fecha</th>
                    <th>Descripción</th>
                    <th>Administrador</th>
                    <th>Magnitud</th>
                </tr>
        `;

        historial.forEach(sancion => {
            tabla += `
                <tr>
                    <td>${new Date(sancion.fecha).toLocaleDateString()}</td>
                    <td>${sancion.descripcion}</td>
                    <td>${sancion.admin_id}</td>
                    <td>${sancion.magnitud}</td>
                </tr>
            `;
        });

        tabla += "</table>";
        historialDiv.innerHTML = tabla;

    } catch (error) {
        document.getElementById("historial-sanciones").innerText = "Error al cargar el historial.";
    }
}

async function validarAdmin(adminId, userId) {
    try {
        // Fetch admin details
        const response = await fetch(`http://localhost:5000/usuarios/${adminId}`);
        if (!response.ok) throw new Error("Administrador no encontrado");

        const admin = await response.json();

        // Verificar si es un admin
        if (admin.admin) {
            document.getElementById("sancion-form").style.display = "block";
        } else {
            alert("No tienes permisos para sancionar.");
        }

    } catch (error) {
        alert("Error al validar al administrador.");
    }
}
