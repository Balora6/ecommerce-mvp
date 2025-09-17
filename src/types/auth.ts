export interface IShopifyOAuthResponse {
  access_token: string;
  scope: string;
}

export interface IShopifyShopInfo {
  shop: {
    domain: string;
    name: string;
  };
}
