import axios from "axios";
import { API_URL } from "../constants";

const Axios = axios.create({
    baseURL: `${API_URL}/food`
});

export async function getFoodList() {
    try {
        const result = await Axios.get(`/`);
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
}