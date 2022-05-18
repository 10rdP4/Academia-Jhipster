package com.academia.app.repository;

import java.util.Optional;

import com.academia.app.domain.Suscripcion;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Suscripcion entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SuscripcionRepository extends JpaRepository<Suscripcion, Long> {

    @Query(value = "SELECT * FROM suscripcion s where taller_id = :id_taller AND activa = true", nativeQuery = true)
    Page<Suscripcion> findByTallerId(@Param("id_taller") Integer tallerId, Pageable pageable);

    @Query(value = "SELECT * FROM suscripcion s where alumno_id = :alumno_id AND taller_id = :taller_id", nativeQuery = true)
    Optional<Suscripcion> findByAlumnoIdTallerId(@Param("alumno_id") Integer alumno_id, @Param("taller_id") Integer taller_id);

    @Query(value = "SELECT * FROM suscripcion s where alumno_id = :alumno_id", nativeQuery = true)
    Page<Suscripcion> findByAlumnoId(@Param("alumno_id") Integer alumno_id, Pageable pageable);

}
