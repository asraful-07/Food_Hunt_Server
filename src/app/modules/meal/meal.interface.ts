export interface ICreateMealPayload {
  name: string;
  categoryId: string;
  price: number;
  description?: string;
  images: string[];
  stock: number;
  dietaryPreferences: string[];
}

export interface IUpdateMealPayload {
  name: string;
  categoryId: string;
  price: number;
  description?: string;
  images: string[];
  stock: number;
  dietaryPreferences: string[];
}
