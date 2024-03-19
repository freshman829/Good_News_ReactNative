import { ChevronLeftIcon, HStack, Icon, Text, View } from "@gluestack-ui/themed";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/data";
import Stepper from "react-native-stepper-ui";
import { useState } from "react";
import AWelcomeStep from "./Steps/AWelcomeStep";
import EHealthConditionStep from "./Steps/EHealthConditionStep";
import FWeightStep from "./Steps/FWeightStep";
import BDailyFoodStep from "./Steps/BDailyFoodStep";
import CPreferStep from "./Steps/CPreferStep";
import DAllergyStep from "./Steps/DAllergyStep";
import GEmotionalStep from "./Steps/GEmotionalStep";
import HFinalStep from "./Steps/HFinalStep";
import CustomStepper from "../../components/CustomStepper";

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
    <GEmotionalStep finalStep={false}/>,
    <HFinalStep />
];

const TimeToEat: React.FC<TimeToEatProps> = ({ navigation }) => {
    const [active, setActive] = useState(0);

    const goBefore = () => {
        setActive((p) => p - 1)
    }

    const goToNext = () => {
        setActive((p) => p + 1);
    }

    return (
        <View p="$4" display="flex" h="$full">
            <HStack alignItems="center"><Icon color="$black" as={ChevronLeftIcon} m="$1" w="$4" h="$4" size="sm" /><Text style={{ color: 'black' }} onPress={() => navigation.goBack()}>Back</Text></HStack>
            {/* <Stepper
                active={active}
                content={content}
                onBack={goBefore}
                onNext={goToNext}
                onFinish={() => console.log("finish")}
            /> */}
            <CustomStepper 
                currentStep={active}
                contents={content}
                onNext={goToNext}
                onBefore={goBefore}
            />
        </View>
    );
}

export default TimeToEat;