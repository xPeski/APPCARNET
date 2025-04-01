# Usa una imagen oficial de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia package.json y package-lock.json en el contenedor
COPY /backend/package*.json ./backend/

# Ejecuta el comando npm install para instalar dependencias
RUN npm install

# Copia el resto del código al contenedor
COPY /backend /app/backend
COPY /frontend /app/frontend

# Expone el puerto 5000
EXPOSE 5000

# Comando para iniciar el servidor
CMD ["node", "backend/server.js"]
