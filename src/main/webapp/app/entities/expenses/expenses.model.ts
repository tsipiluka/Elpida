import dayjs from 'dayjs/esm';
import { ICategory } from 'app/entities/category/category.model';

export interface IExpenses {
  id?: number;
  iD?: number;
  name?: string;
  value?: number;
  date?: dayjs.Dayjs;
  category?: ICategory | null;
}

export class Expenses implements IExpenses {
  constructor(
    public id?: number,
    public iD?: number,
    public name?: string,
    public value?: number,
    public date?: dayjs.Dayjs,
    public category?: ICategory | null
  ) {}
}

export function getExpensesIdentifier(expenses: IExpenses): number | undefined {
  return expenses.id;
}
