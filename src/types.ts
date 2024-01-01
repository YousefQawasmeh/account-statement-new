
export type UserType = number;
// export type UserType = 1 | 2;
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