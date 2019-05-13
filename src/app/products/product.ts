
export class Product {

    id: number;
    categoryId: number;
    avatarImageId?: number;
    productImageIds?: number[];
    name: string;
    longName: string;
    description: string;
    productNumber?: string;
    ingredient: string;
    type: string;
    price: number;
    volume: string;
    origin: string;
    producer: string;
    highlight?: string;
    isActive: boolean;
    productFunction: ProductFunction[];
}

export class ProductFunction {

    id: number;
    summary: string;
    detail: string;
}
