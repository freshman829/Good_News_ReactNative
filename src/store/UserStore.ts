import { create } from "zustand";

const initUserInfo: UserInterface = {
    _id: "",
    appleId: "",
    email: "",
    fullName: "",
    firstTimeRun: true,
    isLoggedIn: false,
    rotationPlan: {
        mode: 0,
        wakeTime: "07:00 AM",
        sleepTime: "11:00 PM",
        isConfirm: false,
        alarms: [],
        plan: 0,
        programStartDate: new Date(),
        programDays: 14
    }
};

export interface UserInterface {
    _id: string;
    appleId: string;
    email: string;
    fullName: string;
    firstTimeRun: boolean;
    isLoggedIn: boolean;
    rotationPlan: {
        plan: number;
        mode: number;
        wakeTime: string;
        sleepTime: string;
        isConfirm: boolean;
        alarms: any[],
        programStartDate: Date;
        programDays: number;
    }
}

interface UserState {
    userInfo: UserInterface;
    setUserInfo: (into: UserInterface) => void;
}

export const useUserInfoStore = create<UserState>((set) => ({
    userInfo: initUserInfo,
    setUserInfo: (info) => set((state) => ({ userInfo: info }))
}));
