package es.familycash.proveedores.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import es.familycash.proveedores.bean.LoginDataBean;
import es.familycash.proveedores.config.RequestContext;
import es.familycash.proveedores.entity.ProveedorEntity;
import es.familycash.proveedores.entity.ProveedorEntityDes;
import es.familycash.proveedores.exception.UnauthorizedAccessException;
import jakarta.servlet.http.HttpServletRequest;

@Service
public class AuthService {

    @Autowired
    JWTService JWTHelper;

    @Autowired
    ProveedorServiceRouter proveedorService;

    @Autowired
    HttpServletRequest oHttpServletRequest;

    @Autowired
    RequestContext requestContext;

    public boolean checkLogin(LoginDataBean loginData) {
        String entorno = requestContext.getEntorno();
        System.out.println("[AUTH] Intentando login para NIF: " + loginData.getNif() + ", ID: "
                + loginData.getProveedorId() + " [Entorno: " + entorno + "]");

        // Buscamos por NIF ya que es un String y evita problemas de casting con el ID
        // (que es VARCHAR en DB)
        return proveedorService.findByNif(loginData.getNif())
                .filter(p -> {
                    if (p instanceof ProveedorEntity pe) {
                        System.out.println("[AUTH] Proveedor PROD encontrado: " + pe.getDescripcion() + " (ID: "
                                + pe.getId() + ")");
                        boolean idMatches = pe.getId().equals(loginData.getProveedorId());
                        boolean passMatches = pe.getPassword().equals(loginData.getPassword());
                        System.out.println("[AUTH] Match - ID: " + idMatches + ", Password: " + passMatches);
                        return idMatches && passMatches;
                    } else if (p instanceof ProveedorEntityDes pd) {
                        System.out.println("[AUTH] Proveedor DES encontrado: " + pd.getDescripcion() + " (ID: "
                                + pd.getId() + ")");
                        boolean idMatches = pd.getId().equals(loginData.getProveedorId());
                        boolean passMatches = pd.getPassword().equals(loginData.getPassword());
                        System.out.println("[AUTH] Match - ID: " + idMatches + ", Password: " + passMatches);
                        return idMatches && passMatches;
                    }
                    return false;
                })
                .isPresent();
    }

    private Map<String, String> getClaims(Object proveedor) {
        Map<String, String> claims = new HashMap<>();

        if (proveedor instanceof ProveedorEntity p) {
            claims.put("nif", p.getNif());
            claims.put("proveedorId", p.getId().toString());
            claims.put("rol", p.getRol());
        } else if (proveedor instanceof ProveedorEntityDes pd) {
            claims.put("nif", pd.getNif());
            claims.put("proveedorId", pd.getId().toString());
            claims.put("rol", pd.getRol());
        } else {
            throw new RuntimeException("Tipo de proveedor no reconocido");
        }

        return claims;
    }

    public String getToken(String nif, Long proveedorId) {
        // Buscamos por NIF igual que en checkLogin para evitar problemas de casting del
        // ID
        Object proveedor = proveedorService.findByNif(nif)
                .filter(p -> {
                    if (p instanceof ProveedorEntity pe) {
                        return pe.getId().equals(proveedorId);
                    } else if (p instanceof ProveedorEntityDes pd) {
                        return pd.getId().equals(proveedorId);
                    }
                    return false;
                })
                .orElseThrow(() -> new RuntimeException(
                        "Proveedor no encontrado con NIF: " + nif + " e ID: " + proveedorId));

        return JWTHelper.generateToken(getClaims(proveedor));
    }

    public ProveedorEntity getProveedorFromToken() {
        Object proveedorIdAttr = oHttpServletRequest.getAttribute("proveedorId");
        if (proveedorIdAttr == null)
            throw new UnauthorizedAccessException("No hay proveedor en la sesión");
        Long proveedorId = Long.parseLong(proveedorIdAttr.toString());
        Object proveedor = proveedorService.findById(proveedorId)
                .orElseThrow(() -> new UnauthorizedAccessException("Proveedor no encontrado"));

        if (proveedor instanceof ProveedorEntity p)
            return p;
        if (proveedor instanceof ProveedorEntityDes pDes) {
            // Cast de seguridad
            ProveedorEntity adaptado = new ProveedorEntity();
            adaptado.setId(pDes.getId());
            adaptado.setEmail(pDes.getEmail());
            adaptado.setNif(pDes.getNif());
            adaptado.setPassword(pDes.getPassword());
            adaptado.setRol(pDes.getRol());
            return adaptado;
        }
        throw new RuntimeException("Entidad inesperada");
    }

    public boolean isSessionActive() {
        return oHttpServletRequest.getAttribute("nif") != null;
    }
}