package com.academia.app.repository;

import com.academia.app.domain.Taller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Taller entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TallerRepository extends JpaRepository<Taller, Long> {

    @Query(value = "SELECT * FROM taller t where nombre LIKE %:nombre%", nativeQuery = true)
    Page<Taller> findByNombre(@Param("nombre") String nombre, Pageable pageable);

}
