package live.wh0cares.elpida.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Category.
 */
@Entity
@Table(name = "category")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Category implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "i_d", nullable = false, unique = true)
    private Integer iD;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "jhi_limit")
    private Double limit;

    @OneToMany(mappedBy = "category")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "category" }, allowSetters = true)
    private Set<Expenses> expenses = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Category id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getiD() {
        return this.iD;
    }

    public Category iD(Integer iD) {
        this.setiD(iD);
        return this;
    }

    public void setiD(Integer iD) {
        this.iD = iD;
    }

    public String getName() {
        return this.name;
    }

    public Category name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getLimit() {
        return this.limit;
    }

    public Category limit(Double limit) {
        this.setLimit(limit);
        return this;
    }

    public void setLimit(Double limit) {
        this.limit = limit;
    }

    public Set<Expenses> getExpenses() {
        return this.expenses;
    }

    public void setExpenses(Set<Expenses> expenses) {
        if (this.expenses != null) {
            this.expenses.forEach(i -> i.setCategory(null));
        }
        if (expenses != null) {
            expenses.forEach(i -> i.setCategory(this));
        }
        this.expenses = expenses;
    }

    public Category expenses(Set<Expenses> expenses) {
        this.setExpenses(expenses);
        return this;
    }

    public Category addExpenses(Expenses expenses) {
        this.expenses.add(expenses);
        expenses.setCategory(this);
        return this;
    }

    public Category removeExpenses(Expenses expenses) {
        this.expenses.remove(expenses);
        expenses.setCategory(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Category)) {
            return false;
        }
        return id != null && id.equals(((Category) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Category{" +
            "id=" + getId() +
            ", iD=" + getiD() +
            ", name='" + getName() + "'" +
            ", limit=" + getLimit() +
            "}";
    }
}
