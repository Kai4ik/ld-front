export interface User {
  email: string;
  password: string;
  role: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface Item {
  id: string;
  itemTitle: string;
  itemDescription: string;
  itemPrice: number;
  itemStatus: string;
  soldBy: string;
  boughtBy?: string;
  orderId?: string;
  inCart?: boolean;
}

export interface Order {
  id: string;
  orderDate: string;
  orderBy: string;
  items: Item[];
}
