import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'expenses',
        data: { pageTitle: 'elpidaApp.expenses.home.title' },
        loadChildren: () => import('./expenses/expenses.module').then(m => m.ExpensesModule),
      },
      {
        path: 'category',
        data: { pageTitle: 'elpidaApp.category.home.title' },
        loadChildren: () => import('./category/category.module').then(m => m.CategoryModule),
      },
      {
        path: 'incomes',
        data: { pageTitle: 'elpidaApp.incomes.home.title' },
        loadChildren: () => import('./incomes/incomes.module').then(m => m.IncomesModule),
      },
      {
        path: 'standing-orders',
        data: { pageTitle: 'elpidaApp.standingOrders.home.title' },
        loadChildren: () => import('./standing-orders/standing-orders.module').then(m => m.StandingOrdersModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
