import axios from "axios";
import { API_URL } from "../constants";

const Axios = axios.create({
    baseURL: `${API_URL}/googlePay`
});

export async function fetchGooglePaymentSheet() {
    try {
        const result = await Axios.post(`/paymentSheet`);
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