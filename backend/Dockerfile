# Usa una imagen oficial de Node.js
FROM node:18-alpine

# Define el directorio de trabajo en el contenedor
WORKDIR /

# Copia los archivos de dependencias e instálalos
COPY package*.json ./
RUN npm install

# Copia el resto del código
COPY . .

# Expone el puerto 5000 (Railway asignará uno automáticamente)
EXPOSE 5000

# Comando para iniciar el servidor
CMD ["node", "server.js"]
