import axios from "axios";
import { API_URL } from "../constants";

const Axios = axios.create({
    baseURL: `${API_URL}/faq`
});

export const getFaqList = async (search: string) => {
    try {
        const params = {
            search: search
        }
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
