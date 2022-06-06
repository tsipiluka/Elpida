package live.wh0cares.elpida.repository;

import live.wh0cares.elpida.domain.StandingOrders;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the StandingOrders entity.
 */
@SuppressWarnings("unused")
@Repository
public interface StandingOrdersRepository extends JpaRepository<StandingOrders, Long> {}
