import { Gender } from "../../../generated/prisma/enums";

export interface ICreateProviderProfilePayload {
  password: string;
  provider: {
    name: string;
    email: string;
    profilePhoto: string;
    address: string;
    contactNumber: string;
    gender: Gender;
  };
}

export interface ICreateRestaurantProfilePayload {
  email: string;
  restaurantName: string;
  image: string;
  description?: string;
  restaurantAddress: string;
  phoneNumber: string;
}
