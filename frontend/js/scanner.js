let html5QrCode = null;  // Variable global para el escáner

function iniciarEscaner(callback) {
    const qrReader = document.getElementById("qr-reader");

    // Asegurarse de que solo haya una instancia activa del escáner
    if (html5QrCode !== null) {
        // Verificar si el escáner ya está en ejecución antes de detenerlo
        html5QrCode.getState().then((state) => {
            if (state === Html5QrcodeScanner.State.RUNNING) {
                // Detener el escáner si está en ejecución
                html5QrCode.stop().then(() => {
                    // Después de detenerlo, reiniciamos el escáner
                    html5QrCode = new Html5Qrcode("qr-reader");
                    iniciarEscaneo(callback); // Vuelve a iniciar el escaneo
                }).catch(err => {
                    console.log("Error al detener el escáner previo: ", err);
                });
            } else {
                // Si el escáner no está en ejecución, simplemente reiniciamos el escáner
                html5QrCode = new Html5Qrcode("qr-reader");
                iniciarEscaneo(callback); // Inicia el escáner
            }
        }).catch(err => {
            console.log("Error al obtener el estado del escáner: ", err);
            html5QrCode = new Html5Qrcode("qr-reader");
            iniciarEscaneo(callback); // Si hay un error con el estado, reiniciamos el escáner
        });
    } else {
        html5QrCode = new Html5Qrcode("qr-reader");
        iniciarEscaneo(callback); // Inicia el escáner si no existe instancia
    }
}

function iniciarEscaneo(callback) {
    const qrReader = document.getElementById("qr-reader");

    // Ocultar el área del escáner al principio
    if (qrReader) {
        qrReader.style.display = "none";  // Ocultar el área del escáner antes de mostrarla
    }

    // Mostrar el área del escáner
    if (qrReader) {
        qrReader.style.display = "block";  // Mostrar el área del escáner
    }

    html5QrCode.start(
        { facingMode: "environment" },  // Usar la cámara trasera
        { fps: 10, qrbox: 300 }, // Opciones de escaneo
        (decodedText) => {
            document.getElementById("result").innerText = "Código escaneado: " + decodedText;
            html5QrCode.stop();  // Detener el escáner

            // Llamar al callback con el código escaneado
            callback(decodedText);

            // Después de escanear, ocultar el área del escáner
            if (qrReader) {
                qrReader.style.display = "none";  // Ocultar el área del escáner después del escaneo
            }
        },
        (errorMessage) => {
            console.log("Intentando detectar QR...");
        }
    ).catch(err => console.log("Error al iniciar escáner: ", err));
}

document.addEventListener("DOMContentLoaded", () => {
    const scanBtn = document.getElementById("scanBtn");
    const scanAdmin = document.getElementById("scanAdmin");
    const downloadBtn = document.getElementById("descargarCSV");

    // Verificar si el botón 'scanBtn' existe
    if (scanBtn) {
        scanBtn.addEventListener("click", () => {
            // Llamar al escáner y redirigir según el código escaneado
            iniciarEscaner((codigo) => {
                window.location.href = `/usuario?id=${codigo}`;
            });
        });
    }

    // Verificar si el botón 'scanAdmin' existe
    if (scanAdmin) {
        scanAdmin.addEventListener("click", () => {
            // Obtener el userId desde la URL
            const params = new URLSearchParams(window.location.search);
            const userId = params.get("id");

            if (!userId) {
                alert("No se encontró el ID de usuario.");
                return;
            }

            // Llamar al escáner y redirigir con userId y adminId
            iniciarEscaner((adminId) => {
                // Verificar si el admin tiene permisos
                fetch(`https://appcarnet-production.up.railway.app/usuarios/${adminId}`)
                    .then(response => response.json())
                    .then(adminData => {
                        if (adminData.admin) {
                            // Si es admin, redirigir para sancionar
                            window.location.href = `/sancionar?userId=${userId}&adminId=${adminId}`;
                        } else {
                            alert("El usuario escaneado no tiene permisos de administrador.");
                        }
                    })
                    .catch(error => {
                        alert("Error al validar el administrador.");
                        console.error(error);
                    });
            });
        });
    }

    // Lógica para el botón de descarga CSV
    if (downloadBtn) {
        downloadBtn.addEventListener("click", () => {
            // Llamar al escáner para validar si el usuario es admin
            iniciarEscaner(async (adminId) => {
                try {
                    // Verificar si el usuario escaneado es un administrador
                    const response = await fetch(`https://appcarnet-production.up.railway.app/usuarios/${adminId}`);
                    if (!response.ok) throw new Error("Administrador no encontrado");

                    const adminData = await response.json();

                    if (adminData.admin) {
                        // Si es admin, redirigir a la página para descargar el CSV con adminId
                        window.location.href = `/usuarios/descargar-usuarios?adminId=${adminId}`;
                    } else {
                        alert("El usuario escaneado no tiene permisos de administrador.");
                    }
                } catch (error) {
                    alert("Error al validar el administrador.");
                    console.error(error);
                }
            });
        });
    }
});