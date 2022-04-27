package com.academia.app.service;

import com.academia.app.domain.Profesor;
import com.academia.app.repository.ProfesorRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Profesor}.
 */
@Service
@Transactional
public class ProfesorService {

    private final Logger log = LoggerFactory.getLogger(ProfesorService.class);

    private final ProfesorRepository profesorRepository;

    public ProfesorService(ProfesorRepository profesorRepository) {
        this.profesorRepository = profesorRepository;
    }

    /**
     * Save a profesor.
     *
     * @param profesor the entity to save.
     * @return the persisted entity.
     */
    public Profesor save(Profesor profesor) {
        log.debug("Request to save Profesor : {}", profesor);
        return profesorRepository.save(profesor);
    }

    /**
     * Partially update a profesor.
     *
     * @param profesor the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Profesor> partialUpdate(Profesor profesor) {
        log.debug("Request to partially update Profesor : {}", profesor);

        return profesorRepository
            .findById(profesor.getId())
            .map(existingProfesor -> {
                if (profesor.getNombre() != null) {
                    existingProfesor.setNombre(profesor.getNombre());
                }
                if (profesor.getApellido() != null) {
                    existingProfesor.setApellido(profesor.getApellido());
                }
                if (profesor.getSueldo() != null) {
                    existingProfesor.setSueldo(profesor.getSueldo());
                }

                return existingProfesor;
            })
            .map(profesorRepository::save);
    }

    /**
     * Get all the profesors.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Profesor> findAll(Pageable pageable) {
        log.debug("Request to get all Profesors");
        return profesorRepository.findAll(pageable);
    }

    /**
     * Get one profesor by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Profesor> findOne(Long id) {
        log.debug("Request to get Profesor : {}", id);
        return profesorRepository.findById(id);
    }

    /**
     * Delete the profesor by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Profesor : {}", id);
        profesorRepository.deleteById(id);
    }
}
