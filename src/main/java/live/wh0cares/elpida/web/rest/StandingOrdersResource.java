package live.wh0cares.elpida.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import live.wh0cares.elpida.domain.StandingOrders;
import live.wh0cares.elpida.repository.StandingOrdersRepository;
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
 * REST controller for managing {@link live.wh0cares.elpida.domain.StandingOrders}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class StandingOrdersResource {

    private final Logger log = LoggerFactory.getLogger(StandingOrdersResource.class);

    private static final String ENTITY_NAME = "standingOrders";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final StandingOrdersRepository standingOrdersRepository;

    public StandingOrdersResource(StandingOrdersRepository standingOrdersRepository) {
        this.standingOrdersRepository = standingOrdersRepository;
    }

    /**
     * {@code POST  /standing-orders} : Create a new standingOrders.
     *
     * @param standingOrders the standingOrders to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new standingOrders, or with status {@code 400 (Bad Request)} if the standingOrders has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/standing-orders")
    public ResponseEntity<StandingOrders> createStandingOrders(@Valid @RequestBody StandingOrders standingOrders)
        throws URISyntaxException {
        log.debug("REST request to save StandingOrders : {}", standingOrders);
        if (standingOrders.getId() != null) {
            throw new BadRequestAlertException("A new standingOrders cannot already have an ID", ENTITY_NAME, "idexists");
        }
        StandingOrders result = standingOrdersRepository.save(standingOrders);
        return ResponseEntity
            .created(new URI("/api/standing-orders/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /standing-orders/:id} : Updates an existing standingOrders.
     *
     * @param id the id of the standingOrders to save.
     * @param standingOrders the standingOrders to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated standingOrders,
     * or with status {@code 400 (Bad Request)} if the standingOrders is not valid,
     * or with status {@code 500 (Internal Server Error)} if the standingOrders couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/standing-orders/{id}")
    public ResponseEntity<StandingOrders> updateStandingOrders(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody StandingOrders standingOrders
    ) throws URISyntaxException {
        log.debug("REST request to update StandingOrders : {}, {}", id, standingOrders);
        if (standingOrders.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, standingOrders.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!standingOrdersRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        StandingOrders result = standingOrdersRepository.save(standingOrders);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, standingOrders.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /standing-orders/:id} : Partial updates given fields of an existing standingOrders, field will ignore if it is null
     *
     * @param id the id of the standingOrders to save.
     * @param standingOrders the standingOrders to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated standingOrders,
     * or with status {@code 400 (Bad Request)} if the standingOrders is not valid,
     * or with status {@code 404 (Not Found)} if the standingOrders is not found,
     * or with status {@code 500 (Internal Server Error)} if the standingOrders couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/standing-orders/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<StandingOrders> partialUpdateStandingOrders(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody StandingOrders standingOrders
    ) throws URISyntaxException {
        log.debug("REST request to partial update StandingOrders partially : {}, {}", id, standingOrders);
        if (standingOrders.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, standingOrders.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!standingOrdersRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<StandingOrders> result = standingOrdersRepository
            .findById(standingOrders.getId())
            .map(existingStandingOrders -> {
                if (standingOrders.getiD() != null) {
                    existingStandingOrders.setiD(standingOrders.getiD());
                }
                if (standingOrders.getName() != null) {
                    existingStandingOrders.setName(standingOrders.getName());
                }
                if (standingOrders.getValue() != null) {
                    existingStandingOrders.setValue(standingOrders.getValue());
                }
                if (standingOrders.getDate() != null) {
                    existingStandingOrders.setDate(standingOrders.getDate());
                }
                if (standingOrders.getInterval() != null) {
                    existingStandingOrders.setInterval(standingOrders.getInterval());
                }

                return existingStandingOrders;
            })
            .map(standingOrdersRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, standingOrders.getId().toString())
        );
    }

    /**
     * {@code GET  /standing-orders} : get all the standingOrders.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of standingOrders in body.
     */
    @GetMapping("/standing-orders")
    public List<StandingOrders> getAllStandingOrders() {
        log.debug("REST request to get all StandingOrders");
        return standingOrdersRepository.findAll();
    }

    /**
     * {@code GET  /standing-orders/:id} : get the "id" standingOrders.
     *
     * @param id the id of the standingOrders to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the standingOrders, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/standing-orders/{id}")
    public ResponseEntity<StandingOrders> getStandingOrders(@PathVariable Long id) {
        log.debug("REST request to get StandingOrders : {}", id);
        Optional<StandingOrders> standingOrders = standingOrdersRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(standingOrders);
    }

    /**
     * {@code DELETE  /standing-orders/:id} : delete the "id" standingOrders.
     *
     * @param id the id of the standingOrders to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/standing-orders/{id}")
    public ResponseEntity<Void> deleteStandingOrders(@PathVariable Long id) {
        log.debug("REST request to delete StandingOrders : {}", id);
        standingOrdersRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
