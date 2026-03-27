export interface ProductData {
    buyCount?: number;
    category?: string;
    created_at?: string;
    displayCost?: number;
    id?: string;
    isDisplay?: boolean;
    name?: string;
    originCost?: number;
    rating?: number;
    stockQuantity?: number;
    updated_at?: string;
    details?: ProductDetails;
}

export interface ProductDetails {
    id?: string;
    brand?: {
        value?: string;
    };
    concentration?: {
        value?: string;
    };
    fragranceNotes?: {
        value?: string;
    };
    longevity?: {
        value?: string;
    };
    sex?: {
        value?: string;
    };
    sillage?: {
        value?: string;
    };
    size?: {
        value?: string;
    }[];
}