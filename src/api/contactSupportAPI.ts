import axios from "axios";
import { API_URL, OPANPHONE_API_URL, OPENPHONE_API_KEY, OPENPHONE_NUMBER } from "../constants";

// const Axios = axios.create({
//     baseURL: `${OPANPHONE_API_URL}/messages`,
//     headers: {
//         'Content-Type': 'application/json',
//         'Authorization': OPENPHONE_API_KEY
//     }
// });

// export const sendMessage = async (message: string) => {
//     const payload = {
//         phone_number: OPENPHONE_NUMBER,
//         text: message
//     };
//     try {
//         const result = await Axios.post(`/`, payload);
//         return result
//     } catch (error) {
//         return {
//             success: false,
//             msg: (error as any).message
//         }
//     }
// };

const Axios = axios.create({
    baseURL: `${API_URL}/contactSupport`
});

export const fetchMessages = async (userId: string) => {
    const params = {
        userId : userId
    };
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

export const sendMessage = async (userId: string, message: string) => {
    const payload = {
        userId: userId,
        message: message
    };
    try {
        const result = await Axios.post(`/send-message`, payload);
        return result
    } catch (error) {
        return {
            success: false,
            msg: (error as any).message
        }
    }
};