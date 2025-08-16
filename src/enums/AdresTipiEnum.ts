export enum AdresTipiEnum {
  EV = 'ev',
  IS = 'is',
  FATURA = 'fatura',
  DIGER = 'diger'
}

export const AdresTipiEnumLabels: Record<AdresTipiEnum, string> = {
  [AdresTipiEnum.EV]: 'Ev',
  [AdresTipiEnum.IS]: 'İş',
  [AdresTipiEnum.FATURA]: 'Fatura',
  [AdresTipiEnum.DIGER]: 'Diğer'
};
