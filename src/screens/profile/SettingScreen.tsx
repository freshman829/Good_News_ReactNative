import React, {useState, useEffect} from "react";
import { Box, ButtonText, ChevronLeftIcon, Divider, HStack, Heading, Icon, ScrollView, Text, VStack, View, Button } from "@gluestack-ui/themed";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/data";
import { updateUserinfo } from "../../api/userAPI";
import { initUserSettingInfo, useUserInfoStore } from "../../store/UserStore";
import { useToastr } from "../../providers/ToastProvider";
import GEmotionalStep from "../timeToEat/Steps/GEmotionalStep";
import FinalPersonalPreference from "../timeToEat/Steps/components/FinalPersonalPreference";
import FinalAllergies from "../timeToEat/Steps/components/FinalAllergies";
import FinalGoals from "../timeToEat/Steps/components/FinalGoals";
import FinalSocialDays from "../timeToEat/Steps/components/FinalSocialDays";
import FinalWeight from "../timeToEat/Steps/components/FinalWeight";
import EditNameSection from "./components/EditNameSection";
import SpinnerButton from "../../components/common/SpinnerButton";
import { updateStoreDataFlag } from "../../utils/common";
import CenterGoBack from "../../components/common/CenterGoBack";

type SettingScreenProps = NativeStackScreenProps<
    RootStackParamList,
    "Setting"
>;

const SettingScreen: React.FC<SettingScreenProps> = ({ navigation }) => {
    const { userInfo, setUserInfo } = useUserInfoStore();
    const toast = useToastr();
    const [isLoading, setIsLoading] = useState(false);
    const [isFinishLoading, setIsFinishLoading] = useState(false);

    const clickFinish = async () => {
        setIsFinishLoading(true);
        const result = await updateUserinfo({ ...userInfo, isFinishInterview: true });
        if (result.success) {
            setUserInfo({ ...result.data });
            setIsFinishLoading(false);
            
            // update the food plan flag
            await updateStoreDataFlag("planFlag", "update");
        } else {
            setIsFinishLoading(false);;
        }
    }

    const handleReset = async () => {
        setIsLoading(true);
        const result = await updateUserinfo({ ...initUserSettingInfo, _id: userInfo._id });
        console.log("initUserSettingInfo", result)
        if (result.success) {
            setUserInfo({ ...result.data });
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    };

    return (
        <View display="flex" pb="$4" h="$full" backgroundColor="$backgroundDefault">
            <View p="$4">
                <CenterGoBack navigation={navigation} title="Setting" />
            </View>
            
            <ScrollView flex={1} mb="$1" px="$6">
                <VStack mb="$8">
                    <FinalGoals />
                    <Divider mt={6} />
                    <FinalWeight />
                    <Divider mt={11} />
                    <FinalSocialDays />
                    <Divider mt={6} />
                    <GEmotionalStep finalStep={true} />
                    <Divider />
                    <FinalPersonalPreference />
                    <Divider mt={6} />
                    <FinalAllergies />
                </VStack>
            </ScrollView>
            <HStack justifyContent="space-between">
                <Box 
                    alignItems="center"
                    px="$4"
                >
                    <SpinnerButton
                        isLoading={isLoading}
                        size="sm" 
                        onPress={handleReset}
                    >
                        <ButtonText>
                            {isLoading ? "Loading..." : "Reset"}
                        </ButtonText>
                    </SpinnerButton>
                </Box>
                <Box 
                    alignItems="center"
                    px="$4"
                >
                    <SpinnerButton
                        isLoading={isFinishLoading}
                        size="sm" 
                        onPress={clickFinish}
                    >
                        <ButtonText>
                            {isLoading ? "Loading..." : "Save"}
                        </ButtonText>
                    </SpinnerButton>
                </Box>
            </HStack>
        </View>
    );
}

export default SettingScreen;