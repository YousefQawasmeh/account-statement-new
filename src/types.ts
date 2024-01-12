
export type UserType = number;
export type IRecordType = {
  id: number;
  title: string;
};

export type IUser = {
  [x: string]: any;
  total: number;
  name: string;
  phone: string;
  type: UserType;
  notes: string;
  id: string;
  cardId: number
};

export type IUsers = {
  [key: string]: IUser;
};

export type IRecord = {
  id: string;
  user: IUser;
  date: string;
  type: IRecordType;
  amount: number;
  notes: string;
  createdAt: string;
}