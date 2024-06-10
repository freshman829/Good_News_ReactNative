export interface Supplement {
    _id: string,
    name: string,
    description: string,
    category: string,
    price: number,
    image: string,
    thumbs: ThumbsInfo[],
    stock: string,
    createdAt: string,
};

export interface ThumbsInfo {
    name: string,
    url: string,
    lastUpdated: string,
    type: string,
}