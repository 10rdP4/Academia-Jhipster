package com.academia.app.web.rest;

import com.academia.app.domain.Asistencia;
import com.academia.app.repository.AsistenciaRepository;
import com.academia.app.service.AsistenciaService;
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
 * REST controller for managing {@link com.academia.app.domain.Asistencia}.
 */
@RestController
@RequestMapping("/api")
public class AsistenciaResource {

    private final Logger log = LoggerFactory.getLogger(AsistenciaResource.class);

    private static final String ENTITY_NAME = "asistencia";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AsistenciaService asistenciaService;

    private final AsistenciaRepository asistenciaRepository;

    public AsistenciaResource(AsistenciaService asistenciaService, AsistenciaRepository asistenciaRepository) {
        this.asistenciaService = asistenciaService;
        this.asistenciaRepository = asistenciaRepository;
    }

    /**
     * {@code POST  /asistencias} : Create a new asistencia.
     *
     * @param asistencia the asistencia to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new asistencia, or with status {@code 400 (Bad Request)} if the asistencia has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/asistencias")
    public ResponseEntity<Asistencia> createAsistencia(@Valid @RequestBody Asistencia asistencia) throws URISyntaxException {
        log.debug("REST request to save Asistencia : {}", asistencia);
        if (asistencia.getId() != null) {
            throw new BadRequestAlertException("A new asistencia cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Asistencia result = asistenciaService.save(asistencia);
        return ResponseEntity
            .created(new URI("/api/asistencias/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /asistencias/:id} : Updates an existing asistencia.
     *
     * @param id the id of the asistencia to save.
     * @param asistencia the asistencia to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated asistencia,
     * or with status {@code 400 (Bad Request)} if the asistencia is not valid,
     * or with status {@code 500 (Internal Server Error)} if the asistencia couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/asistencias/{id}")
    public ResponseEntity<Asistencia> updateAsistencia(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Asistencia asistencia
    ) throws URISyntaxException {
        log.debug("REST request to update Asistencia : {}, {}", id, asistencia);
        if (asistencia.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, asistencia.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!asistenciaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Asistencia result = asistenciaService.save(asistencia);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, asistencia.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /asistencias/:id} : Partial updates given fields of an existing asistencia, field will ignore if it is null
     *
     * @param id the id of the asistencia to save.
     * @param asistencia the asistencia to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated asistencia,
     * or with status {@code 400 (Bad Request)} if the asistencia is not valid,
     * or with status {@code 404 (Not Found)} if the asistencia is not found,
     * or with status {@code 500 (Internal Server Error)} if the asistencia couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/asistencias/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Asistencia> partialUpdateAsistencia(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Asistencia asistencia
    ) throws URISyntaxException {
        log.debug("REST request to partial update Asistencia partially : {}, {}", id, asistencia);
        if (asistencia.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, asistencia.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!asistenciaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Asistencia> result = asistenciaService.partialUpdate(asistencia);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, asistencia.getId().toString())
        );
    }

    /**
     * {@code GET  /asistencias} : get all the asistencias.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of asistencias in body.
     */
    @GetMapping("/asistencias")
    public ResponseEntity<List<Asistencia>> getAllAsistencias(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Asistencias");
        Page<Asistencia> page = asistenciaService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /asistencias/:id} : get the "id" asistencia.
     *
     * @param id the id of the asistencia to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the asistencia, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/asistencias/{id}")
    public ResponseEntity<Asistencia> getAsistencia(@PathVariable Long id) {
        log.debug("REST request to get Asistencia : {}", id);
        Optional<Asistencia> asistencia = asistenciaService.findOne(id);
        return ResponseUtil.wrapOrNotFound(asistencia);
    }

    /**
     * {@code DELETE  /asistencias/:id} : delete the "id" asistencia.
     *
     * @param id the id of the asistencia to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/asistencias/{id}")
    public ResponseEntity<Void> deleteAsistencia(@PathVariable Long id) {
        log.debug("REST request to delete Asistencia : {}", id);
        asistenciaService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
