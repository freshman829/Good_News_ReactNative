import { HStack, VStack, View, Image, Text, ChevronRightIcon, Icon, Divider } from "@gluestack-ui/themed"
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types/data";
import { TouchableOpacity } from "react-native";


interface OtherContentProps {
    onClick: (url: string) => void;
};

const OtherContent: React.FC<OtherContentProps> = ({ onClick }) => {

    return (
        <View borderRadius="$lg" mt="$4" w="$full" $dark-backgroundColor="$backgroundDark900" backgroundColor="$textLight50" borderColor="$textLight200" p="$4">
            <VStack gap="$4">
                <TouchableOpacity onPress={() => onClick("Setting")}>
                    <HStack justifyContent="space-between" alignItems="center">
                        <HStack gap="$4" alignItems="center">
                            <Image source={require("../../../assets/icon/settings_icon.png")} w="$5" h="$5" borderRadius={10} alt=""/> 
                            <Text>Settings</Text>
                        </HStack>
                        <Icon as={ChevronRightIcon} />
                    </HStack>
                </TouchableOpacity>
                <Divider />
                <TouchableOpacity onPress={() => onClick("OrderHistory")}>
                    <HStack justifyContent="space-between" alignItems="center">
                        <HStack gap="$4" alignItems="center">
                            <Image source={require("../../../assets/icon/order_icon.png")} w="$5" h="$5" borderRadius={10} alt=""/> 
                            <Text>Order History</Text>
                        </HStack>
                        <Icon as={ChevronRightIcon} />
                    </HStack>
                </TouchableOpacity>
                <Divider />
                <TouchableOpacity onPress={() => onClick("Membership")}>
                    <HStack justifyContent="space-between" alignItems="center">
                        <HStack gap="$4" alignItems="center">
                            <Image source={require("../../../assets/icon/account_icon.png")} w="$5" h="$5" borderRadius={10} alt=""/> 
                            <Text>Membership</Text>
                        </HStack>
                        <Icon as={ChevronRightIcon} />
                    </HStack>
                </TouchableOpacity>
            </VStack>
        </View>
    )
};


export default OtherContent;