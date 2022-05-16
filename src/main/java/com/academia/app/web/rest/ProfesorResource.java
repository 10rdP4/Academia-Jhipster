package com.academia.app.web.rest;

import com.academia.app.domain.Profesor;
import com.academia.app.repository.ProfesorRepository;
import com.academia.app.service.ProfesorService;
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
 * REST controller for managing {@link com.academia.app.domain.Profesor}.
 */
@RestController
@RequestMapping("/api")
public class ProfesorResource {

    private final Logger log = LoggerFactory.getLogger(ProfesorResource.class);

    private static final String ENTITY_NAME = "profesor";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProfesorService profesorService;

    private final ProfesorRepository profesorRepository;

    public ProfesorResource(ProfesorService profesorService, ProfesorRepository profesorRepository) {
        this.profesorService = profesorService;
        this.profesorRepository = profesorRepository;
    }

    /**
     * {@code POST  /profesors} : Create a new profesor.
     *
     * @param profesor the profesor to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new profesor, or with status {@code 400 (Bad Request)} if the profesor has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/profesors")
    public ResponseEntity<Profesor> createProfesor(@Valid @RequestBody Profesor profesor) throws URISyntaxException {
        log.debug("REST request to save Profesor : {}", profesor);
        if (profesor.getId() != null) {
            throw new BadRequestAlertException("A new profesor cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Profesor result = profesorService.save(profesor);
        return ResponseEntity
            .created(new URI("/api/profesors/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /profesors/:id} : Updates an existing profesor.
     *
     * @param id the id of the profesor to save.
     * @param profesor the profesor to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated profesor,
     * or with status {@code 400 (Bad Request)} if the profesor is not valid,
     * or with status {@code 500 (Internal Server Error)} if the profesor couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/profesors/{id}")
    public ResponseEntity<Profesor> updateProfesor(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Profesor profesor
    ) throws URISyntaxException {
        log.debug("REST request to update Profesor : {}, {}", id, profesor);
        if (profesor.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, profesor.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!profesorRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Profesor result = profesorService.save(profesor);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, profesor.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /profesors/:id} : Partial updates given fields of an existing profesor, field will ignore if it is null
     *
     * @param id the id of the profesor to save.
     * @param profesor the profesor to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated profesor,
     * or with status {@code 400 (Bad Request)} if the profesor is not valid,
     * or with status {@code 404 (Not Found)} if the profesor is not found,
     * or with status {@code 500 (Internal Server Error)} if the profesor couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/profesors/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Profesor> partialUpdateProfesor(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Profesor profesor
    ) throws URISyntaxException {
        log.debug("REST request to partial update Profesor partially : {}, {}", id, profesor);
        if (profesor.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, profesor.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!profesorRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Profesor> result = profesorService.partialUpdate(profesor);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, profesor.getId().toString())
        );
    }

    /**
     * {@code GET  /profesors} : get all the profesors.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of profesors in body.
     */
    @GetMapping("/profesors")
    public ResponseEntity<List<Profesor>> getAllProfesors(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Profesors");
        Page<Profesor> page = profesorService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /profesors} : get all the profesors by dni.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of profesors in body.
     */
    @GetMapping("/profesors/buscar/{dni}")
    public ResponseEntity<List<Profesor>> getAllProfesorsByDni(@org.springdoc.api.annotations.ParameterObject Pageable pageable, @PathVariable String dni) {
        log.debug("REST request to get a page of Profesors by DNI");
        Page<Profesor> page = profesorService.findAllByDni(pageable, dni);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /profesors/:id} : get the "id" profesor.
     *
     * @param id the id of the profesor to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the profesor, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/profesors/{id}")
    public ResponseEntity<Profesor> getProfesor(@PathVariable Long id) {
        log.debug("REST request to get Profesor : {}", id);
        Optional<Profesor> profesor = profesorService.findOne(id);
        return ResponseUtil.wrapOrNotFound(profesor);
    }

    /**
     * {@code DELETE  /profesors/:id} : delete the "id" profesor.
     *
     * @param id the id of the profesor to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/profesors/{id}")
    public ResponseEntity<Void> deleteProfesor(@PathVariable Long id) {
        log.debug("REST request to delete Profesor : {}", id);
        profesorService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
