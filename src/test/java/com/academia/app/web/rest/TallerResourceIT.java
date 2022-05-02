package com.academia.app.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.academia.app.IntegrationTest;
import com.academia.app.domain.Taller;
import com.academia.app.repository.TallerRepository;
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
 * Integration tests for the {@link TallerResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TallerResourceIT {

    private static final String DEFAULT_NOMBRE = "AAAAAAAAAA";
    private static final String UPDATED_NOMBRE = "BBBBBBBBBB";

    private static final Double DEFAULT_PRECIO = 1D;
    private static final Double UPDATED_PRECIO = 2D;

    private static final String DEFAULT_DESCRIPCION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPCION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/tallers";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TallerRepository tallerRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTallerMockMvc;

    private Taller taller;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Taller createEntity(EntityManager em) {
        Taller taller = new Taller().nombre(DEFAULT_NOMBRE).precio(DEFAULT_PRECIO).descripcion(DEFAULT_DESCRIPCION);
        return taller;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Taller createUpdatedEntity(EntityManager em) {
        Taller taller = new Taller().nombre(UPDATED_NOMBRE).precio(UPDATED_PRECIO).descripcion(UPDATED_DESCRIPCION);
        return taller;
    }

    @BeforeEach
    public void initTest() {
        taller = createEntity(em);
    }

    @Test
    @Transactional
    void createTaller() throws Exception {
        int databaseSizeBeforeCreate = tallerRepository.findAll().size();
        // Create the Taller
        restTallerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(taller)))
            .andExpect(status().isCreated());

        // Validate the Taller in the database
        List<Taller> tallerList = tallerRepository.findAll();
        assertThat(tallerList).hasSize(databaseSizeBeforeCreate + 1);
        Taller testTaller = tallerList.get(tallerList.size() - 1);
        assertThat(testTaller.getNombre()).isEqualTo(DEFAULT_NOMBRE);
        assertThat(testTaller.getPrecio()).isEqualTo(DEFAULT_PRECIO);
        assertThat(testTaller.getDescripcion()).isEqualTo(DEFAULT_DESCRIPCION);
    }

    @Test
    @Transactional
    void createTallerWithExistingId() throws Exception {
        // Create the Taller with an existing ID
        taller.setId(1L);

        int databaseSizeBeforeCreate = tallerRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTallerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(taller)))
            .andExpect(status().isBadRequest());

        // Validate the Taller in the database
        List<Taller> tallerList = tallerRepository.findAll();
        assertThat(tallerList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNombreIsRequired() throws Exception {
        int databaseSizeBeforeTest = tallerRepository.findAll().size();
        // set the field null
        taller.setNombre(null);

        // Create the Taller, which fails.

        restTallerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(taller)))
            .andExpect(status().isBadRequest());

        List<Taller> tallerList = tallerRepository.findAll();
        assertThat(tallerList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPrecioIsRequired() throws Exception {
        int databaseSizeBeforeTest = tallerRepository.findAll().size();
        // set the field null
        taller.setPrecio(null);

        // Create the Taller, which fails.

        restTallerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(taller)))
            .andExpect(status().isBadRequest());

        List<Taller> tallerList = tallerRepository.findAll();
        assertThat(tallerList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllTallers() throws Exception {
        // Initialize the database
        tallerRepository.saveAndFlush(taller);

        // Get all the tallerList
        restTallerMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(taller.getId().intValue())))
            .andExpect(jsonPath("$.[*].nombre").value(hasItem(DEFAULT_NOMBRE)))
            .andExpect(jsonPath("$.[*].precio").value(hasItem(DEFAULT_PRECIO.doubleValue())))
            .andExpect(jsonPath("$.[*].descripcion").value(hasItem(DEFAULT_DESCRIPCION)));
    }

    @Test
    @Transactional
    void getTaller() throws Exception {
        // Initialize the database
        tallerRepository.saveAndFlush(taller);

        // Get the taller
        restTallerMockMvc
            .perform(get(ENTITY_API_URL_ID, taller.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(taller.getId().intValue()))
            .andExpect(jsonPath("$.nombre").value(DEFAULT_NOMBRE))
            .andExpect(jsonPath("$.precio").value(DEFAULT_PRECIO.doubleValue()))
            .andExpect(jsonPath("$.descripcion").value(DEFAULT_DESCRIPCION));
    }

    @Test
    @Transactional
    void getNonExistingTaller() throws Exception {
        // Get the taller
        restTallerMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewTaller() throws Exception {
        // Initialize the database
        tallerRepository.saveAndFlush(taller);

        int databaseSizeBeforeUpdate = tallerRepository.findAll().size();

        // Update the taller
        Taller updatedTaller = tallerRepository.findById(taller.getId()).get();
        // Disconnect from session so that the updates on updatedTaller are not directly saved in db
        em.detach(updatedTaller);
        updatedTaller.nombre(UPDATED_NOMBRE).precio(UPDATED_PRECIO).descripcion(UPDATED_DESCRIPCION);

        restTallerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTaller.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTaller))
            )
            .andExpect(status().isOk());

        // Validate the Taller in the database
        List<Taller> tallerList = tallerRepository.findAll();
        assertThat(tallerList).hasSize(databaseSizeBeforeUpdate);
        Taller testTaller = tallerList.get(tallerList.size() - 1);
        assertThat(testTaller.getNombre()).isEqualTo(UPDATED_NOMBRE);
        assertThat(testTaller.getPrecio()).isEqualTo(UPDATED_PRECIO);
        assertThat(testTaller.getDescripcion()).isEqualTo(UPDATED_DESCRIPCION);
    }

    @Test
    @Transactional
    void putNonExistingTaller() throws Exception {
        int databaseSizeBeforeUpdate = tallerRepository.findAll().size();
        taller.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTallerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, taller.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(taller))
            )
            .andExpect(status().isBadRequest());

        // Validate the Taller in the database
        List<Taller> tallerList = tallerRepository.findAll();
        assertThat(tallerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTaller() throws Exception {
        int databaseSizeBeforeUpdate = tallerRepository.findAll().size();
        taller.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTallerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(taller))
            )
            .andExpect(status().isBadRequest());

        // Validate the Taller in the database
        List<Taller> tallerList = tallerRepository.findAll();
        assertThat(tallerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTaller() throws Exception {
        int databaseSizeBeforeUpdate = tallerRepository.findAll().size();
        taller.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTallerMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(taller)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Taller in the database
        List<Taller> tallerList = tallerRepository.findAll();
        assertThat(tallerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTallerWithPatch() throws Exception {
        // Initialize the database
        tallerRepository.saveAndFlush(taller);

        int databaseSizeBeforeUpdate = tallerRepository.findAll().size();

        // Update the taller using partial update
        Taller partialUpdatedTaller = new Taller();
        partialUpdatedTaller.setId(taller.getId());

        partialUpdatedTaller.nombre(UPDATED_NOMBRE);

        restTallerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTaller.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTaller))
            )
            .andExpect(status().isOk());

        // Validate the Taller in the database
        List<Taller> tallerList = tallerRepository.findAll();
        assertThat(tallerList).hasSize(databaseSizeBeforeUpdate);
        Taller testTaller = tallerList.get(tallerList.size() - 1);
        assertThat(testTaller.getNombre()).isEqualTo(UPDATED_NOMBRE);
        assertThat(testTaller.getPrecio()).isEqualTo(DEFAULT_PRECIO);
        assertThat(testTaller.getDescripcion()).isEqualTo(DEFAULT_DESCRIPCION);
    }

    @Test
    @Transactional
    void fullUpdateTallerWithPatch() throws Exception {
        // Initialize the database
        tallerRepository.saveAndFlush(taller);

        int databaseSizeBeforeUpdate = tallerRepository.findAll().size();

        // Update the taller using partial update
        Taller partialUpdatedTaller = new Taller();
        partialUpdatedTaller.setId(taller.getId());

        partialUpdatedTaller.nombre(UPDATED_NOMBRE).precio(UPDATED_PRECIO).descripcion(UPDATED_DESCRIPCION);

        restTallerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTaller.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTaller))
            )
            .andExpect(status().isOk());

        // Validate the Taller in the database
        List<Taller> tallerList = tallerRepository.findAll();
        assertThat(tallerList).hasSize(databaseSizeBeforeUpdate);
        Taller testTaller = tallerList.get(tallerList.size() - 1);
        assertThat(testTaller.getNombre()).isEqualTo(UPDATED_NOMBRE);
        assertThat(testTaller.getPrecio()).isEqualTo(UPDATED_PRECIO);
        assertThat(testTaller.getDescripcion()).isEqualTo(UPDATED_DESCRIPCION);
    }

    @Test
    @Transactional
    void patchNonExistingTaller() throws Exception {
        int databaseSizeBeforeUpdate = tallerRepository.findAll().size();
        taller.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTallerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, taller.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(taller))
            )
            .andExpect(status().isBadRequest());

        // Validate the Taller in the database
        List<Taller> tallerList = tallerRepository.findAll();
        assertThat(tallerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTaller() throws Exception {
        int databaseSizeBeforeUpdate = tallerRepository.findAll().size();
        taller.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTallerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(taller))
            )
            .andExpect(status().isBadRequest());

        // Validate the Taller in the database
        List<Taller> tallerList = tallerRepository.findAll();
        assertThat(tallerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTaller() throws Exception {
        int databaseSizeBeforeUpdate = tallerRepository.findAll().size();
        taller.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTallerMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(taller)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Taller in the database
        List<Taller> tallerList = tallerRepository.findAll();
        assertThat(tallerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTaller() throws Exception {
        // Initialize the database
        tallerRepository.saveAndFlush(taller);

        int databaseSizeBeforeDelete = tallerRepository.findAll().size();

        // Delete the taller
        restTallerMockMvc
            .perform(delete(ENTITY_API_URL_ID, taller.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Taller> tallerList = tallerRepository.findAll();
        assertThat(tallerList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
