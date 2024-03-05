import { create } from "zustand";

const initUserInfo: UserInterface = {
    appleId: "",
    email: "",
    fullName: "",
    firstTimeRun: true,
    isLoggedIn: false,
    mode: 0,
    wakeTime: new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate(), 7, 0, 0),
    sleepTime: new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate(), 22, 0, 0),
    isConfirm: false,
    alarms: [],
    plan: 0,
    programStartDate: new Date(),
    programDays: 14
};

export interface UserInterface {
    appleId: string;
    email: string;
    fullName: string;
    firstTimeRun: boolean;
    isLoggedIn: boolean;
    plan: number;
    mode: number;
    wakeTime: Date;
    sleepTime: Date;
    isConfirm: boolean;
    alarms: any[],
    programStartDate: Date;
    programDays: number;
}

interface UserState {
    userInfo: UserInterface;
    setUserInfo: (into: UserInterface) => void;
}

export const useUserInfoStore = create<UserState>((set) => ({
    userInfo: initUserInfo,
    setUserInfo: (info) => set((state) => ({ userInfo: info }))
}));
