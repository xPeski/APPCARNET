# Usa una imagen oficial de Node.js
FROM node:18-alpine

# Define el directorio de trabajo dentro del backend
WORKDIR /app

# Copia los archivos package.json y package-lock.json desde backend
COPY backend/package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código de la carpeta backend
COPY backend/ .

# Expone el puerto 5000 (Railway asignará uno automáticamente)
EXPOSE 5000

# Comando para iniciar el servidor
CMD ["node", "server.js"]
