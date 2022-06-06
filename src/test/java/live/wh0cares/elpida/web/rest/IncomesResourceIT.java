package live.wh0cares.elpida.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import live.wh0cares.elpida.IntegrationTest;
import live.wh0cares.elpida.domain.Incomes;
import live.wh0cares.elpida.repository.IncomesRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link IncomesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class IncomesResourceIT {

    private static final Integer DEFAULT_I_D = 1;
    private static final Integer UPDATED_I_D = 2;

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Double DEFAULT_VALUE = 1D;
    private static final Double UPDATED_VALUE = 2D;

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/incomes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private IncomesRepository incomesRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restIncomesMockMvc;

    private Incomes incomes;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Incomes createEntity(EntityManager em) {
        Incomes incomes = new Incomes().iD(DEFAULT_I_D).name(DEFAULT_NAME).value(DEFAULT_VALUE).date(DEFAULT_DATE);
        return incomes;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Incomes createUpdatedEntity(EntityManager em) {
        Incomes incomes = new Incomes().iD(UPDATED_I_D).name(UPDATED_NAME).value(UPDATED_VALUE).date(UPDATED_DATE);
        return incomes;
    }

    @BeforeEach
    public void initTest() {
        incomes = createEntity(em);
    }

    @Test
    @Transactional
    void createIncomes() throws Exception {
        int databaseSizeBeforeCreate = incomesRepository.findAll().size();
        // Create the Incomes
        restIncomesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(incomes)))
            .andExpect(status().isCreated());

        // Validate the Incomes in the database
        List<Incomes> incomesList = incomesRepository.findAll();
        assertThat(incomesList).hasSize(databaseSizeBeforeCreate + 1);
        Incomes testIncomes = incomesList.get(incomesList.size() - 1);
        assertThat(testIncomes.getiD()).isEqualTo(DEFAULT_I_D);
        assertThat(testIncomes.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testIncomes.getValue()).isEqualTo(DEFAULT_VALUE);
        assertThat(testIncomes.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void createIncomesWithExistingId() throws Exception {
        // Create the Incomes with an existing ID
        incomes.setId(1L);

        int databaseSizeBeforeCreate = incomesRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restIncomesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(incomes)))
            .andExpect(status().isBadRequest());

        // Validate the Incomes in the database
        List<Incomes> incomesList = incomesRepository.findAll();
        assertThat(incomesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkiDIsRequired() throws Exception {
        int databaseSizeBeforeTest = incomesRepository.findAll().size();
        // set the field null
        incomes.setiD(null);

        // Create the Incomes, which fails.

        restIncomesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(incomes)))
            .andExpect(status().isBadRequest());

        List<Incomes> incomesList = incomesRepository.findAll();
        assertThat(incomesList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = incomesRepository.findAll().size();
        // set the field null
        incomes.setName(null);

        // Create the Incomes, which fails.

        restIncomesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(incomes)))
            .andExpect(status().isBadRequest());

        List<Incomes> incomesList = incomesRepository.findAll();
        assertThat(incomesList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkValueIsRequired() throws Exception {
        int databaseSizeBeforeTest = incomesRepository.findAll().size();
        // set the field null
        incomes.setValue(null);

        // Create the Incomes, which fails.

        restIncomesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(incomes)))
            .andExpect(status().isBadRequest());

        List<Incomes> incomesList = incomesRepository.findAll();
        assertThat(incomesList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = incomesRepository.findAll().size();
        // set the field null
        incomes.setDate(null);

        // Create the Incomes, which fails.

        restIncomesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(incomes)))
            .andExpect(status().isBadRequest());

        List<Incomes> incomesList = incomesRepository.findAll();
        assertThat(incomesList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllIncomes() throws Exception {
        // Initialize the database
        incomesRepository.saveAndFlush(incomes);

        // Get all the incomesList
        restIncomesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(incomes.getId().intValue())))
            .andExpect(jsonPath("$.[*].iD").value(hasItem(DEFAULT_I_D)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].value").value(hasItem(DEFAULT_VALUE.doubleValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())));
    }

    @Test
    @Transactional
    void getIncomes() throws Exception {
        // Initialize the database
        incomesRepository.saveAndFlush(incomes);

        // Get the incomes
        restIncomesMockMvc
            .perform(get(ENTITY_API_URL_ID, incomes.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(incomes.getId().intValue()))
            .andExpect(jsonPath("$.iD").value(DEFAULT_I_D))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.value").value(DEFAULT_VALUE.doubleValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingIncomes() throws Exception {
        // Get the incomes
        restIncomesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewIncomes() throws Exception {
        // Initialize the database
        incomesRepository.saveAndFlush(incomes);

        int databaseSizeBeforeUpdate = incomesRepository.findAll().size();

        // Update the incomes
        Incomes updatedIncomes = incomesRepository.findById(incomes.getId()).get();
        // Disconnect from session so that the updates on updatedIncomes are not directly saved in db
        em.detach(updatedIncomes);
        updatedIncomes.iD(UPDATED_I_D).name(UPDATED_NAME).value(UPDATED_VALUE).date(UPDATED_DATE);

        restIncomesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedIncomes.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedIncomes))
            )
            .andExpect(status().isOk());

        // Validate the Incomes in the database
        List<Incomes> incomesList = incomesRepository.findAll();
        assertThat(incomesList).hasSize(databaseSizeBeforeUpdate);
        Incomes testIncomes = incomesList.get(incomesList.size() - 1);
        assertThat(testIncomes.getiD()).isEqualTo(UPDATED_I_D);
        assertThat(testIncomes.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testIncomes.getValue()).isEqualTo(UPDATED_VALUE);
        assertThat(testIncomes.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingIncomes() throws Exception {
        int databaseSizeBeforeUpdate = incomesRepository.findAll().size();
        incomes.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restIncomesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, incomes.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(incomes))
            )
            .andExpect(status().isBadRequest());

        // Validate the Incomes in the database
        List<Incomes> incomesList = incomesRepository.findAll();
        assertThat(incomesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchIncomes() throws Exception {
        int databaseSizeBeforeUpdate = incomesRepository.findAll().size();
        incomes.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIncomesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(incomes))
            )
            .andExpect(status().isBadRequest());

        // Validate the Incomes in the database
        List<Incomes> incomesList = incomesRepository.findAll();
        assertThat(incomesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamIncomes() throws Exception {
        int databaseSizeBeforeUpdate = incomesRepository.findAll().size();
        incomes.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIncomesMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(incomes)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Incomes in the database
        List<Incomes> incomesList = incomesRepository.findAll();
        assertThat(incomesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateIncomesWithPatch() throws Exception {
        // Initialize the database
        incomesRepository.saveAndFlush(incomes);

        int databaseSizeBeforeUpdate = incomesRepository.findAll().size();

        // Update the incomes using partial update
        Incomes partialUpdatedIncomes = new Incomes();
        partialUpdatedIncomes.setId(incomes.getId());

        partialUpdatedIncomes.iD(UPDATED_I_D).value(UPDATED_VALUE);

        restIncomesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedIncomes.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedIncomes))
            )
            .andExpect(status().isOk());

        // Validate the Incomes in the database
        List<Incomes> incomesList = incomesRepository.findAll();
        assertThat(incomesList).hasSize(databaseSizeBeforeUpdate);
        Incomes testIncomes = incomesList.get(incomesList.size() - 1);
        assertThat(testIncomes.getiD()).isEqualTo(UPDATED_I_D);
        assertThat(testIncomes.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testIncomes.getValue()).isEqualTo(UPDATED_VALUE);
        assertThat(testIncomes.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void fullUpdateIncomesWithPatch() throws Exception {
        // Initialize the database
        incomesRepository.saveAndFlush(incomes);

        int databaseSizeBeforeUpdate = incomesRepository.findAll().size();

        // Update the incomes using partial update
        Incomes partialUpdatedIncomes = new Incomes();
        partialUpdatedIncomes.setId(incomes.getId());

        partialUpdatedIncomes.iD(UPDATED_I_D).name(UPDATED_NAME).value(UPDATED_VALUE).date(UPDATED_DATE);

        restIncomesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedIncomes.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedIncomes))
            )
            .andExpect(status().isOk());

        // Validate the Incomes in the database
        List<Incomes> incomesList = incomesRepository.findAll();
        assertThat(incomesList).hasSize(databaseSizeBeforeUpdate);
        Incomes testIncomes = incomesList.get(incomesList.size() - 1);
        assertThat(testIncomes.getiD()).isEqualTo(UPDATED_I_D);
        assertThat(testIncomes.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testIncomes.getValue()).isEqualTo(UPDATED_VALUE);
        assertThat(testIncomes.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingIncomes() throws Exception {
        int databaseSizeBeforeUpdate = incomesRepository.findAll().size();
        incomes.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restIncomesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, incomes.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(incomes))
            )
            .andExpect(status().isBadRequest());

        // Validate the Incomes in the database
        List<Incomes> incomesList = incomesRepository.findAll();
        assertThat(incomesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchIncomes() throws Exception {
        int databaseSizeBeforeUpdate = incomesRepository.findAll().size();
        incomes.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIncomesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(incomes))
            )
            .andExpect(status().isBadRequest());

        // Validate the Incomes in the database
        List<Incomes> incomesList = incomesRepository.findAll();
        assertThat(incomesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamIncomes() throws Exception {
        int databaseSizeBeforeUpdate = incomesRepository.findAll().size();
        incomes.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIncomesMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(incomes)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Incomes in the database
        List<Incomes> incomesList = incomesRepository.findAll();
        assertThat(incomesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteIncomes() throws Exception {
        // Initialize the database
        incomesRepository.saveAndFlush(incomes);

        int databaseSizeBeforeDelete = incomesRepository.findAll().size();

        // Delete the incomes
        restIncomesMockMvc
            .perform(delete(ENTITY_API_URL_ID, incomes.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Incomes> incomesList = incomesRepository.findAll();
        assertThat(incomesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
