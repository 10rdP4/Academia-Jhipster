package com.academia.app.repository;

import com.academia.app.domain.Contacto;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Contacto entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ContactoRepository extends JpaRepository<Contacto, Long> {}
