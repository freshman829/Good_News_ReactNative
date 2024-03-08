import axios from "axios";
import { UserInterface } from "../store/UserStore";

const Axios = axios.create({
    baseURL: "https://goodnews2023.herokuapp.com/api"
    // baseURL: "http://10.0.2.2:3000/api"
});

export async function loginUserWithApple(user: { email: string, fullName: string, appleID: string }) {
    try {
        const result = await Axios.post(`/users/loginWithApple`, user);
        return result.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function saveRotationSchedule(data: UserInterface) {
    try {
        console.log(`/users/${data._id}/updateSchedule`);
        const result = await Axios.post(`/users/${data._id}/updateSchedule`, data.rotationPlan);
        return result.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}