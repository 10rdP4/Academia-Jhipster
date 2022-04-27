package com.academia.app.repository;

import com.academia.app.domain.Taller;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Taller entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TallerRepository extends JpaRepository<Taller, Long> {}
