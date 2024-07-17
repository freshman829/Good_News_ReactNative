import axios from "axios";
import { API_URL } from "../constants";

const Axios = axios.create({
    baseURL: `${API_URL}/referFriend`
});

export async function generateReferralCode (referEmail: string, userId: string) {
    const payload = {
        referEmail,
        userId
    }
    try {
        const result = await Axios.post(`/generateReferralCode`, payload);
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

export async function verifyReferralCode (code: string) {
    try {
        const result = await Axios.post(`/verifyReferralCode`, { code });
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
