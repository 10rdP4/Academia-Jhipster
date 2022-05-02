package com.academia.app.service;

import com.academia.app.domain.Horario;
import com.academia.app.repository.HorarioRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Horario}.
 */
@Service
@Transactional
public class HorarioService {

    private final Logger log = LoggerFactory.getLogger(HorarioService.class);

    private final HorarioRepository horarioRepository;

    public HorarioService(HorarioRepository horarioRepository) {
        this.horarioRepository = horarioRepository;
    }

    /**
     * Save a horario.
     *
     * @param horario the entity to save.
     * @return the persisted entity.
     */
    public Horario save(Horario horario) {
        log.debug("Request to save Horario : {}", horario);
        return horarioRepository.save(horario);
    }

    /**
     * Partially update a horario.
     *
     * @param horario the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Horario> partialUpdate(Horario horario) {
        log.debug("Request to partially update Horario : {}", horario);

        return horarioRepository
            .findById(horario.getId())
            .map(existingHorario -> {
                if (horario.getDiaSemana() != null) {
                    existingHorario.setDiaSemana(horario.getDiaSemana());
                }
                if (horario.getHoraInicioTaller() != null) {
                    existingHorario.setHoraInicioTaller(horario.getHoraInicioTaller());
                }

                return existingHorario;
            })
            .map(horarioRepository::save);
    }

    /**
     * Get all the horarios.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Horario> findAll(Pageable pageable) {
        log.debug("Request to get all Horarios");
        return horarioRepository.findAll(pageable);
    }

    /**
     * Get one horario by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Horario> findOne(Long id) {
        log.debug("Request to get Horario : {}", id);
        return horarioRepository.findById(id);
    }

    /**
     * Get all the horarios by Taller id.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Horario> findHorarioByTallerId(Pageable pageable, Integer tallerId) {
        log.debug("Request to get all Horarios by taller id");
        return horarioRepository.findByTallerId(tallerId, pageable);
    }

    /**
     * Delete the horario by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Horario : {}", id);
        horarioRepository.deleteById(id);
    }
}
