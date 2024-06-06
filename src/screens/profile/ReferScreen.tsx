import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/data";
import { View } from "@gluestack-ui/themed";
import CenterGoBack from "../../components/common/CenterGoBack";

type ReferScreenProps = NativeStackScreenProps<RootStackParamList, "Refer">;

const ReferScreen: React.FC<ReferScreenProps> = ({ navigation }) => {
    
    return (
        <View display="flex" h="$full" backgroundColor="$backgroundDefault">
            <View p="$4">
                <CenterGoBack navigation={navigation} title="Refer Friend" /> 
            </View>
        </View>
    )
};

export default ReferScreen;