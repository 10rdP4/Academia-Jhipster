package com.academia.app.repository;

import com.academia.app.domain.Contacto;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Contacto entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ContactoRepository extends JpaRepository<Contacto, Long> {
    @Query(value = "SELECT * FROM contacto a where nombre LIKE %:busqueda% OR telefono LIKE %:busqueda% OR correo LIKE %:busqueda% OR dni LIKE %:busqueda%", nativeQuery = true)
    Page<Contacto> findByBusqueda(@Param("busqueda") String busqueda, Pageable pageable);
}
