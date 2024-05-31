import { View, HStack, Icon, ChevronLeftIcon, Text, VStack, Heading } from "@gluestack-ui/themed";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/data";
import AccountInformation from "./components/AccountInformation";
import OtherContent from "./components/OtherContent";
import CenterGoBack from "../../components/common/CenterGoBack";

type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, "Profile">;
const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {

    const goToSection = (url: string) => {
        navigation.navigate(url);
    }

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