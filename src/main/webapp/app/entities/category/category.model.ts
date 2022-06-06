import { IExpenses } from 'app/entities/expenses/expenses.model';

export interface ICategory {
  id?: number;
  iD?: number;
  name?: string;
  limit?: number | null;
  expenses?: IExpenses[] | null;
}

export class Category implements ICategory {
  constructor(
    public id?: number,
    public iD?: number,
    public name?: string,
    public limit?: number | null,
    public expenses?: IExpenses[] | null
  ) {}
}

export function getCategoryIdentifier(category: ICategory): number | undefined {
  return category.id;
}
