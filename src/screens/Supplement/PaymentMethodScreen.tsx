import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/data";
import { CircleIcon, Radio, RadioGroup, RadioIcon, RadioIndicator, RadioLabel, VStack, View } from "@gluestack-ui/themed";
import CenterGoBack from "../../components/common/CenterGoBack";
import { useState } from "react";
import { PAYMENT_METHOD } from "../../constants/common";
import FabButton from "../../components/common/FabButton";

type PaymentMethodScreenProps = NativeStackScreenProps<RootStackParamList, "PaymentMethod">;

const PaymentMethodScreen: React.FC<PaymentMethodScreenProps> = ({ navigation }) => {
    const [values, setValues] = useState<string>(PAYMENT_METHOD.GOOGLE);
    return (
        <View display="flex" h="$full" backgroundColor="$backgroundDefault">
            <View p="$4">
                <CenterGoBack navigation={navigation} title="Payment Method" /> 
            </View>

            <View>
                <RadioGroup>
                    <VStack p="$5" gap="$4">
                        <View borderRadius="$lg" w="$full" $dark-backgroundColor="$backgroundDark900" backgroundColor="$textLight50" borderColor="$textLight200" p="$10">
                            <Radio value={PAYMENT_METHOD.GOOGLE}>
                                <RadioIndicator>
                                    <RadioIcon as={CircleIcon} />
                                </RadioIndicator>
                                <RadioLabel ml="$5">Google Pay</RadioLabel>
                            </Radio>
                        </View>
                        <View borderRadius="$lg" w="$full" $dark-backgroundColor="$backgroundDark900" backgroundColor="$textLight50" borderColor="$textLight200" p="$10">
                            <Radio value={PAYMENT_METHOD.APPLE}>
                                <RadioIndicator>
                                    <RadioIcon as={CircleIcon} />
                                </RadioIndicator>
                                <RadioLabel ml="$5">Apple Pay</RadioLabel>
                            </Radio>
                        </View>
                    </VStack>
                </RadioGroup>
            </View>
            <FabButton buttonText="Continue" onPress={() => navigation.navigate("OrderSummary")} />
            
        </View>
    );
};

export default PaymentMethodScreen;