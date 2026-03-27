import { ProductDetailInp } from "./createProduct.dto";

export type UpdateProductDto = {
    productId: number;
    name?: string;
    originCost?: number;
    displayCost?: number;
    stockQuantity?: number;
    category?: string;
    buyCount?: number;
    rating?: number;
    details?: ProductDetailInp;
  };