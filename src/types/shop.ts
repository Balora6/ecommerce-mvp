export interface IShop {
  id: string;
  shopDomain: string;
  accessToken: string;
  apiScope: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateShopData {
  shopDomain: string;
  accessToken: string;
  apiScope: string;
}
