# Usa una imagen oficial de Node.js
FROM node:18-alpine

# Define el directorio de trabajo dentro del contenedor (en /app)
WORKDIR /app

# Copia el package.json y package-lock.json de la carpeta backend
COPY backend/package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia todo el código de la carpeta backend al contenedor
COPY backend/ .

# Expone el puerto 5000
EXPOSE 5000

# Comando para iniciar el servidor
CMD ["node", "server.js"]
