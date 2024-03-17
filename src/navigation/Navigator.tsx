import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/data";
import LandingPage from "../screens/landing/LandingPage";
import RotationScheduleScreen from "../screens/rotationSchedule/RotationScheduleScreen";
import GoalWeightScreen from "../screens/goalWeight/GoalWeightScreen";
import TimeToEat from "../screens/timeToEat/TimeToEat";

const Stack = createNativeStackNavigator<RootStackParamList>();

function StackNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="Home" component={LandingPage} />
            <Stack.Screen name="RotationSchedule" component={RotationScheduleScreen} />
            <Stack.Screen name="GoalWeightScreen" component={GoalWeightScreen} />
            <Stack.Screen name="WhenToEat" component={TimeToEat} />
            
        </Stack.Navigator>
    )
}

export default StackNavigator;