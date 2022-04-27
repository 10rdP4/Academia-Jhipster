package com.academia.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Asistencia.
 */
@Entity
@Table(name = "asistencia")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Asistencia implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "fecha", nullable = false)
    private ZonedDateTime fecha;

    @Column(name = "asistencia")
    private Boolean asistencia;

    @ManyToOne
    @JsonIgnoreProperties(value = { "suscripcions", "asistencias", "contacto" }, allowSetters = true)
    private Alumno alumno;

    @ManyToOne
    @JsonIgnoreProperties(value = { "suscripcions", "asistencias", "horarios", "profesor" }, allowSetters = true)
    private Taller taller;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Asistencia id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getFecha() {
        return this.fecha;
    }

    public Asistencia fecha(ZonedDateTime fecha) {
        this.setFecha(fecha);
        return this;
    }

    public void setFecha(ZonedDateTime fecha) {
        this.fecha = fecha;
    }

    public Boolean getAsistencia() {
        return this.asistencia;
    }

    public Asistencia asistencia(Boolean asistencia) {
        this.setAsistencia(asistencia);
        return this;
    }

    public void setAsistencia(Boolean asistencia) {
        this.asistencia = asistencia;
    }

    public Alumno getAlumno() {
        return this.alumno;
    }

    public void setAlumno(Alumno alumno) {
        this.alumno = alumno;
    }

    public Asistencia alumno(Alumno alumno) {
        this.setAlumno(alumno);
        return this;
    }

    public Taller getTaller() {
        return this.taller;
    }

    public void setTaller(Taller taller) {
        this.taller = taller;
    }

    public Asistencia taller(Taller taller) {
        this.setTaller(taller);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Asistencia)) {
            return false;
        }
        return id != null && id.equals(((Asistencia) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Asistencia{" +
            "id=" + getId() +
            ", fecha='" + getFecha() + "'" +
            ", asistencia='" + getAsistencia() + "'" +
            "}";
    }
}
