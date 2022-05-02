package com.academia.app.web.rest;

import com.academia.app.domain.Horario;
import com.academia.app.repository.HorarioRepository;
import com.academia.app.service.HorarioService;
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
 * REST controller for managing {@link com.academia.app.domain.Horario}.
 */
@RestController
@RequestMapping("/api")
public class HorarioResource {

    private final Logger log = LoggerFactory.getLogger(HorarioResource.class);

    private static final String ENTITY_NAME = "horario";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final HorarioService horarioService;

    private final HorarioRepository horarioRepository;

    public HorarioResource(HorarioService horarioService, HorarioRepository horarioRepository) {
        this.horarioService = horarioService;
        this.horarioRepository = horarioRepository;
    }

    /**
     * {@code POST  /horarios} : Create a new horario.
     *
     * @param horario the horario to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new horario, or with status {@code 400 (Bad Request)} if the horario has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/horarios")
    public ResponseEntity<Horario> createHorario(@Valid @RequestBody Horario horario) throws URISyntaxException {
        log.debug("REST request to save Horario : {}", horario);
        if (horario.getId() != null) {
            throw new BadRequestAlertException("A new horario cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Horario result = horarioService.save(horario);
        return ResponseEntity
            .created(new URI("/api/horarios/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /horarios/:id} : Updates an existing horario.
     *
     * @param id the id of the horario to save.
     * @param horario the horario to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated horario,
     * or with status {@code 400 (Bad Request)} if the horario is not valid,
     * or with status {@code 500 (Internal Server Error)} if the horario couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/horarios/{id}")
    public ResponseEntity<Horario> updateHorario(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Horario horario
    ) throws URISyntaxException {
        log.debug("REST request to update Horario : {}, {}", id, horario);
        if (horario.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, horario.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!horarioRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Horario result = horarioService.save(horario);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, horario.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /horarios/:id} : Partial updates given fields of an existing horario, field will ignore if it is null
     *
     * @param id the id of the horario to save.
     * @param horario the horario to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated horario,
     * or with status {@code 400 (Bad Request)} if the horario is not valid,
     * or with status {@code 404 (Not Found)} if the horario is not found,
     * or with status {@code 500 (Internal Server Error)} if the horario couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/horarios/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Horario> partialUpdateHorario(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Horario horario
    ) throws URISyntaxException {
        log.debug("REST request to partial update Horario partially : {}, {}", id, horario);
        if (horario.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, horario.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!horarioRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Horario> result = horarioService.partialUpdate(horario);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, horario.getId().toString())
        );
    }

    /**
     * {@code GET  /horarios} : get all the horarios.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of horarios in body.
     */
    @GetMapping("/horarios")
    public ResponseEntity<List<Horario>> getAllHorarios(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Horarios");
        Page<Horario> page = horarioService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /horarios/:id} : get the "id" horario.
     *
     * @param id the id of the horario to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the horario, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/horarios/{id}")
    public ResponseEntity<Horario> getHorario(@PathVariable Long id) {
        log.debug("REST request to get Horario : {}", id);
        Optional<Horario> horario = horarioService.findOne(id);
        return ResponseUtil.wrapOrNotFound(horario);
    }

    /**
     * {@code GET  /horarios/taller/:id_taller} : get all the horarios where taller id = id_taller.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of horarios in body.
     */
    @GetMapping("/horarios/taller/{id_taller}")
    public ResponseEntity<List<Horario>> getAllHorariosByTallerId(@org.springdoc.api.annotations.ParameterObject Pageable pageable, @PathVariable Integer id_taller) {
        log.debug("REST request to get a page of Horarios by Taller Id");
        Page<Horario> page = horarioService.findHorarioByTallerId(pageable, id_taller);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code DELETE  /horarios/:id} : delete the "id" horario.
     *
     * @param id the id of the horario to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/horarios/{id}")
    public ResponseEntity<Void> deleteHorario(@PathVariable Long id) {
        log.debug("REST request to delete Horario : {}", id);
        horarioService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
