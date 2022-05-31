package com.academia.app.repository;

import java.util.List;

import com.academia.app.domain.Asistencia;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


/**
 * Spring Data SQL repository for the Asistencia entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AsistenciaRepository extends JpaRepository<Asistencia, Long> {
    @Query(value = "SELECT * FROM asistencia a WHERE fecha LIKE %:fecha% AND taller_id = :taller_id", nativeQuery = true)
    Page<Asistencia> findByTallerId(@Param("taller_id") Integer tallerId, @Param("fecha") String fecha, Pageable pageable);
    
    @Query(value = "SELECT * FROM asistencia a WHERE fecha LIKE %:fecha% ", nativeQuery = true)
    List<Asistencia> findByFecha(@Param("fecha") String fecha);
}
