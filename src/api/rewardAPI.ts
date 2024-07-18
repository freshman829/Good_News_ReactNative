import axios from "axios";
import { API_URL } from "../constants";

const Axios = axios.create({
    baseURL: `${API_URL}/reward`
});

export async function getRewardsHistoryList (userId: string) {
    const params = {
        userId
    }
    try {
        const result = await Axios.get(`/`, { params });
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

export async function addReward (userId: string, amount: number, reason: number) {
    const payload = {
        userId,
        amount,
        reason
    }
    try {
        const result = await Axios.post(`/`, payload);
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
