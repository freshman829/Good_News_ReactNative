import axios from "axios";
import { UserInterface } from "../store/UserStore";
import { CreateNewTargetProps } from "../types/data";

const Axios = axios.create({
    // baseURL: "https://goodnews2023.herokuapp.com/api"
    baseURL: "http://10.0.2.2:3000/api"
});

export async function loginUserWithApple(user: {userId:string,identityToken:string }) {
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

export async function registerNewTarget(data: CreateNewTargetProps) {
    try {
        const result = await Axios.post(`/users/${data.id}/addTarget`, data.value);
        return result.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function saveNewWeightLog(data: { id: string, log: { weight: number, date: Date } }) {
    try {
        const result = await Axios.post(`/users/${data.id}/addWeightLog`, data.log);
        return result.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}