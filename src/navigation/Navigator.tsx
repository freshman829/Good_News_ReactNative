import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/data";
import LandingPage from "../screens/landing/LandingPage";
import RotationScheduleScreen from "../screens/rotationSchedule/RotationScheduleScreen";
import GoalWeightScreen from "../screens/goalWeight/GoalWeightScreen";
import TimeToEat from "../screens/timeToEat/TimeToEat";
import FoodPlanScreen from "../screens/FoodPlan/FoodPlanScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import SupplementListScreen from "../screens/Supplement";
import SupplementDetailScreen from "../screens/Supplement/DetailScreen";
import BasketScreen from "../screens/Supplement/BasketScreen";
import PaymentMethodScreen from "../screens/Supplement/PaymentMethodScreen";
import OrderSummaryScreen from "../screens/Supplement/OrderSummaryScreen";
import OrderSuccessScreen from "../screens/Supplement/OrderSuccessScreen";

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
            <Stack.Screen name="FoodPlan" component={FoodPlanScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Supplement" component={SupplementListScreen} />
            <Stack.Screen name="SupplementDetail" component={SupplementDetailScreen} />
            <Stack.Screen name="Basket" component={BasketScreen} />
            <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
            <Stack.Screen name="OrderSummary" component={OrderSummaryScreen} />
            <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
        </Stack.Navigator>
    )
}

export default StackNavigator;