# Utiliza una imagen base de Node
FROM node:18-alpine

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia el archivo package.json y package-lock.json (si existe)
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto de los archivos del proyecto
COPY . .

# Construye la aplicación para producción
RUN npm run build

# Expone el puerto en el que correrá la aplicación
EXPOSE 5173

# Define el comando por defecto para ejecutar la aplicación
CMD ["npm", "run", "preview" "--", "--host", "0.0.0.0"]
