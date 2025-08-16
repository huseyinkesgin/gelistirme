export enum FirmaTipiEnum {
  LIMITED = 'limited',
  ANONIM = 'anonim',
  SAHIS = 'sahis',
  DIGER = 'diger'
}

export const FirmaTipiEnumLabels: Record<FirmaTipiEnum, string> = {
  [FirmaTipiEnum.LIMITED]: 'Limited Şirket',
  [FirmaTipiEnum.ANONIM]: 'Anonim Şirket',
  [FirmaTipiEnum.SAHIS]: 'Şahıs Şirketi',
  [FirmaTipiEnum.DIGER]: 'Diğer'
};
