package com.academia.app.service;

import com.academia.app.domain.Contacto;
import com.academia.app.repository.ContactoRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Contacto}.
 */
@Service
@Transactional
public class ContactoService {

    private final Logger log = LoggerFactory.getLogger(ContactoService.class);

    private final ContactoRepository contactoRepository;

    public ContactoService(ContactoRepository contactoRepository) {
        this.contactoRepository = contactoRepository;
    }

    /**
     * Save a contacto.
     *
     * @param contacto the entity to save.
     * @return the persisted entity.
     */
    public Contacto save(Contacto contacto) {
        log.debug("Request to save Contacto : {}", contacto);
        return contactoRepository.save(contacto);
    }

    /**
     * Partially update a contacto.
     *
     * @param contacto the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Contacto> partialUpdate(Contacto contacto) {
        log.debug("Request to partially update Contacto : {}", contacto);

        return contactoRepository
            .findById(contacto.getId())
            .map(existingContacto -> {
                if (contacto.getNombre() != null) {
                    existingContacto.setNombre(contacto.getNombre());
                }
                if (contacto.getTelefono() != null) {
                    existingContacto.setTelefono(contacto.getTelefono());
                }
                if (contacto.getCorreo() != null) {
                    existingContacto.setCorreo(contacto.getCorreo());
                }

                return existingContacto;
            })
            .map(contactoRepository::save);
    }

    /**
     * Get all the contactos.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Contacto> findAll(Pageable pageable) {
        log.debug("Request to get all Contactos");
        return contactoRepository.findAll(pageable);
    }

    /**
     * Get one contacto by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Contacto> findOne(Long id) {
        log.debug("Request to get Contacto : {}", id);
        return contactoRepository.findById(id);
    }

    /**
     * Delete the contacto by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Contacto : {}", id);
        contactoRepository.deleteById(id);
    }
}
