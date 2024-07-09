import axios from "axios";
import { UserInterface } from "../store/UserStore";
import { CreateNewTargetProps } from "../types/data";
import { API_URL } from "../constants";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Axios = axios.create({
    baseURL: `${API_URL}/users`
});

export async function loginUserWithApple(user: { userId: string, userName: string, identityToken: string }) {
    try {
        const result = await Axios.post(`/loginWithApple`, user);
        return result.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function loginUserWithGoogle(user: { userId: string, userName: string, userEmail: string }) {
    try {
        const result = await Axios.post(`/loginWithGoogle`, user);
        return result.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function saveRotationSchedule(data: UserInterface) {
    try {
        const result = await Axios.post(`/${data._id}/updateSchedule`, data.rotationPlan);
        return result.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function registerNewTarget(data: CreateNewTargetProps) {
    try {
        const result = await Axios.post(`/${data.id}/addTarget`, data.value);
        return result.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function saveNewWeightLog(data: { id: string, log: { weight: number, comment?: string, date: Date } }) {
    try {
        const result = await Axios.post(`/${data.id}/addWeightLog`, data.log);
        return result.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function saveProgramDuration(data: { id: string, program: { start: Date, duration: number } }) {
    try {
        const result = await Axios.post(`/${data.id}/saveProgramDate`, data.program);
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

export async function updateUserinfo(data: any) {
    try {
        const result = await Axios.put(`/${data._id}`, data);
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

export async function getPlanList(id: string) {
    try {
        const result = await Axios.get(`/${id}/getPlan`);
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

export async function getFoodSuggestion(id: string) {
    try {
        const result = await Axios.get(`/${id}/getFoodSuggestion`);
        return {
            success: true,
            data: result.data
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            msg: (error as any).message
        };
    }
} 

export const updateInfo = async (userInfo: UserInterface) => {
    try {
      await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
      return userInfo;
    } catch (error) {
      console.error('Failed to update user info:', error);
    }
  };
