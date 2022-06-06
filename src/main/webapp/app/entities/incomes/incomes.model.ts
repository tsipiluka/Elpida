import dayjs from 'dayjs/esm';

export interface IIncomes {
  id?: number;
  iD?: number;
  name?: string;
  value?: number;
  date?: dayjs.Dayjs;
}

export class Incomes implements IIncomes {
  constructor(public id?: number, public iD?: number, public name?: string, public value?: number, public date?: dayjs.Dayjs) {}
}

export function getIncomesIdentifier(incomes: IIncomes): number | undefined {
  return incomes.id;
}
