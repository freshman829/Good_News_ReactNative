import axios from "axios";

const Axios = axios.create({
    baseURL: "https://goodnews2023.herokuapp.com/api/food"
    // baseURL: "http://10.0.2.2:3000/api/food"
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