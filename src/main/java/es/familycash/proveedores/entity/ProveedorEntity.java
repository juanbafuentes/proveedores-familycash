package es.familycash.proveedores.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "LU_PRO")
public class ProveedorEntity {

    @Id
    @Column(name = "id_pro")
    private Long id;

    @Column(name = "ds_pro")
    private String descripcion;

    @Column(name = "ql_pro_nif")
    private String nif;

    @Column(name = "email")
    private String email;

    @Column(name = "id_pro_com")
    private Integer id_comprador;

    @Column(name = "id_pro_ges")
    private Integer id_gestor;

    @Column(name = "pro_passwd")
    private String password;

    @Column(name = "pro_rol")
    private String rol; // valores: "ADMIN", "USER",

    @Column(name = "token_recuperacion")
    private String tokenRecuperacion;

    @Column(name = "token_expiracion")
    private LocalDateTime tokenExpiracion;

    

}
