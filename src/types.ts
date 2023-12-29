
export type UserType = 1 | 2;
export type User = {
  total: number;
  name: string;
  phone: string;
  type: UserType;
  notes: string;
  id: string;
};
export type Users = {
  [key: string]: User;
};