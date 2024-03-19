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
    healthCondition: [],
    socialDays: [],
    weightLogs: {
        target: 0,
        logs: []
    },
    dietToday: {
        eatSomthing: false,
        alternatives: false
    },
    female: false,
    dietaryRestrictions: {
        kosher: false,
        vegan: false,
        halal: false
    },
    prefer: "SN",
    allergies: {
        protein: [],
        fv: []
    },
    emotions: {
        depression: {
            status: false,
            severity: 0,
            updated: undefined
        },
        anxiety: {
            status: false,
            severity: 0,
            updated: undefined
        },
        stress: {
            status: false,
            severity: 0,
            updated: undefined
        },
        fatigue: {
            status: false,
            severity: 0,
            updated: undefined
        },
        insomnia: {
            status: false,
            severity: 0,
            updated: undefined
        }
    }
};

type healthCondition = {
    id: number,
    title: string,
    isActive: boolean
}

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
    healthCondition: healthCondition[],
    socialDays: any[],
    weightLogs: {
        target: number,
        logs: any[]
    },
    dietToday: {
        eatSomthing: boolean,
        alternatives: boolean
    },
    female: boolean,
    dietaryRestrictions: {
        kosher: boolean,
        vegan: boolean,
        halal: boolean
    },
    prefer: "SN" | "FV",
    allergies: {
        protein: string[],
        fv: string[]
    },
    emotions: {
        depression: {
            status: boolean,
            severity: number,
            updated?: Date
        },
        anxiety: {
            status: boolean,
            severity: number,
            updated?: Date
        },
        stress: {
            status: boolean,
            severity: number,
            updated?: Date
        },
        fatigue: {
            status: boolean,
            severity: number,
            updated?: Date
        },
        insomnia: {
            status: boolean,
            severity: number,
            updated?: Date
        }
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
