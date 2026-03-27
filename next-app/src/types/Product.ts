export type TagsDetailType = {
    id?: number;
    type?: string;
    value?: string;
}

export type ProductDetailType = {
    id?: number;
    imgDisplay?: ImageDetailType[];
    size?: TagsDetailType[];
    brand?: TagsDetailType;
    sillage?: TagsDetailType;
    longevity?: TagsDetailType;
    fragranceNotes?: TagsDetailType ;
    concentration?: TagsDetailType ;
    sex?: TagsDetailType ;
    description?: string ;
    tutorial?: string;
}

export type ImageDetailType = {
    id?: number;
    url?: string;
    link?: string[];
}

export type ProductType = {
    id: number;
    name: string;
    isDisplay?: boolean;
    originCost?: number;
    displayCost: number;
    stockQuantity: number;
    category?: string;
    buyCount?: number;
    rating?: number;
    details?: ProductDetailType;
    created_at?: Date;
    updated_at?: Date;
}
