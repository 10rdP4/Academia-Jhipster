package com.academia.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Suscripcion.
 */
@Entity
@Table(name = "suscripcion")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Suscripcion implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "fecha", nullable = false)
    private ZonedDateTime fecha;

    @Column(name = "activa")
    private Boolean activa;

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

    public Suscripcion id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getFecha() {
        return this.fecha;
    }

    public Suscripcion fecha(ZonedDateTime fecha) {
        this.setFecha(fecha);
        return this;
    }

    public void setFecha(ZonedDateTime fecha) {
        this.fecha = fecha;
    }

    public Boolean getActiva() {
        return this.activa;
    }

    public Suscripcion activa(Boolean activa) {
        this.setActiva(activa);
        return this;
    }

    public void setActiva(Boolean activa) {
        this.activa = activa;
    }

    public Alumno getAlumno() {
        return this.alumno;
    }

    public void setAlumno(Alumno alumno) {
        this.alumno = alumno;
    }

    public Suscripcion alumno(Alumno alumno) {
        this.setAlumno(alumno);
        return this;
    }

    public Taller getTaller() {
        return this.taller;
    }

    public void setTaller(Taller taller) {
        this.taller = taller;
    }

    public Suscripcion taller(Taller taller) {
        this.setTaller(taller);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Suscripcion)) {
            return false;
        }
        return id != null && id.equals(((Suscripcion) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Suscripcion{" +
            "id=" + getId() +
            ", fecha='" + getFecha() + "'" +
            ", activa='" + getActiva() + "'" +
            "}";
    }
}
