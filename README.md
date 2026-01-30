# Proveedores Family Cash - API Backend

Sistema de gestión de productos y documentación para proveedores de Family Cash.

## 🚀 Tecnologías

- **Java 17**
- **Spring Boot 3.2.3**
- **Spring Data JPA**
- **MySQL**
- **JWT (JSON Web Token)** para seguridad.
- **Apache Commons Net** para gestión de archivos via FTP.

## 🛠️ Configuración del Entorno

El sistema requiere las siguientes variables de configuración (definidas en `application.properties` o variables de entorno):

```properties
# Base de Datos
spring.datasource.url=jdbc:mysql://[host]:[port]/[database]
spring.datasource.username=[user]
spring.datasource.password=[password]

# Seguridad JWT
jwt.secret=[tu_secreto_largo_y_seguro]
jwt.issuer=familycash
jwt.subject=proveedores

# Servidor FTP (Almacenamiento de Imágenes y Documentos)
ftp.host=[host_ftp]
ftp.port=21
ftp.user=[usuario_ftp]
ftp.pass=[password_ftp]
ftp.path=/www/assets/
ftp.urlBase=https://proveedores.familycash.es/assets/
```

## 🏗️ Arquitectura de Entornos (Dev/Prod)

El proyecto utiliza una arquitectura de enrutamiento dinámico basada en el header HTTP `X-Entorno`.

- **Prod**: Valor por defecto o header `X-Entorno: prod`. Utiliza tablas estándar (e.g., `LU_ARA`).
- **Dev**: Header `X-Entorno: dev`. Utiliza tablas de desarrollo (e.g., `LU_ARA_DES`).

Esta lógica está encapsulada en la capa de servicios mediante "Routers" (e.g., `ProductoServiceRouter`).

## 🔐 Seguridad

La autenticación se realiza mediante el endpoint `/auth/login`, que valida NIF, ID de Proveedor y Contraseña.
Tras un login exitoso, se devuelve un token JWT que debe incluirse en la cabecera `Authorization: Bearer [token]` para las peticiones protegidas.

## 📁 Gestión de Archivos

- **Imágenes**: Se suben al servidor FTP en la ruta `/images/[entorno]/producto/[id]`.
- **Documentos**: Se suben en la ruta `/docs/[entorno]/producto/[id]` con el formato de nombre `CODPROVEEDOR_EAN_TIPO.pdf`.

## 📌 Endpoints Principales

- `POST /auth/login`: Autenticación.
- `GET /producto`: Listado paginado de productos.
- `GET /producto/pagebyproveedor`: Productos vinculados al proveedor autenticado.
- `POST /producto/new`: Creación de producto con imágenes y documentos (Multipart).
- `PUT /producto/update/{id}`: Actualización de producto.
