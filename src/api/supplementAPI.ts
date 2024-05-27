import axios from "axios";
import { API_URL } from "../constants";

const Axios = axios.create({
    baseURL: `${API_URL}/supplement`
});

export async function getSupplementList(order: string, sort: string) {
    try {
        const params = {
            _order: order,
            _sort: sort
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
}