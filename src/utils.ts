import { ICurrency } from "./types";

export const objectToFormData = (obj: { [x: string]: any }, form = new FormData(), namespace = '') => {
  for (const key in obj) {
    const value = obj[key];

    if (value === undefined) {
      continue;
    }
    const formKey = namespace ? `${namespace}[${key}]` : key;

    if (value instanceof File || value instanceof Blob) {
      form.append(formKey, value);
    } else if (Array.isArray(value)) {
      value.forEach((v, i) => {
        objectToFormData(v, form, `${formKey}[${i}]`);
      });
    } else if (typeof value === 'object' && value !== null) {
      objectToFormData(value, form, formKey);
    } else {
      form.append(formKey, value);
    }
  }
  return form;
};

export const allCurrencies: { name: ICurrency, symbol: string }[] = [
  {
    name: 'شيكل',
    symbol: '₪'
  },
  {
    name: 'دينار',
    symbol: 'د.ا'
  },
  {
    name: 'دولار',
    symbol: '$'
  },
]
export const getCurrencySymbol = (currency?: string) => {
  switch (currency) {
    case 'دولار':
      return '$';
    case 'دينار':
      return 'د.ا';//JD
    case 'شيكل':
      return '₪';
    default:
      return '';
  }
};

export const usersTypes: { [key: number]: string } = {
  1: "ذمم مدينة",
  2: "ذمم دائنة",
}
export const usersTypesShort: { [key: number]: string } = {
  1: "مدين",
  2: "دائن",
}

export const baseApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
