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

type ProfileScreenProps = NativeStackScreenProps<
    RootStackParamList,
    "Profile"
>;

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
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
        <View p="$4" display="flex" h="$full" backgroundColor="$backgroundDefault">
            <HStack alignItems="center"><Icon as={ChevronLeftIcon} m="$1" w="$4" h="$4" size="sm" /><Text onPress={() => navigation.goBack()}>Back</Text></HStack>
            
            <ScrollView flex={1} p="$3" mb="$1">
                <Heading>
                    Profile
                </Heading>
                <VStack mb="$8">
                    <EditNameSection fullName={userInfo.fullName} />
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

export default ProfileScreen;