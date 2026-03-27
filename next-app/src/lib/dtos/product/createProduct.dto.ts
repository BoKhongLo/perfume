export type TagsDetailInp = {
    type?: string;
    value?: string;
};

export type ImageDetailInp = {
    url?: string;
    link?: string[];
};

export type ProductDetailInp = {
    imgDisplay?: ImageDetailInp[];
    brand?: TagsDetailInp;
    size?: TagsDetailInp[];
    sillage?: TagsDetailInp;
    longevity?: TagsDetailInp;
    fragranceNotes?: TagsDetailInp;
    concentration?: TagsDetailInp;
    sex?: TagsDetailInp;
    description?: string;
    tutorial?: string;
};

export type CreateProductDto = {
    name: string;
    originCost: number;
    displayCost: number;
    stockQuantity?: number;
    category?: string;
    details: ProductDetailInp;
};
