package com.academia.app.service;

import com.academia.app.domain.Asistencia;
import com.academia.app.repository.AsistenciaRepository;

import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


/**
 * Service Implementation for managing {@link Asistencia}.
 */
@Service
@Transactional
public class AsistenciaService {

    private final Logger log = LoggerFactory.getLogger(AsistenciaService.class);

    private final AsistenciaRepository asistenciaRepository;

    public AsistenciaService(AsistenciaRepository asistenciaRepository) {
        this.asistenciaRepository = asistenciaRepository;
    }

    /**
     * Save a asistencia.
     *
     * @param asistencia the entity to save.
     * @return the persisted entity.
     */
    public Asistencia save(Asistencia asistencia) {
        log.debug("Request to save Asistencia : {}", asistencia);
        return asistenciaRepository.save(asistencia);
    }

    /**
     * Partially update a asistencia.
     *
     * @param asistencia the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Asistencia> partialUpdate(Asistencia asistencia) {
        log.debug("Request to partially update Asistencia : {}", asistencia);

        return asistenciaRepository
            .findById(asistencia.getId())
            .map(existingAsistencia -> {
                if (asistencia.getFecha() != null) {
                    existingAsistencia.setFecha(asistencia.getFecha());
                }
                if (asistencia.getAsistencia() != null) {
                    existingAsistencia.setAsistencia(asistencia.getAsistencia());
                }

                return existingAsistencia;
            })
            .map(asistenciaRepository::save);
    }

    /**
     * Get all the asistencias.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Asistencia> findAll(Pageable pageable) {
        log.debug("Request to get all Asistencias");
        return asistenciaRepository.findAll(pageable);
    }

    /**
     * Get all the asistencias by fecha. 
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Asistencia> findAllByFecha(String fecha) {
        log.debug("Request to get all Asistencias by fecha and Taller ID");
        return asistenciaRepository.findByFecha(fecha);
    }

    /**
     * Get all the asistencias by fecha and Taller id.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Asistencia> findAllByFechaTallerId(Pageable pageable, String fecha, Integer tallerId) {
        log.debug("Request to get all Asistencias by fecha and Taller ID");
        return asistenciaRepository.findByTallerId(tallerId, fecha, pageable);
    }

    /**
     * Get one asistencia by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Asistencia> findOne(Long id) {
        log.debug("Request to get Asistencia : {}", id);
        return asistenciaRepository.findById(id);
    }

    /**
     * Delete the asistencia by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Asistencia : {}", id);
        asistenciaRepository.deleteById(id);
    }
}
