package com.academia.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Horario.
 */
@Entity
@Table(name = "horario")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Horario implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "dia_semana", nullable = false)
    private Integer diaSemana;

    @Column(name = "hora_inicio_taller")
    private String horaInicioTaller;

    @ManyToOne
    @JsonIgnoreProperties(value = { "suscripcions", "asistencias", "horarios", "profesor" }, allowSetters = true)
    private Taller taller;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Horario id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getDiaSemana() {
        return this.diaSemana;
    }

    public Horario diaSemana(Integer diaSemana) {
        this.setDiaSemana(diaSemana);
        return this;
    }

    public void setDiaSemana(Integer diaSemana) {
        this.diaSemana = diaSemana;
    }

    public String getHoraInicioTaller() {
        return this.horaInicioTaller;
    }

    public Horario horaInicioTaller(String horaInicioTaller) {
        this.setHoraInicioTaller(horaInicioTaller);
        return this;
    }

    public void setHoraInicioTaller(String horaInicioTaller) {
        this.horaInicioTaller = horaInicioTaller;
    }

    public Taller getTaller() {
        return this.taller;
    }

    public void setTaller(Taller taller) {
        this.taller = taller;
    }

    public Horario taller(Taller taller) {
        this.setTaller(taller);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Horario)) {
            return false;
        }
        return id != null && id.equals(((Horario) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Horario{" +
            "id=" + getId() +
            ", diaSemana=" + getDiaSemana() +
            ", horaInicioTaller='" + getHoraInicioTaller() + "'" +
            "}";
    }
}
