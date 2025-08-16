export enum TelefonTipiEnum {
  EV = 'ev',
  IS = 'is',
  CEP = 'cep',
  FAKS = 'faks'
}

export const TelefonTipiEnumLabels: Record<TelefonTipiEnum, string> = {
  [TelefonTipiEnum.EV]: 'Ev',
  [TelefonTipiEnum.IS]: 'İş',
  [TelefonTipiEnum.CEP]: 'Cep',
  [TelefonTipiEnum.FAKS]: 'Faks'
};
