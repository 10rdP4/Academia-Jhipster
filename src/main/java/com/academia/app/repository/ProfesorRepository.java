package com.academia.app.repository;

import com.academia.app.domain.Profesor;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Profesor entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProfesorRepository extends JpaRepository<Profesor, Long> {}
