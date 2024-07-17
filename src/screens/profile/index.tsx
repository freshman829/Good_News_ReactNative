import { useState } from "react";
import { View, HStack, Icon, ChevronLeftIcon, Text, VStack, Heading } from "@gluestack-ui/themed";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/data";
import AccountInformation from "./components/AccountInformation";
import OtherContent from "./components/OtherContent";
import CenterGoBack from "../../components/common/CenterGoBack";
import { generateReferralCode } from "../../api/referFriendAPI";
import { useUserInfoStore } from "../../store/UserStore";
// import { Share } from "react-native";
import Share from 'react-native-share';
import { useToastr } from "../../providers/ToastProvider";

type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, "Profile">;
const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
    const {userInfo} = useUserInfoStore();
    const toast = useToastr();
    const [referEmail, setReferEmail] = useState<string>("");
    const [referCode, setReferCode] = useState<string>("");

    const goToSection = (url: string) => {
        if (url == "Refer") {
            handleReferAction();
        } else {
            navigation.navigate(url);
        }
    };

    const handleGenerateReferCode = async (userEmail: string) => {
        try {
            await generateReferralCode(referEmail, userInfo._id);   
        } catch (error) {
            
        }
    };

    const handleReferAction = async () => {
        try {
            const shareOptions = {
                title: 'Share via Email',
                subject: 'Check out this awesome app!',
                message: 'Here is some content I wanted to share with you.',
                social: Share.Social.EMAIL
            };
              
            await Share.open(shareOptions);
            toast?.showToast({ title: "success", message: "Content shared successfully!", options: 'success' });
        } catch (error) {
            toast?.showToast({ title: "error", message: "There was an error sharing the content.", options: 'error' });
        }
    };

    return (
        <View display="flex" h="$full" backgroundColor="$backgroundDefault">
            <View p="$4">
                <CenterGoBack navigation={navigation} title="Profile" />
            </View>

            <View p="$4">
                <VStack>
                    <AccountInformation fullName=""/>

                    <View mt="$5">
                        <Heading fontSize="$md">Others</Heading>

                        <OtherContent onClick={goToSection}/>
                    </View>
                </VStack>
            </View>
        </View>
    )
};

export default ProfileScreen;