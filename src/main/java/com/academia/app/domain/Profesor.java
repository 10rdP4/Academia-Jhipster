package com.academia.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Profesor.
 */
@Entity
@Table(name = "profesor")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Profesor implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "apellido")
    private String apellido;

    @NotNull
    @Column(name = "sueldo", nullable = false)
    private Double sueldo;

    @NotNull
    @Column(name = "dni", nullable = false, unique = true)
    private String dni;

    @OneToMany(mappedBy = "profesor")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "suscripcions", "asistencias", "horarios", "profesor" }, allowSetters = true)
    private Set<Taller> tallers = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Profesor id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return this.nombre;
    }

    public Profesor nombre(String nombre) {
        this.setNombre(nombre);
        return this;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return this.apellido;
    }

    public Profesor apellido(String apellido) {
        this.setApellido(apellido);
        return this;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public Double getSueldo() {
        return this.sueldo;
    }

    public Profesor sueldo(Double sueldo) {
        this.setSueldo(sueldo);
        return this;
    }

    public void setSueldo(Double sueldo) {
        this.sueldo = sueldo;
    }

    public String getDni() {
        return this.dni;
    }

    public Profesor dni(String dni) {
        this.setDni(dni);
        return this;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }

    public Set<Taller> getTallers() {
        return this.tallers;
    }

    public void setTallers(Set<Taller> tallers) {
        if (this.tallers != null) {
            this.tallers.forEach(i -> i.setProfesor(null));
        }
        if (tallers != null) {
            tallers.forEach(i -> i.setProfesor(this));
        }
        this.tallers = tallers;
    }

    public Profesor tallers(Set<Taller> tallers) {
        this.setTallers(tallers);
        return this;
    }

    public Profesor addTaller(Taller taller) {
        this.tallers.add(taller);
        taller.setProfesor(this);
        return this;
    }

    public Profesor removeTaller(Taller taller) {
        this.tallers.remove(taller);
        taller.setProfesor(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Profesor)) {
            return false;
        }
        return id != null && id.equals(((Profesor) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Profesor{" +
            "id=" + getId() +
            ", nombre='" + getNombre() + "'" +
            ", apellido='" + getApellido() + "'" +
            ", sueldo=" + getSueldo() +
            ", dni='" + getDni() + "'" +
            "}";
    }
}
