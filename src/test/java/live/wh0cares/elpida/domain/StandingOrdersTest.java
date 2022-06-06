package live.wh0cares.elpida.domain;

import static org.assertj.core.api.Assertions.assertThat;

import live.wh0cares.elpida.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class StandingOrdersTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(StandingOrders.class);
        StandingOrders standingOrders1 = new StandingOrders();
        standingOrders1.setId(1L);
        StandingOrders standingOrders2 = new StandingOrders();
        standingOrders2.setId(standingOrders1.getId());
        assertThat(standingOrders1).isEqualTo(standingOrders2);
        standingOrders2.setId(2L);
        assertThat(standingOrders1).isNotEqualTo(standingOrders2);
        standingOrders1.setId(null);
        assertThat(standingOrders1).isNotEqualTo(standingOrders2);
    }
}
