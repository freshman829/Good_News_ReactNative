import axios from "axios";
import { API_URL } from "../constants";

const Axios = axios.create({
    baseURL: `${API_URL}/setting`
});

export const getSettingInfo = async (key: string) => {
    try {
        const params = {
            key: key
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
