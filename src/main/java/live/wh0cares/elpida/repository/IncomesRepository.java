package live.wh0cares.elpida.repository;

import live.wh0cares.elpida.domain.Incomes;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Incomes entity.
 */
@SuppressWarnings("unused")
@Repository
public interface IncomesRepository extends JpaRepository<Incomes, Long> {}
