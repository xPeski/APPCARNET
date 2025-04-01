# Usa una imagen oficial de Node.js
FROM node:18-alpine

# Define el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de dependencias e instálalos
COPY ./backend/package*.json ./backend/
RUN npm install

# Copia el resto del código
COPY ./backend /app/backend
COPY ./frontend /app/frontend  # Copia la carpeta frontend correctamente al contenedor

# Expone el puerto 5000 (Railway asignará uno automáticamente)
EXPOSE 5000

# Comando para iniciar el servidor
CMD ["node", "backend/server.js"]
    