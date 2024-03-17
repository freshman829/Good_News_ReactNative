export type RootStackParamList = {
    Home: undefined,
    RotationSchedule: undefined,
    ComeSeeUs: undefined,
    TimeToEat: undefined,
    GoalWeightScreen: undefined,
    HowCanWeHelp: undefined,
    KidsCorner: undefined,
    WhenToEat: undefined
};

export interface CreateNewTargetProps {
    id: string,
    value: {
        target: number,
        log: { weight: number, date: Date }
    }
};