import { View, HStack, Icon, ChevronLeftIcon, Text, VStack, Heading } from "@gluestack-ui/themed";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/data";
import AccountInformation from "./components/AccountInformation";
import OtherContent from "./components/OtherContent";

type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, "Profile">;
const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {

    const goToSection = (url: string) => {
        navigation.navigate(url);
    }

    return (
        <View display="flex" h="$full" backgroundColor="$backgroundDefault">
            <HStack p="$4" alignItems="center"><Icon as={ChevronLeftIcon} m="$1" w="$4" h="$4" size="sm" /><Text onPress={() => navigation.goBack()}>Back</Text></HStack>

            <View p="$4">
                <VStack>
                    <AccountInformation />

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