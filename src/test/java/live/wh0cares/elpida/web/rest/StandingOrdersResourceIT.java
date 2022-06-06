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
import live.wh0cares.elpida.domain.StandingOrders;
import live.wh0cares.elpida.repository.StandingOrdersRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link StandingOrdersResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class StandingOrdersResourceIT {

    private static final Integer DEFAULT_I_D = 1;
    private static final Integer UPDATED_I_D = 2;

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Double DEFAULT_VALUE = 1D;
    private static final Double UPDATED_VALUE = 2D;

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final Integer DEFAULT_INTERVAL = 1;
    private static final Integer UPDATED_INTERVAL = 2;

    private static final String ENTITY_API_URL = "/api/standing-orders";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private StandingOrdersRepository standingOrdersRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restStandingOrdersMockMvc;

    private StandingOrders standingOrders;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static StandingOrders createEntity(EntityManager em) {
        StandingOrders standingOrders = new StandingOrders()
            .iD(DEFAULT_I_D)
            .name(DEFAULT_NAME)
            .value(DEFAULT_VALUE)
            .date(DEFAULT_DATE)
            .interval(DEFAULT_INTERVAL);
        return standingOrders;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static StandingOrders createUpdatedEntity(EntityManager em) {
        StandingOrders standingOrders = new StandingOrders()
            .iD(UPDATED_I_D)
            .name(UPDATED_NAME)
            .value(UPDATED_VALUE)
            .date(UPDATED_DATE)
            .interval(UPDATED_INTERVAL);
        return standingOrders;
    }

    @BeforeEach
    public void initTest() {
        standingOrders = createEntity(em);
    }

    @Test
    @Transactional
    void createStandingOrders() throws Exception {
        int databaseSizeBeforeCreate = standingOrdersRepository.findAll().size();
        // Create the StandingOrders
        restStandingOrdersMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(standingOrders))
            )
            .andExpect(status().isCreated());

        // Validate the StandingOrders in the database
        List<StandingOrders> standingOrdersList = standingOrdersRepository.findAll();
        assertThat(standingOrdersList).hasSize(databaseSizeBeforeCreate + 1);
        StandingOrders testStandingOrders = standingOrdersList.get(standingOrdersList.size() - 1);
        assertThat(testStandingOrders.getiD()).isEqualTo(DEFAULT_I_D);
        assertThat(testStandingOrders.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testStandingOrders.getValue()).isEqualTo(DEFAULT_VALUE);
        assertThat(testStandingOrders.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testStandingOrders.getInterval()).isEqualTo(DEFAULT_INTERVAL);
    }

    @Test
    @Transactional
    void createStandingOrdersWithExistingId() throws Exception {
        // Create the StandingOrders with an existing ID
        standingOrders.setId(1L);

        int databaseSizeBeforeCreate = standingOrdersRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restStandingOrdersMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(standingOrders))
            )
            .andExpect(status().isBadRequest());

        // Validate the StandingOrders in the database
        List<StandingOrders> standingOrdersList = standingOrdersRepository.findAll();
        assertThat(standingOrdersList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkiDIsRequired() throws Exception {
        int databaseSizeBeforeTest = standingOrdersRepository.findAll().size();
        // set the field null
        standingOrders.setiD(null);

        // Create the StandingOrders, which fails.

        restStandingOrdersMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(standingOrders))
            )
            .andExpect(status().isBadRequest());

        List<StandingOrders> standingOrdersList = standingOrdersRepository.findAll();
        assertThat(standingOrdersList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = standingOrdersRepository.findAll().size();
        // set the field null
        standingOrders.setName(null);

        // Create the StandingOrders, which fails.

        restStandingOrdersMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(standingOrders))
            )
            .andExpect(status().isBadRequest());

        List<StandingOrders> standingOrdersList = standingOrdersRepository.findAll();
        assertThat(standingOrdersList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkValueIsRequired() throws Exception {
        int databaseSizeBeforeTest = standingOrdersRepository.findAll().size();
        // set the field null
        standingOrders.setValue(null);

        // Create the StandingOrders, which fails.

        restStandingOrdersMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(standingOrders))
            )
            .andExpect(status().isBadRequest());

        List<StandingOrders> standingOrdersList = standingOrdersRepository.findAll();
        assertThat(standingOrdersList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = standingOrdersRepository.findAll().size();
        // set the field null
        standingOrders.setDate(null);

        // Create the StandingOrders, which fails.

        restStandingOrdersMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(standingOrders))
            )
            .andExpect(status().isBadRequest());

        List<StandingOrders> standingOrdersList = standingOrdersRepository.findAll();
        assertThat(standingOrdersList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkIntervalIsRequired() throws Exception {
        int databaseSizeBeforeTest = standingOrdersRepository.findAll().size();
        // set the field null
        standingOrders.setInterval(null);

        // Create the StandingOrders, which fails.

        restStandingOrdersMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(standingOrders))
            )
            .andExpect(status().isBadRequest());

        List<StandingOrders> standingOrdersList = standingOrdersRepository.findAll();
        assertThat(standingOrdersList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllStandingOrders() throws Exception {
        // Initialize the database
        standingOrdersRepository.saveAndFlush(standingOrders);

        // Get all the standingOrdersList
        restStandingOrdersMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(standingOrders.getId().intValue())))
            .andExpect(jsonPath("$.[*].iD").value(hasItem(DEFAULT_I_D)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].value").value(hasItem(DEFAULT_VALUE.doubleValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].interval").value(hasItem(DEFAULT_INTERVAL)));
    }

    @Test
    @Transactional
    void getStandingOrders() throws Exception {
        // Initialize the database
        standingOrdersRepository.saveAndFlush(standingOrders);

        // Get the standingOrders
        restStandingOrdersMockMvc
            .perform(get(ENTITY_API_URL_ID, standingOrders.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(standingOrders.getId().intValue()))
            .andExpect(jsonPath("$.iD").value(DEFAULT_I_D))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.value").value(DEFAULT_VALUE.doubleValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.interval").value(DEFAULT_INTERVAL));
    }

    @Test
    @Transactional
    void getNonExistingStandingOrders() throws Exception {
        // Get the standingOrders
        restStandingOrdersMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewStandingOrders() throws Exception {
        // Initialize the database
        standingOrdersRepository.saveAndFlush(standingOrders);

        int databaseSizeBeforeUpdate = standingOrdersRepository.findAll().size();

        // Update the standingOrders
        StandingOrders updatedStandingOrders = standingOrdersRepository.findById(standingOrders.getId()).get();
        // Disconnect from session so that the updates on updatedStandingOrders are not directly saved in db
        em.detach(updatedStandingOrders);
        updatedStandingOrders.iD(UPDATED_I_D).name(UPDATED_NAME).value(UPDATED_VALUE).date(UPDATED_DATE).interval(UPDATED_INTERVAL);

        restStandingOrdersMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedStandingOrders.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedStandingOrders))
            )
            .andExpect(status().isOk());

        // Validate the StandingOrders in the database
        List<StandingOrders> standingOrdersList = standingOrdersRepository.findAll();
        assertThat(standingOrdersList).hasSize(databaseSizeBeforeUpdate);
        StandingOrders testStandingOrders = standingOrdersList.get(standingOrdersList.size() - 1);
        assertThat(testStandingOrders.getiD()).isEqualTo(UPDATED_I_D);
        assertThat(testStandingOrders.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testStandingOrders.getValue()).isEqualTo(UPDATED_VALUE);
        assertThat(testStandingOrders.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testStandingOrders.getInterval()).isEqualTo(UPDATED_INTERVAL);
    }

    @Test
    @Transactional
    void putNonExistingStandingOrders() throws Exception {
        int databaseSizeBeforeUpdate = standingOrdersRepository.findAll().size();
        standingOrders.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStandingOrdersMockMvc
            .perform(
                put(ENTITY_API_URL_ID, standingOrders.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(standingOrders))
            )
            .andExpect(status().isBadRequest());

        // Validate the StandingOrders in the database
        List<StandingOrders> standingOrdersList = standingOrdersRepository.findAll();
        assertThat(standingOrdersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchStandingOrders() throws Exception {
        int databaseSizeBeforeUpdate = standingOrdersRepository.findAll().size();
        standingOrders.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStandingOrdersMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(standingOrders))
            )
            .andExpect(status().isBadRequest());

        // Validate the StandingOrders in the database
        List<StandingOrders> standingOrdersList = standingOrdersRepository.findAll();
        assertThat(standingOrdersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamStandingOrders() throws Exception {
        int databaseSizeBeforeUpdate = standingOrdersRepository.findAll().size();
        standingOrders.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStandingOrdersMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(standingOrders)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the StandingOrders in the database
        List<StandingOrders> standingOrdersList = standingOrdersRepository.findAll();
        assertThat(standingOrdersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateStandingOrdersWithPatch() throws Exception {
        // Initialize the database
        standingOrdersRepository.saveAndFlush(standingOrders);

        int databaseSizeBeforeUpdate = standingOrdersRepository.findAll().size();

        // Update the standingOrders using partial update
        StandingOrders partialUpdatedStandingOrders = new StandingOrders();
        partialUpdatedStandingOrders.setId(standingOrders.getId());

        partialUpdatedStandingOrders.value(UPDATED_VALUE);

        restStandingOrdersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStandingOrders.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStandingOrders))
            )
            .andExpect(status().isOk());

        // Validate the StandingOrders in the database
        List<StandingOrders> standingOrdersList = standingOrdersRepository.findAll();
        assertThat(standingOrdersList).hasSize(databaseSizeBeforeUpdate);
        StandingOrders testStandingOrders = standingOrdersList.get(standingOrdersList.size() - 1);
        assertThat(testStandingOrders.getiD()).isEqualTo(DEFAULT_I_D);
        assertThat(testStandingOrders.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testStandingOrders.getValue()).isEqualTo(UPDATED_VALUE);
        assertThat(testStandingOrders.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testStandingOrders.getInterval()).isEqualTo(DEFAULT_INTERVAL);
    }

    @Test
    @Transactional
    void fullUpdateStandingOrdersWithPatch() throws Exception {
        // Initialize the database
        standingOrdersRepository.saveAndFlush(standingOrders);

        int databaseSizeBeforeUpdate = standingOrdersRepository.findAll().size();

        // Update the standingOrders using partial update
        StandingOrders partialUpdatedStandingOrders = new StandingOrders();
        partialUpdatedStandingOrders.setId(standingOrders.getId());

        partialUpdatedStandingOrders.iD(UPDATED_I_D).name(UPDATED_NAME).value(UPDATED_VALUE).date(UPDATED_DATE).interval(UPDATED_INTERVAL);

        restStandingOrdersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStandingOrders.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStandingOrders))
            )
            .andExpect(status().isOk());

        // Validate the StandingOrders in the database
        List<StandingOrders> standingOrdersList = standingOrdersRepository.findAll();
        assertThat(standingOrdersList).hasSize(databaseSizeBeforeUpdate);
        StandingOrders testStandingOrders = standingOrdersList.get(standingOrdersList.size() - 1);
        assertThat(testStandingOrders.getiD()).isEqualTo(UPDATED_I_D);
        assertThat(testStandingOrders.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testStandingOrders.getValue()).isEqualTo(UPDATED_VALUE);
        assertThat(testStandingOrders.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testStandingOrders.getInterval()).isEqualTo(UPDATED_INTERVAL);
    }

    @Test
    @Transactional
    void patchNonExistingStandingOrders() throws Exception {
        int databaseSizeBeforeUpdate = standingOrdersRepository.findAll().size();
        standingOrders.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStandingOrdersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, standingOrders.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(standingOrders))
            )
            .andExpect(status().isBadRequest());

        // Validate the StandingOrders in the database
        List<StandingOrders> standingOrdersList = standingOrdersRepository.findAll();
        assertThat(standingOrdersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchStandingOrders() throws Exception {
        int databaseSizeBeforeUpdate = standingOrdersRepository.findAll().size();
        standingOrders.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStandingOrdersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(standingOrders))
            )
            .andExpect(status().isBadRequest());

        // Validate the StandingOrders in the database
        List<StandingOrders> standingOrdersList = standingOrdersRepository.findAll();
        assertThat(standingOrdersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamStandingOrders() throws Exception {
        int databaseSizeBeforeUpdate = standingOrdersRepository.findAll().size();
        standingOrders.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStandingOrdersMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(standingOrders))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the StandingOrders in the database
        List<StandingOrders> standingOrdersList = standingOrdersRepository.findAll();
        assertThat(standingOrdersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteStandingOrders() throws Exception {
        // Initialize the database
        standingOrdersRepository.saveAndFlush(standingOrders);

        int databaseSizeBeforeDelete = standingOrdersRepository.findAll().size();

        // Delete the standingOrders
        restStandingOrdersMockMvc
            .perform(delete(ENTITY_API_URL_ID, standingOrders.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<StandingOrders> standingOrdersList = standingOrdersRepository.findAll();
        assertThat(standingOrdersList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
