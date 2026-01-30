package es.familycash.proveedores.config;

import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

import jakarta.servlet.http.HttpServletRequest;

@Component
@RequestScope
public class RequestContext {

    private final String entorno;

    public RequestContext(HttpServletRequest request) {
        // Forzamos siempre producción para eliminar el uso de tablas _DES
        this.entorno = "prod";
    }

    public boolean isDev() {
        return "dev".equalsIgnoreCase(entorno);
    }

    public boolean isProd() {
        return "prod".equalsIgnoreCase(entorno);
    }

    public String getEntorno() {
        return entorno;
    }
}
