import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/data";
import { View } from "@gluestack-ui/themed";
import CenterGoBack from "../../components/common/CenterGoBack";
import { useColorScheme } from "react-native";

type ComeSeeUsScreenProps = NativeStackScreenProps<RootStackParamList, "ComeSeeUs">;
const ComeSeeUsScreen: React.FC<ComeSeeUsScreenProps> = ({ navigation }) => {
    const isDarkMode = useColorScheme() === 'dark';

    return (
        <View display="flex" h="$full" backgroundColor={isDarkMode ? "#1C1C1E" : "#FFFFFF"}>
            <View p="$4">
                <CenterGoBack navigation={navigation} title="Come See Us" />
            </View>

        </View>
    )
};

export default ComeSeeUsScreen;