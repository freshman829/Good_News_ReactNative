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

type ProfileScreenProps = NativeStackScreenProps<
    RootStackParamList,
    "Profile"
>;

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
    const { userInfo: initialUserInfo, setUserInfo } = useUserInfoStore();
    const toast = useToastr();
    const [userInfo, setLocalUserInfo] = useState(initialUserInfo);
    const [isDisable, setIsDisable] = useState(true);

    useEffect(() => {
        if (JSON.stringify(userInfo) === JSON.stringify(initialUserInfo)) setIsDisable(true);
        else setIsDisable(false);
    }, [initialUserInfo]) 

    const clickFinish = async () => {
        const result = await updateUserinfo({ ...initialUserInfo, isFinishInterview: true });
        if (result.success) {
            setUserInfo({ ...result.data });
            setIsDisable(true);
        } else {
            toast?.showToast({ title: "error", message: result.msg, options: 'error' });
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
                <Button 
                    action="primary" 
                    variant="solid" 
                    size="sm" 
                    isDisabled={isDisable} 
                    onPress={clickFinish}
                >
                    <ButtonText>
                        Finish
                    </ButtonText>
                </Button>
            </Box>
        </View>
    );
}

export default ProfileScreen;