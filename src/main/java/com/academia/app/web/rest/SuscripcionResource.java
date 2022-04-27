package com.academia.app.web.rest;

import com.academia.app.domain.Suscripcion;
import com.academia.app.repository.SuscripcionRepository;
import com.academia.app.service.SuscripcionService;
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
 * REST controller for managing {@link com.academia.app.domain.Suscripcion}.
 */
@RestController
@RequestMapping("/api")
public class SuscripcionResource {

    private final Logger log = LoggerFactory.getLogger(SuscripcionResource.class);

    private static final String ENTITY_NAME = "suscripcion";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SuscripcionService suscripcionService;

    private final SuscripcionRepository suscripcionRepository;

    public SuscripcionResource(SuscripcionService suscripcionService, SuscripcionRepository suscripcionRepository) {
        this.suscripcionService = suscripcionService;
        this.suscripcionRepository = suscripcionRepository;
    }

    /**
     * {@code POST  /suscripcions} : Create a new suscripcion.
     *
     * @param suscripcion the suscripcion to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new suscripcion, or with status {@code 400 (Bad Request)} if the suscripcion has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/suscripcions")
    public ResponseEntity<Suscripcion> createSuscripcion(@Valid @RequestBody Suscripcion suscripcion) throws URISyntaxException {
        log.debug("REST request to save Suscripcion : {}", suscripcion);
        if (suscripcion.getId() != null) {
            throw new BadRequestAlertException("A new suscripcion cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Suscripcion result = suscripcionService.save(suscripcion);
        return ResponseEntity
            .created(new URI("/api/suscripcions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /suscripcions/:id} : Updates an existing suscripcion.
     *
     * @param id the id of the suscripcion to save.
     * @param suscripcion the suscripcion to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated suscripcion,
     * or with status {@code 400 (Bad Request)} if the suscripcion is not valid,
     * or with status {@code 500 (Internal Server Error)} if the suscripcion couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/suscripcions/{id}")
    public ResponseEntity<Suscripcion> updateSuscripcion(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Suscripcion suscripcion
    ) throws URISyntaxException {
        log.debug("REST request to update Suscripcion : {}, {}", id, suscripcion);
        if (suscripcion.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, suscripcion.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!suscripcionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Suscripcion result = suscripcionService.save(suscripcion);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, suscripcion.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /suscripcions/:id} : Partial updates given fields of an existing suscripcion, field will ignore if it is null
     *
     * @param id the id of the suscripcion to save.
     * @param suscripcion the suscripcion to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated suscripcion,
     * or with status {@code 400 (Bad Request)} if the suscripcion is not valid,
     * or with status {@code 404 (Not Found)} if the suscripcion is not found,
     * or with status {@code 500 (Internal Server Error)} if the suscripcion couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/suscripcions/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Suscripcion> partialUpdateSuscripcion(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Suscripcion suscripcion
    ) throws URISyntaxException {
        log.debug("REST request to partial update Suscripcion partially : {}, {}", id, suscripcion);
        if (suscripcion.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, suscripcion.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!suscripcionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Suscripcion> result = suscripcionService.partialUpdate(suscripcion);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, suscripcion.getId().toString())
        );
    }

    /**
     * {@code GET  /suscripcions} : get all the suscripcions.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of suscripcions in body.
     */
    @GetMapping("/suscripcions")
    public ResponseEntity<List<Suscripcion>> getAllSuscripcions(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Suscripcions");
        Page<Suscripcion> page = suscripcionService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /suscripcions/:id} : get the "id" suscripcion.
     *
     * @param id the id of the suscripcion to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the suscripcion, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/suscripcions/{id}")
    public ResponseEntity<Suscripcion> getSuscripcion(@PathVariable Long id) {
        log.debug("REST request to get Suscripcion : {}", id);
        Optional<Suscripcion> suscripcion = suscripcionService.findOne(id);
        return ResponseUtil.wrapOrNotFound(suscripcion);
    }

    /**
     * {@code DELETE  /suscripcions/:id} : delete the "id" suscripcion.
     *
     * @param id the id of the suscripcion to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/suscripcions/{id}")
    public ResponseEntity<Void> deleteSuscripcion(@PathVariable Long id) {
        log.debug("REST request to delete Suscripcion : {}", id);
        suscripcionService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
