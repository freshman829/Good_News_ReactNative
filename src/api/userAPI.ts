import axios from "axios";
import { UserInterface } from "../store/UserStore";
import { CreateNewTargetProps } from "../types/data";

const Axios = axios.create({
    baseURL: "https://goodnews2023.herokuapp.com/api"
    // baseURL: "http://10.0.2.2:3000/api"
});

export async function loginUserWithApple(user: { userId: string, userName: string, identityToken: string }) {
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

export async function saveProgramDuration(data: { id: string, program: { start: Date, duration: number } }) {
    try {
        const result = await Axios.post(`/users/${data.id}/saveProgramDate`, data.program);
        return {
            success: true,
            data: result.data
        };
    } catch (error) {
        return {
            success: false,
            msg: (error as any).message
        };
    }
}

export async function updateUserinfo(data: UserInterface) {
    try {
        const result = await Axios.put(`/users/${data._id}`, data);
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