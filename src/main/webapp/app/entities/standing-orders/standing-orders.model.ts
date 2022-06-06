import dayjs from 'dayjs/esm';

export interface IStandingOrders {
  id?: number;
  iD?: number;
  name?: string;
  value?: number;
  date?: dayjs.Dayjs;
  interval?: number;
}

export class StandingOrders implements IStandingOrders {
  constructor(
    public id?: number,
    public iD?: number,
    public name?: string,
    public value?: number,
    public date?: dayjs.Dayjs,
    public interval?: number
  ) {}
}

export function getStandingOrdersIdentifier(standingOrders: IStandingOrders): number | undefined {
  return standingOrders.id;
}
