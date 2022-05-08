package com.academia.app.service;

import com.academia.app.domain.Suscripcion;
import com.academia.app.repository.SuscripcionRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Suscripcion}.
 */
@Service
@Transactional
public class SuscripcionService {

    private final Logger log = LoggerFactory.getLogger(SuscripcionService.class);

    private final SuscripcionRepository suscripcionRepository;

    public SuscripcionService(SuscripcionRepository suscripcionRepository) {
        this.suscripcionRepository = suscripcionRepository;
    }

    /**
     * Save a suscripcion.
     *
     * @param suscripcion the entity to save.
     * @return the persisted entity.
     */
    public Suscripcion save(Suscripcion suscripcion) {
        log.debug("Request to save Suscripcion : {}", suscripcion);
        return suscripcionRepository.save(suscripcion);
    }

    /**
     * Partially update a suscripcion.
     *
     * @param suscripcion the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Suscripcion> partialUpdate(Suscripcion suscripcion) {
        log.debug("Request to partially update Suscripcion : {}", suscripcion);

        return suscripcionRepository
            .findById(suscripcion.getId())
            .map(existingSuscripcion -> {
                if (suscripcion.getFecha() != null) {
                    existingSuscripcion.setFecha(suscripcion.getFecha());
                }
                if (suscripcion.getActiva() != null) {
                    existingSuscripcion.setActiva(suscripcion.getActiva());
                }

                return existingSuscripcion;
            })
            .map(suscripcionRepository::save);
    }

    /**
     * Get all the suscripcions.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Suscripcion> findAll(Pageable pageable) {
        log.debug("Request to get all Suscripcions");
        return suscripcionRepository.findAll(pageable);
    }

    /**
     * Get all the suscripcions by id Taller.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Suscripcion> findAllByIdTaller(Pageable pageable, Integer idTaller) {
        log.debug("Request to get all Suscripcions by Id Taller");
        return suscripcionRepository.findByTallerId(idTaller, pageable);
    }

    /**
     * Get one suscripcion by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Suscripcion> findOne(Long id) {
        log.debug("Request to get Suscripcion : {}", id);
        return suscripcionRepository.findById(id);
    }

    /**
     * Delete the suscripcion by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Suscripcion : {}", id);
        suscripcionRepository.deleteById(id);
    }
}
