import { HStack, Icon, Text, ChevronLeftIcon } from "@gluestack-ui/themed";
import { TouchableOpacity } from "react-native";

interface CenterGoBackProps {
    navigation: any;
    title: string
}

const CenterGoBack: React.FC<CenterGoBackProps> = ({ navigation, title }) => {
    return (
        <TouchableOpacity
            onPress={() => navigation.goBack()}
        >
            <HStack justifyContent="center">
                <Icon as={ChevronLeftIcon} m="$1" w="$5" h="$5" size="sm"/>
                <HStack w="$full" justifyContent="center" alignItems="center" ml={-20}>
                    <Text 
                        fontWeight="$bold"
                        fontSize="$lg"
                    >
                        {title}
                    </Text>
                </HStack>
            </HStack>
        </TouchableOpacity>
    );  
};

export default CenterGoBack;