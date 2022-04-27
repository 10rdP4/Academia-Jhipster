package com.academia.app.web.rest;

import static com.academia.app.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.academia.app.IntegrationTest;
import com.academia.app.domain.Suscripcion;
import com.academia.app.repository.SuscripcionRepository;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link SuscripcionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SuscripcionResourceIT {

    private static final ZonedDateTime DEFAULT_FECHA = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_FECHA = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Boolean DEFAULT_ACTIVA = false;
    private static final Boolean UPDATED_ACTIVA = true;

    private static final String ENTITY_API_URL = "/api/suscripcions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SuscripcionRepository suscripcionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSuscripcionMockMvc;

    private Suscripcion suscripcion;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Suscripcion createEntity(EntityManager em) {
        Suscripcion suscripcion = new Suscripcion().fecha(DEFAULT_FECHA).activa(DEFAULT_ACTIVA);
        return suscripcion;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Suscripcion createUpdatedEntity(EntityManager em) {
        Suscripcion suscripcion = new Suscripcion().fecha(UPDATED_FECHA).activa(UPDATED_ACTIVA);
        return suscripcion;
    }

    @BeforeEach
    public void initTest() {
        suscripcion = createEntity(em);
    }

    @Test
    @Transactional
    void createSuscripcion() throws Exception {
        int databaseSizeBeforeCreate = suscripcionRepository.findAll().size();
        // Create the Suscripcion
        restSuscripcionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(suscripcion)))
            .andExpect(status().isCreated());

        // Validate the Suscripcion in the database
        List<Suscripcion> suscripcionList = suscripcionRepository.findAll();
        assertThat(suscripcionList).hasSize(databaseSizeBeforeCreate + 1);
        Suscripcion testSuscripcion = suscripcionList.get(suscripcionList.size() - 1);
        assertThat(testSuscripcion.getFecha()).isEqualTo(DEFAULT_FECHA);
        assertThat(testSuscripcion.getActiva()).isEqualTo(DEFAULT_ACTIVA);
    }

    @Test
    @Transactional
    void createSuscripcionWithExistingId() throws Exception {
        // Create the Suscripcion with an existing ID
        suscripcion.setId(1L);

        int databaseSizeBeforeCreate = suscripcionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSuscripcionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(suscripcion)))
            .andExpect(status().isBadRequest());

        // Validate the Suscripcion in the database
        List<Suscripcion> suscripcionList = suscripcionRepository.findAll();
        assertThat(suscripcionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkFechaIsRequired() throws Exception {
        int databaseSizeBeforeTest = suscripcionRepository.findAll().size();
        // set the field null
        suscripcion.setFecha(null);

        // Create the Suscripcion, which fails.

        restSuscripcionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(suscripcion)))
            .andExpect(status().isBadRequest());

        List<Suscripcion> suscripcionList = suscripcionRepository.findAll();
        assertThat(suscripcionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllSuscripcions() throws Exception {
        // Initialize the database
        suscripcionRepository.saveAndFlush(suscripcion);

        // Get all the suscripcionList
        restSuscripcionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(suscripcion.getId().intValue())))
            .andExpect(jsonPath("$.[*].fecha").value(hasItem(sameInstant(DEFAULT_FECHA))))
            .andExpect(jsonPath("$.[*].activa").value(hasItem(DEFAULT_ACTIVA.booleanValue())));
    }

    @Test
    @Transactional
    void getSuscripcion() throws Exception {
        // Initialize the database
        suscripcionRepository.saveAndFlush(suscripcion);

        // Get the suscripcion
        restSuscripcionMockMvc
            .perform(get(ENTITY_API_URL_ID, suscripcion.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(suscripcion.getId().intValue()))
            .andExpect(jsonPath("$.fecha").value(sameInstant(DEFAULT_FECHA)))
            .andExpect(jsonPath("$.activa").value(DEFAULT_ACTIVA.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingSuscripcion() throws Exception {
        // Get the suscripcion
        restSuscripcionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewSuscripcion() throws Exception {
        // Initialize the database
        suscripcionRepository.saveAndFlush(suscripcion);

        int databaseSizeBeforeUpdate = suscripcionRepository.findAll().size();

        // Update the suscripcion
        Suscripcion updatedSuscripcion = suscripcionRepository.findById(suscripcion.getId()).get();
        // Disconnect from session so that the updates on updatedSuscripcion are not directly saved in db
        em.detach(updatedSuscripcion);
        updatedSuscripcion.fecha(UPDATED_FECHA).activa(UPDATED_ACTIVA);

        restSuscripcionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSuscripcion.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSuscripcion))
            )
            .andExpect(status().isOk());

        // Validate the Suscripcion in the database
        List<Suscripcion> suscripcionList = suscripcionRepository.findAll();
        assertThat(suscripcionList).hasSize(databaseSizeBeforeUpdate);
        Suscripcion testSuscripcion = suscripcionList.get(suscripcionList.size() - 1);
        assertThat(testSuscripcion.getFecha()).isEqualTo(UPDATED_FECHA);
        assertThat(testSuscripcion.getActiva()).isEqualTo(UPDATED_ACTIVA);
    }

    @Test
    @Transactional
    void putNonExistingSuscripcion() throws Exception {
        int databaseSizeBeforeUpdate = suscripcionRepository.findAll().size();
        suscripcion.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSuscripcionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, suscripcion.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(suscripcion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Suscripcion in the database
        List<Suscripcion> suscripcionList = suscripcionRepository.findAll();
        assertThat(suscripcionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSuscripcion() throws Exception {
        int databaseSizeBeforeUpdate = suscripcionRepository.findAll().size();
        suscripcion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSuscripcionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(suscripcion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Suscripcion in the database
        List<Suscripcion> suscripcionList = suscripcionRepository.findAll();
        assertThat(suscripcionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSuscripcion() throws Exception {
        int databaseSizeBeforeUpdate = suscripcionRepository.findAll().size();
        suscripcion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSuscripcionMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(suscripcion)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Suscripcion in the database
        List<Suscripcion> suscripcionList = suscripcionRepository.findAll();
        assertThat(suscripcionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSuscripcionWithPatch() throws Exception {
        // Initialize the database
        suscripcionRepository.saveAndFlush(suscripcion);

        int databaseSizeBeforeUpdate = suscripcionRepository.findAll().size();

        // Update the suscripcion using partial update
        Suscripcion partialUpdatedSuscripcion = new Suscripcion();
        partialUpdatedSuscripcion.setId(suscripcion.getId());

        partialUpdatedSuscripcion.fecha(UPDATED_FECHA);

        restSuscripcionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSuscripcion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSuscripcion))
            )
            .andExpect(status().isOk());

        // Validate the Suscripcion in the database
        List<Suscripcion> suscripcionList = suscripcionRepository.findAll();
        assertThat(suscripcionList).hasSize(databaseSizeBeforeUpdate);
        Suscripcion testSuscripcion = suscripcionList.get(suscripcionList.size() - 1);
        assertThat(testSuscripcion.getFecha()).isEqualTo(UPDATED_FECHA);
        assertThat(testSuscripcion.getActiva()).isEqualTo(DEFAULT_ACTIVA);
    }

    @Test
    @Transactional
    void fullUpdateSuscripcionWithPatch() throws Exception {
        // Initialize the database
        suscripcionRepository.saveAndFlush(suscripcion);

        int databaseSizeBeforeUpdate = suscripcionRepository.findAll().size();

        // Update the suscripcion using partial update
        Suscripcion partialUpdatedSuscripcion = new Suscripcion();
        partialUpdatedSuscripcion.setId(suscripcion.getId());

        partialUpdatedSuscripcion.fecha(UPDATED_FECHA).activa(UPDATED_ACTIVA);

        restSuscripcionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSuscripcion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSuscripcion))
            )
            .andExpect(status().isOk());

        // Validate the Suscripcion in the database
        List<Suscripcion> suscripcionList = suscripcionRepository.findAll();
        assertThat(suscripcionList).hasSize(databaseSizeBeforeUpdate);
        Suscripcion testSuscripcion = suscripcionList.get(suscripcionList.size() - 1);
        assertThat(testSuscripcion.getFecha()).isEqualTo(UPDATED_FECHA);
        assertThat(testSuscripcion.getActiva()).isEqualTo(UPDATED_ACTIVA);
    }

    @Test
    @Transactional
    void patchNonExistingSuscripcion() throws Exception {
        int databaseSizeBeforeUpdate = suscripcionRepository.findAll().size();
        suscripcion.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSuscripcionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, suscripcion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(suscripcion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Suscripcion in the database
        List<Suscripcion> suscripcionList = suscripcionRepository.findAll();
        assertThat(suscripcionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSuscripcion() throws Exception {
        int databaseSizeBeforeUpdate = suscripcionRepository.findAll().size();
        suscripcion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSuscripcionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(suscripcion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Suscripcion in the database
        List<Suscripcion> suscripcionList = suscripcionRepository.findAll();
        assertThat(suscripcionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSuscripcion() throws Exception {
        int databaseSizeBeforeUpdate = suscripcionRepository.findAll().size();
        suscripcion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSuscripcionMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(suscripcion))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Suscripcion in the database
        List<Suscripcion> suscripcionList = suscripcionRepository.findAll();
        assertThat(suscripcionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSuscripcion() throws Exception {
        // Initialize the database
        suscripcionRepository.saveAndFlush(suscripcion);

        int databaseSizeBeforeDelete = suscripcionRepository.findAll().size();

        // Delete the suscripcion
        restSuscripcionMockMvc
            .perform(delete(ENTITY_API_URL_ID, suscripcion.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Suscripcion> suscripcionList = suscripcionRepository.findAll();
        assertThat(suscripcionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
