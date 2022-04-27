package com.academia.app.repository;

import com.academia.app.domain.Asistencia;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Asistencia entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AsistenciaRepository extends JpaRepository<Asistencia, Long> {}
