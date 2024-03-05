import axios from "axios";

const Axios = axios.create({
    // baseURL: "https://goodnews2023.herokuapp.com/api"
    baseURL: "http://localhost:3000/api"
});

export async function loginUserWithApple(user: { email: string, fullName: string, appleID: string }) {
    try {
        const result = await Axios.post(`/users/loginWithApple`, user);
        return result.data;
    } catch (error) {
        throw error;
    }
}