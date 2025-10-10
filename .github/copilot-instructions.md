# Proveedores FamilyCash - Instrucciones para AI Agents

## Arquitectura del Proyecto
Esta es una API REST de Spring Boot para gestión de proveedores que utiliza un patrón de **doble entorno** (producción/desarrollo) con entidades y repositorios duplicados:

- **Entidades de Producción**: `ProveedorEntity`, `ProductoEntity`, etc.
- **Entidades de Desarrollo**: `ProveedorEntityDes`, `ProductoEntityDes`, etc.
- **Service Routers**: Enrutan automáticamente entre repositorios prod/dev según `app.environment`

### Componentes Clave
- **API Controllers** (`/api`): REST endpoints con `@CrossOrigin(origins = "*")`
- **Service Routers**: Abstraen la lógica de doble entorno (`ProveedorServiceRouter`, `ProductoServiceRouter`)
- **Autenticación JWT**: Con filtro personalizado en `JWTFilter.java`
- **File Management**: Subida FTP para imágenes y documentos de productos

## Patrones de Desarrollo

### 1. Service Router Pattern
```java
// Los Service Routers encapsulan la lógica de entorno
if (isDev()) {
    return repoDes.findById(id);
} else {
    return repoProd.findById(id);
}
```
**SIEMPRE** usa los Service Routers, nunca los repositorios directamente.

### 2. Autenticación JWT
- **Endpoints públicos**: `/auth/*`, `/api/hola`, `/healthcheck`
- **Token Bearer**: `Authorization: Bearer <token>`
- **Claims**: `nif`, `proveedorId`, `rol` se extraen automáticamente en el filtro
- **Acceso**: `String nif = jwtService.getNifFromRequest(request)`

### 3. Multipart File Uploads
Los endpoints de producto manejan archivos múltiples:
```java
@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<ProductoEntity> create(
    @RequestPart(value = "imagenes", required = false) List<MultipartFile> imagenes,
    @RequestPart(value = "documentos", required = false) List<MultipartFile> documentos
)
```

### 4. Cross-Environment Entity Handling
Controllers reciben `Object` para manejar ambas entidades:
```java
public ResponseEntity<?> update(@RequestBody Object proveedor) {
    if (proveedor instanceof ProveedorEntity prod) {
        // Lógica para producción
    } else if (proveedor instanceof ProveedorEntityDes dev) {
        // Lógica para desarrollo
    }
}
```

## Comandos de Desarrollo

### Construcción y Ejecución
```bash
# Desarrollo con recarga automática
./mvnw spring-boot:run

# Build para producción
./mvnw clean package -DskipTests

# Docker
docker build -t proveedores-api .
docker run -p 8080:8080 proveedores-api
```

### Base de Datos
- **MySQL remoto** en Dinahosting (configurado en `application.properties`)
- **No usar DDL**: Las tablas existen, solo hacer consultas/inserções
- **Naming Strategy**: `PhysicalNamingStrategyStandardImpl` (nombres exactos)

## Configuración Crítica

### Variables de Entorno vs Properties
- **Local**: Usar `application.properties` 
- **Producción**: Sobrescribir con variables de entorno
- **Entorno actual**: `app.environment=prod|dev` controla el routing

### Configuraciones Sensibles
```properties
# JWT (mantener secreto)
jwt.secret=vQpKrpY6G/Og0yrGbH8w0K4kK3L9vpRxvVu9K6y2u5M=

# FTP para subida de archivos
ftp.host=proveedores.familycash.es
ftp.urlBase=https://proveedores.familycash.es/assets/
```

## Convenciones Específicas

### Nomenclatura Húngara en Inyecciones
```java
@Autowired
ProductoServiceRouter oProductoService;  // 'o' prefijo para objetos
```

### Logging y Debugging
```java
// Startup logger automático muestra entorno
System.out.println("🌍 ENTORNO ACTUAL --> " + environment);

// Exception handling con stack trace
} catch (Exception e) {
    e.printStackTrace(); // Para debugging en consola
    return ResponseEntity.status(500).body("Error interno");
}
```

### CORS y Headers
Todos los controllers tienen: `@CrossOrigin(origins = "*", allowedHeaders = "*", maxAge = 3600)`

## Endpoints Principales
- `POST /auth/login` - Autenticación con NIF/password
- `GET /auth/proveedores-por-nif` - Listar proveedores por NIF
- `GET /proveedor/bytoken` - Datos del proveedor autenticado
- `GET /producto/pagebyproveedor` - Productos del proveedor autenticado
- `POST /producto/new` - Crear producto con archivos multipart

## Errores Comunes a Evitar
1. **No usar repositorios directamente** - Siempre a través de Service Routers
2. **Manejar ambas entidades** - Prod/Dev en controllers que reciben Object
3. **JWT en filtros** - No manejar autenticación manualmente en controllers
4. **File upload paths** - Usar configuración FTP, no paths locales hardcodeados