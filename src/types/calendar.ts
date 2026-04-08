
export interface MonthTheme {
  name: string;
  image: string;
  primary: string;
  primaryDark: string;
  primaryLight: string;
  bg1: string;
  bg2: string;
  accent: string;
}

export interface NagerHoliday {
  date: string;
  localName: string;
  name: string;
}

export interface UserTag {
  id: string;
  label: string;
  icon?: string;
  color: string;
}

export interface TagPopupState {
  dayKey: string;
  anchorRect: DOMRect;
}

export interface SavedNote {
  id: string;
  text: string;
  dateLabel: string;
  createdAt: number;
  completed?: boolean;
}

export interface CountryOption {
  code: string;
  flag: string;
  name: string;
  apiSupported: boolean;
}
