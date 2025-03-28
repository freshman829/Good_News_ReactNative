export type RootStackParamList = {
    Home: undefined,
    RotationSchedule: undefined,
    ComeSeeUs: undefined,
    TimeToEat: undefined,
    GoalWeightScreen: undefined,
    HowCanWeHelp: undefined,
    KidsCorner: undefined,
    WhenToEat: undefined,
    FoodPlan: undefined,
    Profile: undefined,
    OrderHistory: undefined,
    Setting: undefined,
    Supplement: undefined,
    SupplementDetail: undefined,
    Basket: undefined,
    PaymentMethod: undefined,
    OrderSummary: undefined,
    OrderSuccess: undefined,
    HowCanHelp: undefined,
    Contact: { message: string },
    Rewards: undefined,
    Refer: undefined,
};

export interface CreateNewTargetProps {
    id: string,
    value: {
        target: number,
        log: { weight: number, date: Date }
    }
};

export interface DayPlan {
    date: string,
    dayType: 'SP' | 'FV' | 'SD',
    foods: any[]
};

export interface OrderItem {
    itemId: string,
    name: string,
    amount: number,
    price: number
}

export interface Order {
    _id?: string,
    orderNumber: string,
    orderDate?: string,
    status: number,
    total: number,
    items: OrderItem[]
};

export interface Message {
    _id?: string,
    id: number,
    message: string,
    sent: boolean,
    repliedAt?: string
    createdAt: string,
};

export interface Office {
    _id: string,
    state: string,
    city: string
}

export interface Rewards {
    _id: string,
    amount: number,
    reason: number,
    createdAt: string
}