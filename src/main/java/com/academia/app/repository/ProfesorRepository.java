package com.academia.app.repository;

import com.academia.app.domain.Profesor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Profesor entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProfesorRepository extends JpaRepository<Profesor, Long> {

    @Query(value = "SELECT * FROM profesor p where dni LIKE %:dni%", nativeQuery = true)
    Page<Profesor> findByDni(@Param("dni") String dni, Pageable pageable);

}
