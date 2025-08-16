export enum CinsiyetEnum {
  ERKEK = 'erkek',
  KADIN = 'kadin',
  BELIRTILMEMIS = 'belirtilmemis'
}

export const CinsiyetEnumLabels: Record<CinsiyetEnum, string> = {
  [CinsiyetEnum.ERKEK]: 'Erkek',
  [CinsiyetEnum.KADIN]: 'Kadın',
  [CinsiyetEnum.BELIRTILMEMIS]: 'Belirtilmemiş'
};
