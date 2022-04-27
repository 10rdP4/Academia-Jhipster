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
 * A Taller.
 */
@Entity
@Table(name = "taller")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Taller implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "nombre", nullable = false)
    private String nombre;

    @NotNull
    @Column(name = "precio", nullable = false)
    private Double precio;

    @OneToMany(mappedBy = "taller")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "alumno", "taller" }, allowSetters = true)
    private Set<Suscripcion> suscripcions = new HashSet<>();

    @OneToMany(mappedBy = "taller")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "alumno", "taller" }, allowSetters = true)
    private Set<Asistencia> asistencias = new HashSet<>();

    @OneToMany(mappedBy = "taller")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "taller" }, allowSetters = true)
    private Set<Horario> horarios = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "tallers" }, allowSetters = true)
    private Profesor profesor;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Taller id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return this.nombre;
    }

    public Taller nombre(String nombre) {
        this.setNombre(nombre);
        return this;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Double getPrecio() {
        return this.precio;
    }

    public Taller precio(Double precio) {
        this.setPrecio(precio);
        return this;
    }

    public void setPrecio(Double precio) {
        this.precio = precio;
    }

    public Set<Suscripcion> getSuscripcions() {
        return this.suscripcions;
    }

    public void setSuscripcions(Set<Suscripcion> suscripcions) {
        if (this.suscripcions != null) {
            this.suscripcions.forEach(i -> i.setTaller(null));
        }
        if (suscripcions != null) {
            suscripcions.forEach(i -> i.setTaller(this));
        }
        this.suscripcions = suscripcions;
    }

    public Taller suscripcions(Set<Suscripcion> suscripcions) {
        this.setSuscripcions(suscripcions);
        return this;
    }

    public Taller addSuscripcion(Suscripcion suscripcion) {
        this.suscripcions.add(suscripcion);
        suscripcion.setTaller(this);
        return this;
    }

    public Taller removeSuscripcion(Suscripcion suscripcion) {
        this.suscripcions.remove(suscripcion);
        suscripcion.setTaller(null);
        return this;
    }

    public Set<Asistencia> getAsistencias() {
        return this.asistencias;
    }

    public void setAsistencias(Set<Asistencia> asistencias) {
        if (this.asistencias != null) {
            this.asistencias.forEach(i -> i.setTaller(null));
        }
        if (asistencias != null) {
            asistencias.forEach(i -> i.setTaller(this));
        }
        this.asistencias = asistencias;
    }

    public Taller asistencias(Set<Asistencia> asistencias) {
        this.setAsistencias(asistencias);
        return this;
    }

    public Taller addAsistencia(Asistencia asistencia) {
        this.asistencias.add(asistencia);
        asistencia.setTaller(this);
        return this;
    }

    public Taller removeAsistencia(Asistencia asistencia) {
        this.asistencias.remove(asistencia);
        asistencia.setTaller(null);
        return this;
    }

    public Set<Horario> getHorarios() {
        return this.horarios;
    }

    public void setHorarios(Set<Horario> horarios) {
        if (this.horarios != null) {
            this.horarios.forEach(i -> i.setTaller(null));
        }
        if (horarios != null) {
            horarios.forEach(i -> i.setTaller(this));
        }
        this.horarios = horarios;
    }

    public Taller horarios(Set<Horario> horarios) {
        this.setHorarios(horarios);
        return this;
    }

    public Taller addHorario(Horario horario) {
        this.horarios.add(horario);
        horario.setTaller(this);
        return this;
    }

    public Taller removeHorario(Horario horario) {
        this.horarios.remove(horario);
        horario.setTaller(null);
        return this;
    }

    public Profesor getProfesor() {
        return this.profesor;
    }

    public void setProfesor(Profesor profesor) {
        this.profesor = profesor;
    }

    public Taller profesor(Profesor profesor) {
        this.setProfesor(profesor);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Taller)) {
            return false;
        }
        return id != null && id.equals(((Taller) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Taller{" +
            "id=" + getId() +
            ", nombre='" + getNombre() + "'" +
            ", precio=" + getPrecio() +
            "}";
    }
}
