package com.academia.app.repository;

import com.academia.app.domain.Alumno;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Alumno entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AlumnoRepository extends JpaRepository<Alumno, Long> {
    @Query(value = "SELECT * FROM alumno a where nombre LIKE %:busqueda% OR apellido LIKE %:busqueda% OR dni LIKE %:busqueda%", nativeQuery = true)
    Page<Alumno> findByBusqueda(@Param("busqueda") String busqueda, Pageable pageable);
}
