package live.wh0cares.elpida.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import live.wh0cares.elpida.domain.Expenses;
import live.wh0cares.elpida.repository.ExpensesRepository;
import live.wh0cares.elpida.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link live.wh0cares.elpida.domain.Expenses}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ExpensesResource {

    private final Logger log = LoggerFactory.getLogger(ExpensesResource.class);

    private static final String ENTITY_NAME = "expenses";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ExpensesRepository expensesRepository;

    public ExpensesResource(ExpensesRepository expensesRepository) {
        this.expensesRepository = expensesRepository;
    }

    /**
     * {@code POST  /expenses} : Create a new expenses.
     *
     * @param expenses the expenses to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new expenses, or with status {@code 400 (Bad Request)} if the expenses has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/expenses")
    public ResponseEntity<Expenses> createExpenses(@Valid @RequestBody Expenses expenses) throws URISyntaxException {
        log.debug("REST request to save Expenses : {}", expenses);
        if (expenses.getId() != null) {
            throw new BadRequestAlertException("A new expenses cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Expenses result = expensesRepository.save(expenses);
        return ResponseEntity
            .created(new URI("/api/expenses/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /expenses/:id} : Updates an existing expenses.
     *
     * @param id the id of the expenses to save.
     * @param expenses the expenses to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated expenses,
     * or with status {@code 400 (Bad Request)} if the expenses is not valid,
     * or with status {@code 500 (Internal Server Error)} if the expenses couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/expenses/{id}")
    public ResponseEntity<Expenses> updateExpenses(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Expenses expenses
    ) throws URISyntaxException {
        log.debug("REST request to update Expenses : {}, {}", id, expenses);
        if (expenses.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, expenses.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!expensesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Expenses result = expensesRepository.save(expenses);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, expenses.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /expenses/:id} : Partial updates given fields of an existing expenses, field will ignore if it is null
     *
     * @param id the id of the expenses to save.
     * @param expenses the expenses to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated expenses,
     * or with status {@code 400 (Bad Request)} if the expenses is not valid,
     * or with status {@code 404 (Not Found)} if the expenses is not found,
     * or with status {@code 500 (Internal Server Error)} if the expenses couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/expenses/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Expenses> partialUpdateExpenses(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Expenses expenses
    ) throws URISyntaxException {
        log.debug("REST request to partial update Expenses partially : {}, {}", id, expenses);
        if (expenses.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, expenses.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!expensesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Expenses> result = expensesRepository
            .findById(expenses.getId())
            .map(existingExpenses -> {
                if (expenses.getiD() != null) {
                    existingExpenses.setiD(expenses.getiD());
                }
                if (expenses.getName() != null) {
                    existingExpenses.setName(expenses.getName());
                }
                if (expenses.getValue() != null) {
                    existingExpenses.setValue(expenses.getValue());
                }
                if (expenses.getDate() != null) {
                    existingExpenses.setDate(expenses.getDate());
                }

                return existingExpenses;
            })
            .map(expensesRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, expenses.getId().toString())
        );
    }

    /**
     * {@code GET  /expenses} : get all the expenses.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of expenses in body.
     */
    @GetMapping("/expenses")
    public List<Expenses> getAllExpenses() {
        log.debug("REST request to get all Expenses");
        return expensesRepository.findAll();
    }

    /**
     * {@code GET  /expenses/:id} : get the "id" expenses.
     *
     * @param id the id of the expenses to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the expenses, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/expenses/{id}")
    public ResponseEntity<Expenses> getExpenses(@PathVariable Long id) {
        log.debug("REST request to get Expenses : {}", id);
        Optional<Expenses> expenses = expensesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(expenses);
    }

    /**
     * {@code DELETE  /expenses/:id} : delete the "id" expenses.
     *
     * @param id the id of the expenses to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/expenses/{id}")
    public ResponseEntity<Void> deleteExpenses(@PathVariable Long id) {
        log.debug("REST request to delete Expenses : {}", id);
        expensesRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
