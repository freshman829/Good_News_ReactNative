import { ChevronLeftIcon, HStack, Icon, Text, View } from "@gluestack-ui/themed";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/data";
import Stepper from "react-native-stepper-ui";
import { useEffect, useState } from "react";
import AWelcomeStep from "./Steps/AWelcomeStep";
import EHealthConditionStep from "./Steps/EHealthConditionStep";
import FWeightStep from "./Steps/FWeightStep";
import BDailyFoodStep from "./Steps/BDailyFoodStep";
import CPreferStep from "./Steps/CPreferStep";
import DAllergyStep from "./Steps/DAllergyStep";
import GEmotionalStep from "./Steps/GEmotionalStep";
import HFinalStep from "./Steps/HFinalStep";
import CustomStepper from "../../components/CustomStepper";
import { updateUserinfo } from "../../api/userAPI";
import { useUserInfoStore } from "../../store/UserStore";
import { useToastr } from "../../providers/ToastProvider";
import CenterGoBack from "../../components/common/CenterGoBack";
import { useColorScheme } from "react-native";

type TimeToEatProps = NativeStackScreenProps<
    RootStackParamList,
    "WhenToEat"
>;

const content = [
    <AWelcomeStep />,
    <BDailyFoodStep />,
    <CPreferStep />,
    <DAllergyStep />,
    <EHealthConditionStep />,
    <FWeightStep />,
    <GEmotionalStep finalStep={false} />,
    <HFinalStep />
];

const TimeToEat: React.FC<TimeToEatProps> = ({ navigation }) => {
    const { userInfo, setUserInfo } = useUserInfoStore();
    const [active, setActive] = useState(0);
    const toast = useToastr();
    const isDarkMode = useColorScheme() === 'dark';

    useEffect(() => {
        if (userInfo.isFinishInterview) {
            navigation.navigate("FoodPlan");
        }
    }, []);
    const goBefore = () => {
        setActive((p) => p - 1)
    }

    const goToNext = () => {
        setActive((p) => p + 1);
    }

    const goToFoodPlan = async () => {
        const result = await updateUserinfo({ ...userInfo, isFinishInterview: true });
        if (result.success) {
            setUserInfo({ ...result.data });
            navigation.navigate("FoodPlan");
        } else {
            // toast?.showToast({ title: "error", message: result.msg, options: 'error' });
        }
    }

    return (
        <View p="$4" w="$full" display="flex" h="$full" backgroundColor={isDarkMode ? "#1C1C1E" : "#FFFFFF"}>
            <View>
                <CenterGoBack navigation={navigation} title="Time To Eat" />
            </View>
            <CustomStepper
                currentStep={active}
                contents={content}
                onNext={goToNext}
                onBefore={goBefore}
                onFinish={goToFoodPlan}
            />
        </View>
    );
}

export default TimeToEat;