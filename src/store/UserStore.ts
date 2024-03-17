import { create } from "zustand";

type Appointment = {
    id: string;
    location: string;
    fullName: string;
    phone: string;
    appointmentStatus: string;
    apptDateTime: Date
    appointmentType: string;
    callResult: string;
    description: string;
    practitionerNotes: string;
};

const initUserInfo: UserInterface = {
    _id: "",
    appleId: "",
    email: "",
    fullName: "",
    firstRun: false,
    isLoggedIn: false,
    appointmentHistory: [],
    nextAppointment: undefined,
    rotationPlan: {
        mode: 0,
        wakeTime: "07:00 AM",
        sleepTime: "11:00 PM",
        isConfirm: false,
        alarms: [],
        plan: 0,
        programStartDate: new Date(),
        programDays: 14
    },
    weightLogs: {
        target: 0,
        logs: []
    }
};

export interface UserInterface {
    _id: string;
    appleId: string;
    email: string;
    fullName: string;
    firstRun: boolean;
    isLoggedIn: boolean;
    nextAppointment: Appointment | undefined;
    appointmentHistory: Appointment[];
    rotationPlan: {
        plan: number;
        mode: number;
        wakeTime: string;
        sleepTime: string;
        isConfirm: boolean;
        alarms: any[],
        programStartDate: Date;
        programDays: number;
    },
    weightLogs: {
        target: Number,
        logs: any[]
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
