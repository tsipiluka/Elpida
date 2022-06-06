package live.wh0cares.elpida.domain;

import static org.assertj.core.api.Assertions.assertThat;

import live.wh0cares.elpida.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class IncomesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Incomes.class);
        Incomes incomes1 = new Incomes();
        incomes1.setId(1L);
        Incomes incomes2 = new Incomes();
        incomes2.setId(incomes1.getId());
        assertThat(incomes1).isEqualTo(incomes2);
        incomes2.setId(2L);
        assertThat(incomes1).isNotEqualTo(incomes2);
        incomes1.setId(null);
        assertThat(incomes1).isNotEqualTo(incomes2);
    }
}
