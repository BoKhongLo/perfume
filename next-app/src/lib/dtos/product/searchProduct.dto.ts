import { TagsDetailInp } from "./createProduct.dto";


export type SearchProductDto = {

    name?: string;

    rangeMoney?: number[]

    size?: TagsDetailInp[];

    brand?: TagsDetailInp[];

    fragranceNotes?: TagsDetailInp[];

    concentration?: TagsDetailInp[];

    sex?: TagsDetailInp[];

    index?: number

    count?: number

    sort?: string

    hotSales?: string
}

