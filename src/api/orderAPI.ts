import axios from "axios";
import { API_URL } from "../constants";
import { Order } from "../types/data";

const Axios = axios.create({
    baseURL: `${API_URL}/order`
});

export async function createOrder(order: Order) {
    try {
        const result = await Axios.post(`/createOrder`, order);
        return {
            success: true,
            data: result.data
        }
    } catch (error) {
        return {
            success: false,
            msg: (error as any).message
        }
    }
};

export async function getOrderHistoryList(userId: string) {
    try {
        const params = {
            userId: userId
        };
        const result = await Axios.get(`/getOrderHistory`, { params });
        return {
            success: true,
            data: result.data
        }
    } catch (error) {
        return {
            success: false,
            msg: (error as any).message
        }
    }
};
