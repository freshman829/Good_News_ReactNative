import { ChevronLeftIcon, HStack, Icon, Text, View } from "@gluestack-ui/themed";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/data";
import Stepper from "react-native-stepper-ui";
import { useState } from "react";
import AWelcomeStep from "./Steps/AWelcomeStep";
import BDailyFoodStep from "./Steps/BDailyFoodStep";
import CPreferStep from "./Steps/CPreferStep";
import DAllergyStep from "./Steps/DAllergyStep";
import GEmotionalStep from "./Steps/GEmotionalStep";

type TimeToEatProps = NativeStackScreenProps<
    RootStackParamList,
    "WhenToEat"
>;
const MyComponent = (test: string) => {
    return (
        <View>
            <Text>{test}</Text>
        </View>
    );
};

const content = [
    <AWelcomeStep />,
    <BDailyFoodStep />,
    <CPreferStep />,
    <DAllergyStep />,
    <GEmotionalStep />
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
            <Stepper
                active={active}
                content={content}
                onBack={goBefore}
                onNext={goToNext}
                onFinish={() => console.log("finish")}
            />
        </View>
    );
}

export default TimeToEat;