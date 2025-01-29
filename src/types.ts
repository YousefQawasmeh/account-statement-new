
export type UserType = number;
export type IRecordType = {
  id: number;
  title: string;
};

export type ICurrency = 'دولار' | 'دينار' | 'شيكل'

export type IUser = {
  [x: string]: any;
  total: number;
  name: string;
  subName?: string;
  fullName?: string
  phone: string;
  type: UserType;
  notes: string;
  id: string;
  cardId: number;
  currency: ICurrency;
};

export type IUsers = {
  [key: string]: IUser;
};

export type ICheck = {
  record: IRecord;
  id: number;
  bank: IBank;
  checkNumber?: string;
  amount: number;
  dueDate: string;
  available: boolean;
  deletedAt: string;
  updatedAt: string;
  images?: string[];
  currency: ICurrency;
}

export type IBank = {
  id: number;
  name: string;
}

export type IRecord = {
  id: string;
  user: IUser;
  date: string;
  type: IRecordType;
  amount: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  checks?: ICheck[];
  images?: string[];
}