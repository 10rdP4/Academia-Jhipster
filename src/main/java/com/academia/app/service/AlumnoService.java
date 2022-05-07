package com.academia.app.service;

import com.academia.app.domain.Alumno;
import com.academia.app.repository.AlumnoRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Alumno}.
 */
@Service
@Transactional
public class AlumnoService {

    private final Logger log = LoggerFactory.getLogger(AlumnoService.class);

    private final AlumnoRepository alumnoRepository;

    public AlumnoService(AlumnoRepository alumnoRepository) {
        this.alumnoRepository = alumnoRepository;
    }

    /**
     * Save a alumno.
     *
     * @param alumno the entity to save.
     * @return the persisted entity.
     */
    public Alumno save(Alumno alumno) {
        log.debug("Request to save Alumno : {}", alumno);
        return alumnoRepository.save(alumno);
    }

    /**
     * Partially update a alumno.
     *
     * @param alumno the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Alumno> partialUpdate(Alumno alumno) {
        log.debug("Request to partially update Alumno : {}", alumno);

        return alumnoRepository
            .findById(alumno.getId())
            .map(existingAlumno -> {
                if (alumno.getNombre() != null) {
                    existingAlumno.setNombre(alumno.getNombre());
                }
                if (alumno.getApellido() != null) {
                    existingAlumno.setApellido(alumno.getApellido());
                }
                if (alumno.getDni() != null) {
                    existingAlumno.setDni(alumno.getDni());
                }

                return existingAlumno;
            })
            .map(alumnoRepository::save);
    }

    /**
     * Get all the alumnos.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Alumno> findAll(Pageable pageable) {
        log.debug("Request to get all Alumnos");
        return alumnoRepository.findAll(pageable);
    }

    /**
     * Get all the alumnos.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Alumno> findByBusqueda(String busqueda, Pageable pageable) {
        log.debug("Request to get all Alumnos");
        return alumnoRepository.findByBusqueda(busqueda, pageable);
    }

    /**
     * Get one alumno by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Alumno> findOne(Long id) {
        log.debug("Request to get Alumno : {}", id);
        return alumnoRepository.findById(id);
    }

    /**
     * Delete the alumno by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Alumno : {}", id);
        alumnoRepository.deleteById(id);
    }
}
