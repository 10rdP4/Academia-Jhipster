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
 * A Alumno.
 */
@Entity
@Table(name = "alumno")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Alumno implements Serializable {

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
    @Column(name = "dni", nullable = false, unique = true)
    private String dni;

    @OneToMany(mappedBy = "alumno")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "alumno", "taller" }, allowSetters = true)
    private Set<Suscripcion> suscripcions = new HashSet<>();

    @OneToMany(mappedBy = "alumno")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "alumno", "taller" }, allowSetters = true)
    private Set<Asistencia> asistencias = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "alumnos" }, allowSetters = true)
    private Contacto contacto;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Alumno id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return this.nombre;
    }

    public Alumno nombre(String nombre) {
        this.setNombre(nombre);
        return this;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return this.apellido;
    }

    public Alumno apellido(String apellido) {
        this.setApellido(apellido);
        return this;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getDni() {
        return this.dni;
    }

    public Alumno dni(String dni) {
        this.setDni(dni);
        return this;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }

    public Set<Suscripcion> getSuscripcions() {
        return this.suscripcions;
    }

    public void setSuscripcions(Set<Suscripcion> suscripcions) {
        if (this.suscripcions != null) {
            this.suscripcions.forEach(i -> i.setAlumno(null));
        }
        if (suscripcions != null) {
            suscripcions.forEach(i -> i.setAlumno(this));
        }
        this.suscripcions = suscripcions;
    }

    public Alumno suscripcions(Set<Suscripcion> suscripcions) {
        this.setSuscripcions(suscripcions);
        return this;
    }

    public Alumno addSuscripcion(Suscripcion suscripcion) {
        this.suscripcions.add(suscripcion);
        suscripcion.setAlumno(this);
        return this;
    }

    public Alumno removeSuscripcion(Suscripcion suscripcion) {
        this.suscripcions.remove(suscripcion);
        suscripcion.setAlumno(null);
        return this;
    }

    public Set<Asistencia> getAsistencias() {
        return this.asistencias;
    }

    public void setAsistencias(Set<Asistencia> asistencias) {
        if (this.asistencias != null) {
            this.asistencias.forEach(i -> i.setAlumno(null));
        }
        if (asistencias != null) {
            asistencias.forEach(i -> i.setAlumno(this));
        }
        this.asistencias = asistencias;
    }

    public Alumno asistencias(Set<Asistencia> asistencias) {
        this.setAsistencias(asistencias);
        return this;
    }

    public Alumno addAsistencia(Asistencia asistencia) {
        this.asistencias.add(asistencia);
        asistencia.setAlumno(this);
        return this;
    }

    public Alumno removeAsistencia(Asistencia asistencia) {
        this.asistencias.remove(asistencia);
        asistencia.setAlumno(null);
        return this;
    }

    public Contacto getContacto() {
        return this.contacto;
    }

    public void setContacto(Contacto contacto) {
        this.contacto = contacto;
    }

    public Alumno contacto(Contacto contacto) {
        this.setContacto(contacto);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Alumno)) {
            return false;
        }
        return id != null && id.equals(((Alumno) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Alumno{" +
            "id=" + getId() +
            ", nombre='" + getNombre() + "'" +
            ", apellido='" + getApellido() + "'" +
            ", dni='" + getDni() + "'" +
            "}";
    }
}
