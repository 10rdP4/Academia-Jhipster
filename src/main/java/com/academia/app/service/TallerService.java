package com.academia.app.service;

import com.academia.app.domain.Taller;
import com.academia.app.repository.TallerRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Taller}.
 */
@Service
@Transactional
public class TallerService {

    private final Logger log = LoggerFactory.getLogger(TallerService.class);

    private final TallerRepository tallerRepository;

    public TallerService(TallerRepository tallerRepository) {
        this.tallerRepository = tallerRepository;
    }

    /**
     * Save a taller.
     *
     * @param taller the entity to save.
     * @return the persisted entity.
     */
    public Taller save(Taller taller) {
        log.debug("Request to save Taller : {}", taller);
        return tallerRepository.save(taller);
    }

    /**
     * Partially update a taller.
     *
     * @param taller the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Taller> partialUpdate(Taller taller) {
        log.debug("Request to partially update Taller : {}", taller);

        return tallerRepository
            .findById(taller.getId())
            .map(existingTaller -> {
                if (taller.getNombre() != null) {
                    existingTaller.setNombre(taller.getNombre());
                }
                if (taller.getPrecio() != null) {
                    existingTaller.setPrecio(taller.getPrecio());
                }
                if (taller.getDescripcion() != null) {
                    existingTaller.setDescripcion(taller.getDescripcion());
                }

                return existingTaller;
            })
            .map(tallerRepository::save);
    }

    /**
     * Get all the tallers.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Taller> findAll(Pageable pageable) {
        log.debug("Request to get all Tallers");
        return tallerRepository.findAll(pageable);
    }

    /**
     * Get all the tallers by nombre.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Taller> findAllByNombre(Pageable pageable, String nombre) {
        log.debug("Request to get all Tallers by nombre");
        return tallerRepository.findByNombre(nombre, pageable);
    }

    /**
     * Get one taller by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Taller> findOne(Long id) {
        log.debug("Request to get Taller : {}", id);
        return tallerRepository.findById(id);
    }

    /**
     * Delete the taller by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Taller : {}", id);
        tallerRepository.deleteById(id);
    }
}
