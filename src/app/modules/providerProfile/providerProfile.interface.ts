export interface IUpdateRestaurantProfilePayload {
  email: string;
  restaurantName: string;
  image: string;
  description?: string;
  restaurantAddress: string;
  phoneNumber: string;
}
