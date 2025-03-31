document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userId"); // ID del usuario original
    const adminId = prompt("Escanea el QR del administrador (Ingresa el ID manualmente para pruebas):");

    if (!adminId) {
        document.getElementById("admin-info").innerText = "No se escaneó ningún ID.";
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/usuarios/${adminId}`);
        if (!response.ok) throw new Error("Usuario no encontrado");

        const admin = await response.json();

        if (admin.admin) {
            
            window.location.href = `/sancionar?userId=${userId}&adminId=${adminId}`;
        } else {
            document.getElementById("admin-info").innerText = "No tienes permisos de administrador.";
        }
    } catch (error) {
        document.getElementById("admin-info").innerText = "Error al verificar el administrador.";
    }
});
