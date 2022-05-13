package com.academia.app.repository;

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

}
