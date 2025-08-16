// Temel tip tanımları

export interface BaseEntity {
  id: string;
  olusturma_tarihi: Date;
  guncelleme_tarihi: Date;
  silinme_tarihi?: Date;
  aktif_mi: boolean;
  siralama: number;
}

// Enum tipleri
export enum CinsiyetEnum {
  ERKEK = 'erkek',
  KADIN = 'kadin'
}

export enum MedeniDurumEnum {
  BEKAR = 'bekar',
  EVLI = 'evli',
  DUL = 'dul',
  BOSANMIS = 'bosanmis'
}

export enum TelefonTipiEnum {
  EV = 'ev',
  IS = 'is',
  CEP = 'cep',
  FAKS = 'faks'
}

export enum AdresTipiEnum {
  EV = 'ev',
  IS = 'is',
  FATURA = 'fatura',
  DIGER = 'diger'
}

// Form bileşenleri için tipler
export interface FormInputProps {
  modelValue?: string | number;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  labelPosition?: 'top' | 'left';
}

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

// Modal tipleri
export interface ModalProps {
  show: boolean;
  title?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | '2xl' | string;
  closable?: boolean;
}

// Bildirim tipleri
export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
}

// API yanıt tipleri
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

// Sayfalama tipleri
export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

// Tablo tipleri
export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: any) => string;
}

export interface TableProps {
  columns: TableColumn[];
  data: any[];
  loading?: boolean;
  selectable?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Dosya yükleme tipleri
export interface FileUploadOptions {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // bytes
  maxFiles?: number;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  thumbnail?: string;
}