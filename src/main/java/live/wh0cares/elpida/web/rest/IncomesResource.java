package live.wh0cares.elpida.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import live.wh0cares.elpida.domain.Incomes;
import live.wh0cares.elpida.repository.IncomesRepository;
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
 * REST controller for managing {@link live.wh0cares.elpida.domain.Incomes}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class IncomesResource {

    private final Logger log = LoggerFactory.getLogger(IncomesResource.class);

    private static final String ENTITY_NAME = "incomes";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final IncomesRepository incomesRepository;

    public IncomesResource(IncomesRepository incomesRepository) {
        this.incomesRepository = incomesRepository;
    }

    /**
     * {@code POST  /incomes} : Create a new incomes.
     *
     * @param incomes the incomes to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new incomes, or with status {@code 400 (Bad Request)} if the incomes has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/incomes")
    public ResponseEntity<Incomes> createIncomes(@Valid @RequestBody Incomes incomes) throws URISyntaxException {
        log.debug("REST request to save Incomes : {}", incomes);
        if (incomes.getId() != null) {
            throw new BadRequestAlertException("A new incomes cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Incomes result = incomesRepository.save(incomes);
        return ResponseEntity
            .created(new URI("/api/incomes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /incomes/:id} : Updates an existing incomes.
     *
     * @param id the id of the incomes to save.
     * @param incomes the incomes to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated incomes,
     * or with status {@code 400 (Bad Request)} if the incomes is not valid,
     * or with status {@code 500 (Internal Server Error)} if the incomes couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/incomes/{id}")
    public ResponseEntity<Incomes> updateIncomes(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Incomes incomes
    ) throws URISyntaxException {
        log.debug("REST request to update Incomes : {}, {}", id, incomes);
        if (incomes.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, incomes.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!incomesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Incomes result = incomesRepository.save(incomes);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, incomes.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /incomes/:id} : Partial updates given fields of an existing incomes, field will ignore if it is null
     *
     * @param id the id of the incomes to save.
     * @param incomes the incomes to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated incomes,
     * or with status {@code 400 (Bad Request)} if the incomes is not valid,
     * or with status {@code 404 (Not Found)} if the incomes is not found,
     * or with status {@code 500 (Internal Server Error)} if the incomes couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/incomes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Incomes> partialUpdateIncomes(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Incomes incomes
    ) throws URISyntaxException {
        log.debug("REST request to partial update Incomes partially : {}, {}", id, incomes);
        if (incomes.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, incomes.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!incomesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Incomes> result = incomesRepository
            .findById(incomes.getId())
            .map(existingIncomes -> {
                if (incomes.getiD() != null) {
                    existingIncomes.setiD(incomes.getiD());
                }
                if (incomes.getName() != null) {
                    existingIncomes.setName(incomes.getName());
                }
                if (incomes.getValue() != null) {
                    existingIncomes.setValue(incomes.getValue());
                }
                if (incomes.getDate() != null) {
                    existingIncomes.setDate(incomes.getDate());
                }

                return existingIncomes;
            })
            .map(incomesRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, incomes.getId().toString())
        );
    }

    /**
     * {@code GET  /incomes} : get all the incomes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of incomes in body.
     */
    @GetMapping("/incomes")
    public List<Incomes> getAllIncomes() {
        log.debug("REST request to get all Incomes");
        return incomesRepository.findAll();
    }

    /**
     * {@code GET  /incomes/:id} : get the "id" incomes.
     *
     * @param id the id of the incomes to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the incomes, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/incomes/{id}")
    public ResponseEntity<Incomes> getIncomes(@PathVariable Long id) {
        log.debug("REST request to get Incomes : {}", id);
        Optional<Incomes> incomes = incomesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(incomes);
    }

    /**
     * {@code DELETE  /incomes/:id} : delete the "id" incomes.
     *
     * @param id the id of the incomes to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/incomes/{id}")
    public ResponseEntity<Void> deleteIncomes(@PathVariable Long id) {
        log.debug("REST request to delete Incomes : {}", id);
        incomesRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
