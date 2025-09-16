export interface ShopifyOAuthResponse {
  access_token: string;
  scope: string;
}

export interface ShopifyShopInfo {
  shop: {
    domain: string;
    name: string;
  };
}
