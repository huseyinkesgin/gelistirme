export enum MedeniDurumEnum {
  BEKAR = 'bekar',
  EVLI = 'evli',
  DUL = 'dul',
  BOSANMIS = 'bosanmis',
  BELIRTILMEMIS = 'belirtilmemis'
}

export const MedeniDurumEnumLabels: Record<MedeniDurumEnum, string> = {
  [MedeniDurumEnum.BEKAR]: 'Bekar',
  [MedeniDurumEnum.EVLI]: 'Evli',
  [MedeniDurumEnum.DUL]: 'Dul',
  [MedeniDurumEnum.BOSANMIS]: 'Boşanmış',
  [MedeniDurumEnum.BELIRTILMEMIS]: 'Belirtilmemiş'
};
