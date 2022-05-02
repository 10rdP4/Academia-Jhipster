package com.academia.app.repository;

import com.academia.app.domain.Horario;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Horario entity.
 */
@SuppressWarnings("unused")
@Repository
public interface HorarioRepository extends JpaRepository<Horario, Long> {

    @Query(value = "SELECT * FROM horario h where taller_id = :id_taller", nativeQuery = true)
    Page<Horario> findByTallerId(@Param("id_taller") Integer tallerId, Pageable pageable);
    
}
