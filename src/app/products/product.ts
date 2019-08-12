
export class Product {

    id: number;
    categoryId: number;
    avatarId?: number;
    productImageIds?: number[];
    name: string;
    longName: string;
    description: string;
    type: string;
    price: number;
    volume: string;
    productNumber?: string;
    ingredient?: string;
    origin?: string;
    producer?: string;
    highlight?: string;
    isActive: boolean;
    functions: ProductFunction[];
}

export class ProductFunction {

    id: number;
    summary: string;
    detail: string;
}
