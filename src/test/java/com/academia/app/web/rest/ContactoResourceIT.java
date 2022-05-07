package com.academia.app.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.academia.app.IntegrationTest;
import com.academia.app.domain.Contacto;
import com.academia.app.repository.ContactoRepository;
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
 * Integration tests for the {@link ContactoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ContactoResourceIT {

    private static final String DEFAULT_NOMBRE = "AAAAAAAAAA";
    private static final String UPDATED_NOMBRE = "BBBBBBBBBB";

    private static final String DEFAULT_TELEFONO = "AAAAAAAAAA";
    private static final String UPDATED_TELEFONO = "BBBBBBBBBB";

    private static final String DEFAULT_CORREO = "AAAAAAAAAA";
    private static final String UPDATED_CORREO = "BBBBBBBBBB";

    private static final String DEFAULT_DNI = "AAAAAAAAAA";
    private static final String UPDATED_DNI = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/contactos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ContactoRepository contactoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restContactoMockMvc;

    private Contacto contacto;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Contacto createEntity(EntityManager em) {
        Contacto contacto = new Contacto().nombre(DEFAULT_NOMBRE).telefono(DEFAULT_TELEFONO).correo(DEFAULT_CORREO).dni(DEFAULT_DNI);
        return contacto;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Contacto createUpdatedEntity(EntityManager em) {
        Contacto contacto = new Contacto().nombre(UPDATED_NOMBRE).telefono(UPDATED_TELEFONO).correo(UPDATED_CORREO).dni(UPDATED_DNI);
        return contacto;
    }

    @BeforeEach
    public void initTest() {
        contacto = createEntity(em);
    }

    @Test
    @Transactional
    void createContacto() throws Exception {
        int databaseSizeBeforeCreate = contactoRepository.findAll().size();
        // Create the Contacto
        restContactoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(contacto)))
            .andExpect(status().isCreated());

        // Validate the Contacto in the database
        List<Contacto> contactoList = contactoRepository.findAll();
        assertThat(contactoList).hasSize(databaseSizeBeforeCreate + 1);
        Contacto testContacto = contactoList.get(contactoList.size() - 1);
        assertThat(testContacto.getNombre()).isEqualTo(DEFAULT_NOMBRE);
        assertThat(testContacto.getTelefono()).isEqualTo(DEFAULT_TELEFONO);
        assertThat(testContacto.getCorreo()).isEqualTo(DEFAULT_CORREO);
        assertThat(testContacto.getDni()).isEqualTo(DEFAULT_DNI);
    }

    @Test
    @Transactional
    void createContactoWithExistingId() throws Exception {
        // Create the Contacto with an existing ID
        contacto.setId(1L);

        int databaseSizeBeforeCreate = contactoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restContactoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(contacto)))
            .andExpect(status().isBadRequest());

        // Validate the Contacto in the database
        List<Contacto> contactoList = contactoRepository.findAll();
        assertThat(contactoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNombreIsRequired() throws Exception {
        int databaseSizeBeforeTest = contactoRepository.findAll().size();
        // set the field null
        contacto.setNombre(null);

        // Create the Contacto, which fails.

        restContactoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(contacto)))
            .andExpect(status().isBadRequest());

        List<Contacto> contactoList = contactoRepository.findAll();
        assertThat(contactoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDniIsRequired() throws Exception {
        int databaseSizeBeforeTest = contactoRepository.findAll().size();
        // set the field null
        contacto.setDni(null);

        // Create the Contacto, which fails.

        restContactoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(contacto)))
            .andExpect(status().isBadRequest());

        List<Contacto> contactoList = contactoRepository.findAll();
        assertThat(contactoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllContactos() throws Exception {
        // Initialize the database
        contactoRepository.saveAndFlush(contacto);

        // Get all the contactoList
        restContactoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(contacto.getId().intValue())))
            .andExpect(jsonPath("$.[*].nombre").value(hasItem(DEFAULT_NOMBRE)))
            .andExpect(jsonPath("$.[*].telefono").value(hasItem(DEFAULT_TELEFONO)))
            .andExpect(jsonPath("$.[*].correo").value(hasItem(DEFAULT_CORREO)))
            .andExpect(jsonPath("$.[*].dni").value(hasItem(DEFAULT_DNI)));
    }

    @Test
    @Transactional
    void getContacto() throws Exception {
        // Initialize the database
        contactoRepository.saveAndFlush(contacto);

        // Get the contacto
        restContactoMockMvc
            .perform(get(ENTITY_API_URL_ID, contacto.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(contacto.getId().intValue()))
            .andExpect(jsonPath("$.nombre").value(DEFAULT_NOMBRE))
            .andExpect(jsonPath("$.telefono").value(DEFAULT_TELEFONO))
            .andExpect(jsonPath("$.correo").value(DEFAULT_CORREO))
            .andExpect(jsonPath("$.dni").value(DEFAULT_DNI));
    }

    @Test
    @Transactional
    void getNonExistingContacto() throws Exception {
        // Get the contacto
        restContactoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewContacto() throws Exception {
        // Initialize the database
        contactoRepository.saveAndFlush(contacto);

        int databaseSizeBeforeUpdate = contactoRepository.findAll().size();

        // Update the contacto
        Contacto updatedContacto = contactoRepository.findById(contacto.getId()).get();
        // Disconnect from session so that the updates on updatedContacto are not directly saved in db
        em.detach(updatedContacto);
        updatedContacto.nombre(UPDATED_NOMBRE).telefono(UPDATED_TELEFONO).correo(UPDATED_CORREO).dni(UPDATED_DNI);

        restContactoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedContacto.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedContacto))
            )
            .andExpect(status().isOk());

        // Validate the Contacto in the database
        List<Contacto> contactoList = contactoRepository.findAll();
        assertThat(contactoList).hasSize(databaseSizeBeforeUpdate);
        Contacto testContacto = contactoList.get(contactoList.size() - 1);
        assertThat(testContacto.getNombre()).isEqualTo(UPDATED_NOMBRE);
        assertThat(testContacto.getTelefono()).isEqualTo(UPDATED_TELEFONO);
        assertThat(testContacto.getCorreo()).isEqualTo(UPDATED_CORREO);
        assertThat(testContacto.getDni()).isEqualTo(UPDATED_DNI);
    }

    @Test
    @Transactional
    void putNonExistingContacto() throws Exception {
        int databaseSizeBeforeUpdate = contactoRepository.findAll().size();
        contacto.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restContactoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, contacto.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(contacto))
            )
            .andExpect(status().isBadRequest());

        // Validate the Contacto in the database
        List<Contacto> contactoList = contactoRepository.findAll();
        assertThat(contactoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchContacto() throws Exception {
        int databaseSizeBeforeUpdate = contactoRepository.findAll().size();
        contacto.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restContactoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(contacto))
            )
            .andExpect(status().isBadRequest());

        // Validate the Contacto in the database
        List<Contacto> contactoList = contactoRepository.findAll();
        assertThat(contactoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamContacto() throws Exception {
        int databaseSizeBeforeUpdate = contactoRepository.findAll().size();
        contacto.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restContactoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(contacto)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Contacto in the database
        List<Contacto> contactoList = contactoRepository.findAll();
        assertThat(contactoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateContactoWithPatch() throws Exception {
        // Initialize the database
        contactoRepository.saveAndFlush(contacto);

        int databaseSizeBeforeUpdate = contactoRepository.findAll().size();

        // Update the contacto using partial update
        Contacto partialUpdatedContacto = new Contacto();
        partialUpdatedContacto.setId(contacto.getId());

        partialUpdatedContacto.nombre(UPDATED_NOMBRE);

        restContactoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedContacto.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedContacto))
            )
            .andExpect(status().isOk());

        // Validate the Contacto in the database
        List<Contacto> contactoList = contactoRepository.findAll();
        assertThat(contactoList).hasSize(databaseSizeBeforeUpdate);
        Contacto testContacto = contactoList.get(contactoList.size() - 1);
        assertThat(testContacto.getNombre()).isEqualTo(UPDATED_NOMBRE);
        assertThat(testContacto.getTelefono()).isEqualTo(DEFAULT_TELEFONO);
        assertThat(testContacto.getCorreo()).isEqualTo(DEFAULT_CORREO);
        assertThat(testContacto.getDni()).isEqualTo(DEFAULT_DNI);
    }

    @Test
    @Transactional
    void fullUpdateContactoWithPatch() throws Exception {
        // Initialize the database
        contactoRepository.saveAndFlush(contacto);

        int databaseSizeBeforeUpdate = contactoRepository.findAll().size();

        // Update the contacto using partial update
        Contacto partialUpdatedContacto = new Contacto();
        partialUpdatedContacto.setId(contacto.getId());

        partialUpdatedContacto.nombre(UPDATED_NOMBRE).telefono(UPDATED_TELEFONO).correo(UPDATED_CORREO).dni(UPDATED_DNI);

        restContactoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedContacto.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedContacto))
            )
            .andExpect(status().isOk());

        // Validate the Contacto in the database
        List<Contacto> contactoList = contactoRepository.findAll();
        assertThat(contactoList).hasSize(databaseSizeBeforeUpdate);
        Contacto testContacto = contactoList.get(contactoList.size() - 1);
        assertThat(testContacto.getNombre()).isEqualTo(UPDATED_NOMBRE);
        assertThat(testContacto.getTelefono()).isEqualTo(UPDATED_TELEFONO);
        assertThat(testContacto.getCorreo()).isEqualTo(UPDATED_CORREO);
        assertThat(testContacto.getDni()).isEqualTo(UPDATED_DNI);
    }

    @Test
    @Transactional
    void patchNonExistingContacto() throws Exception {
        int databaseSizeBeforeUpdate = contactoRepository.findAll().size();
        contacto.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restContactoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, contacto.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(contacto))
            )
            .andExpect(status().isBadRequest());

        // Validate the Contacto in the database
        List<Contacto> contactoList = contactoRepository.findAll();
        assertThat(contactoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchContacto() throws Exception {
        int databaseSizeBeforeUpdate = contactoRepository.findAll().size();
        contacto.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restContactoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(contacto))
            )
            .andExpect(status().isBadRequest());

        // Validate the Contacto in the database
        List<Contacto> contactoList = contactoRepository.findAll();
        assertThat(contactoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamContacto() throws Exception {
        int databaseSizeBeforeUpdate = contactoRepository.findAll().size();
        contacto.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restContactoMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(contacto)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Contacto in the database
        List<Contacto> contactoList = contactoRepository.findAll();
        assertThat(contactoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteContacto() throws Exception {
        // Initialize the database
        contactoRepository.saveAndFlush(contacto);

        int databaseSizeBeforeDelete = contactoRepository.findAll().size();

        // Delete the contacto
        restContactoMockMvc
            .perform(delete(ENTITY_API_URL_ID, contacto.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Contacto> contactoList = contactoRepository.findAll();
        assertThat(contactoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
