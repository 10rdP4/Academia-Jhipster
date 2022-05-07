package com.academia.app.web.rest;

import com.academia.app.domain.Contacto;
import com.academia.app.repository.ContactoRepository;
import com.academia.app.service.ContactoService;
import com.academia.app.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.academia.app.domain.Contacto}.
 */
@RestController
@RequestMapping("/api")
public class ContactoResource {

    private final Logger log = LoggerFactory.getLogger(ContactoResource.class);

    private static final String ENTITY_NAME = "contacto";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ContactoService contactoService;

    private final ContactoRepository contactoRepository;

    public ContactoResource(ContactoService contactoService, ContactoRepository contactoRepository) {
        this.contactoService = contactoService;
        this.contactoRepository = contactoRepository;
    }

    /**
     * {@code POST  /contactos} : Create a new contacto.
     *
     * @param contacto the contacto to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new contacto, or with status {@code 400 (Bad Request)} if the contacto has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/contactos")
    public ResponseEntity<Contacto> createContacto(@Valid @RequestBody Contacto contacto) throws URISyntaxException {
        log.debug("REST request to save Contacto : {}", contacto);
        if (contacto.getId() != null) {
            throw new BadRequestAlertException("A new contacto cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Contacto result = contactoService.save(contacto);
        return ResponseEntity
            .created(new URI("/api/contactos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /contactos/:id} : Updates an existing contacto.
     *
     * @param id the id of the contacto to save.
     * @param contacto the contacto to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated contacto,
     * or with status {@code 400 (Bad Request)} if the contacto is not valid,
     * or with status {@code 500 (Internal Server Error)} if the contacto couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/contactos/{id}")
    public ResponseEntity<Contacto> updateContacto(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Contacto contacto
    ) throws URISyntaxException {
        log.debug("REST request to update Contacto : {}, {}", id, contacto);
        if (contacto.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, contacto.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!contactoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Contacto result = contactoService.save(contacto);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, contacto.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /contactos/:id} : Partial updates given fields of an existing contacto, field will ignore if it is null
     *
     * @param id the id of the contacto to save.
     * @param contacto the contacto to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated contacto,
     * or with status {@code 400 (Bad Request)} if the contacto is not valid,
     * or with status {@code 404 (Not Found)} if the contacto is not found,
     * or with status {@code 500 (Internal Server Error)} if the contacto couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/contactos/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Contacto> partialUpdateContacto(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Contacto contacto
    ) throws URISyntaxException {
        log.debug("REST request to partial update Contacto partially : {}, {}", id, contacto);
        if (contacto.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, contacto.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!contactoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Contacto> result = contactoService.partialUpdate(contacto);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, contacto.getId().toString())
        );
    }

    /**
     * {@code GET  /contactos} : get all the contactos.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of contactos in body.
     */
    @GetMapping("/contactos")
    public ResponseEntity<List<Contacto>> getAllContactos(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Contactos");
        Page<Contacto> page = contactoService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /contactos/busqueda/:busqueda} : get all the contactos by busqueda.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of alumnos in body.
     */
    @GetMapping("/contactos/busqueda/{busqueda}")
    public ResponseEntity<List<Contacto>> getContactosByBusqueda(@org.springdoc.api.annotations.ParameterObject Pageable pageable, @PathVariable String busqueda) {
        log.debug("REST request to get a page of Contactos by busqueda");
        Page<Contacto> page = contactoService.findByBusqueda(busqueda, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /contactos/:id} : get the "id" contacto.
     *
     * @param id the id of the contacto to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the contacto, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/contactos/{id}")
    public ResponseEntity<Contacto> getContacto(@PathVariable Long id) {
        log.debug("REST request to get Contacto : {}", id);
        Optional<Contacto> contacto = contactoService.findOne(id);
        return ResponseUtil.wrapOrNotFound(contacto);
    }

    /**
     * {@code DELETE  /contactos/:id} : delete the "id" contacto.
     *
     * @param id the id of the contacto to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/contactos/{id}")
    public ResponseEntity<Void> deleteContacto(@PathVariable Long id) {
        log.debug("REST request to delete Contacto : {}", id);
        contactoService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
