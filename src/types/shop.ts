export interface Shop {
  id: string;
  shopDomain: string;
  accessToken: string;
  apiScope: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateShopData {
  shopDomain: string;
  accessToken: string;
  apiScope: string;
}
