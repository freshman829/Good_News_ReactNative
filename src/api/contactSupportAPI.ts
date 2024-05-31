import axios from "axios";
import { OPANPHONE_API_URL, OPENPHONE_API_KEY, OPENPHONE_NUMBER } from "../constants";

const Axios = axios.create({
    baseURL: `${OPANPHONE_API_URL}/messages`,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': OPENPHONE_API_KEY
    }
});

export const sendMessage = async (message: string) => {
    const payload = {
        phone_number: OPENPHONE_NUMBER,
        text: message
    };
    try {
        const result = await Axios.post(`/`, payload);
        return result
    } catch (error) {
        return {
            success: false,
            msg: (error as any).message
        }
    }
};