import React, {useState, useEffect} from "react";
import { Box, ButtonText, ChevronLeftIcon, Divider, HStack, Heading, Icon, ScrollView, Text, VStack, View, Button } from "@gluestack-ui/themed";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/data";
import { updateUserinfo } from "../../api/userAPI";
import { useUserInfoStore } from "../../store/UserStore";
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
    const { userInfo: initialUserInfo, setUserInfo } = useUserInfoStore();
    const toast = useToastr();
    const [userInfo, setLocalUserInfo] = useState(initialUserInfo);
    const [isLoading, setIsLoading] = useState(false);

    const clickFinish = async () => {
        setIsLoading(true);
        const result = await updateUserinfo({ ...initialUserInfo, isFinishInterview: true });
        if (result.success) {
            setUserInfo({ ...result.data });
            setIsLoading(false);
            
            // update the food plan flag
            await updateStoreDataFlag("planFlag", "update");
        } else {
            setIsLoading(false);;
        }
    }

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
                    <Divider mt={6} />
                    <FinalSocialDays />
                    <Divider mt={6} />
                    <GEmotionalStep finalStep={true} />
                    <Divider />
                    <FinalPersonalPreference />
                    <Divider mt={6} />
                    <FinalAllergies />
                </VStack>
            </ScrollView>
            <Box 
                display="flex" 
                flexDirection="row-reverse" 
                justifyContent="space-between" 
                alignItems="center"
                px="$4"
            >
                <SpinnerButton
                    isLoading={isLoading}
                    size="sm" 
                    onPress={clickFinish}
                >
                    <ButtonText>
                        {isLoading ? "Loading..." : "Save"}
                    </ButtonText>
                </SpinnerButton>
            </Box>
        </View>
    );
}

export default SettingScreen;