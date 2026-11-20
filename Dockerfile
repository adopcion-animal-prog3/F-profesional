# Etapa 1: compila la SPA de Vue con Vite.
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# VITE_BASE_PATH permite servir el portal bajo un subpath (p. ej. /profesional/).
# Las VITE_* quedan embebidas en el bundle: solo URLs públicas, nunca secretos.
ARG VITE_BASE_PATH=/
ARG VITE_API_URL=/
ARG VITE_PERSONAL_URL=/
ENV VITE_BASE_PATH=$VITE_BASE_PATH \
    VITE_API_URL=$VITE_API_URL \
    VITE_PERSONAL_URL=$VITE_PERSONAL_URL
RUN npm run build

# Etapa 2: sirve los archivos estáticos y reenvía /api al backend B-Profesional.
FROM nginx:1.27-alpine
ENV API_UPSTREAM=http://b-profesional:3000
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
