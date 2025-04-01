# Etapa 1: Configuración del backend
FROM node:16 AS backend

WORKDIR /app

# Copia el archivo package.json y package-lock.json desde el backend
COPY backend/package*.json ./backend/

# Instala las dependencias del backend
RUN npm install --prefix ./backend

# Copia todo el código del backend al contenedor
COPY backend/ ./backend/

# Si tienes archivos estáticos del frontend, los copiamos en la carpeta 'public' del backend
COPY frontend/ ./backend/public/

# Exponer el puerto en el que corre la aplicación del backend
EXPOSE 5000

# Comando para iniciar el servidor del backend (usando server.js)
CMD ["node", "backend/server.js"]
