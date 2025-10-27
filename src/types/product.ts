export type ProductType = 'affiliate' | 'dropshipping' | 'local';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  featured?: boolean;
  material?: string;
  productType: ProductType;
  affiliateUrl?: string;
  stock?: number;
  supplierLink?: string;
}
