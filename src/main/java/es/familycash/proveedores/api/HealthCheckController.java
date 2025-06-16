package es.familycash.proveedores.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthCheckController {

    @GetMapping("/healthcheck")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("OK");
    }

    @GetMapping("/api/hola")
    public ResponseEntity<String> hola() {
        return ResponseEntity.ok("HOla");
    }
}
