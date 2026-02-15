/**
 * Данные для шапки страницы помёта (раздел «Наше разведение»).
 */

/** Элемент строки «от пары: отец & мать» — текст или ссылка */
export interface ParentsNamePart {
  text: string;
  routerLink?: string;
  isLink?: boolean;
}

/** Блок одного родителя в варианте «два столбца» (фото + титулы) */
export interface ParentBlock {
  title: string;
  titleRouterLink?: string;
  photoUrls: string[];
  titles: string[];
}

/** Вариант шапки помёта */
export type LitterHeaderVariant =
  | 'parents-only'
  | 'single-image'
  | 'two-columns'
  | 'public-photos-only';

export interface LitterHeaderData {
  /** Текст «родились щенки ...» */
  introText: string;
  /** Части строки «от пары: отец & мать» (текст и ссылки) */
  parentsName: ParentsNamePart[];
  variant: LitterHeaderVariant;

  /** Для variant === 'single-image': одна картинка (презентация) */
  mainImage?: { src: string; alt: string };
  /** Подпись над mainImage (опционально) */
  mainImageTitle?: string;
  /** Подзаголовки над картинкой: ОТЕЦ / МАТЬ (для single-image с двумя строками) */
  mainImageFatherTitle?: string;
  mainImageMotherTitle?: string;
  mainImageMotherLink?: string;

  /** Для variant === 'two-columns' */
  father?: ParentBlock;
  mother?: ParentBlock;

  /** Доп. блок: общие фото помёта (для single-image + public или public-photos-only) */
  publicImages?: {
    title?: string;
    photoUrls: string[];
    altText: string;
  };
}
