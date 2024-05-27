import { NativeStackScreenProps } from "@react-navigation/native-stack";
// import { AllowedCardAuthMethodsType, AllowedCardNetworkType, GooglePay } from 'react-native-google-pay';
import { RootStackParamList } from "../../types/data";
import { View, ScrollView } from "@gluestack-ui/themed";
import CenterGoBack from "../../components/common/CenterGoBack";
import FabButton from "../../components/common/FabButton";
import OrderSummaryList from "./components/OrderSummaryList";
import { useStripe, StripeProvider } from "@stripe/stripe-react-native";
import { useEffect, useState } from "react";
import { fetchGooglePaymentSheet } from "../../api/googlePayAPI";

type OrderSummaryScreenProps = NativeStackScreenProps<RootStackParamList, "OrderSummary">;

const OrderSummaryScreen: React.FC<OrderSummaryScreenProps> = ({ navigation }) => {
    // const allowedCardNetworks: AllowedCardNetworkType[] = ['VISA', 'MASTERCARD'];
    // const allowedCardAuthMethods: AllowedCardAuthMethodsType[] = ['PAN_ONLY', 'CRYPTOGRAM_3DS'];
    const [showButton, setShowButton] = useState(false);
    const [Loading, setLoading] = useState(false);
    const { confirmPayment, initPaymentSheet, presentPaymentSheet } = useStripe();

    const fetchPaymentSheetParams = async () => {
        const response = await fetchGooglePaymentSheet();
        if (response.success) {
            return response.data;
        } else {
            return null;
        }
    };

    const initializePaymentSheet = async () => {
        const {
            paymentIntent,
            ephemeralKey,
            customer,
            publishableKey,
        } = await fetchPaymentSheetParams();

        const { error } = await initPaymentSheet({
            paymentIntentClientSecret: paymentIntent,
            customFlow: true,
            customerEphemeralKeySecret: ephemeralKey,
            customerId: customer,
            allowsDelayedPaymentMethods: true,
            paymentMethodOrder: ['card'],
            style: 'alwaysDark',
            merchantDisplayName: 'Example Inc.',
        });

        if (!error) {
            setLoading(true);
        }

    }
    
    useEffect(() => {
        // initializePaymentSheet();
    }, [])
    const handlePay = async () => {
        // const {error} = await presentPaymentSheet();

        // if (error) {
        //     console.log("presentError::", error);
        // }

        navigation.navigate("OrderSuccess");
    }


    const handleApplePay = () => {
    }

    return (
        <StripeProvider
            publishableKey="pk_test_TYooMQauvdEDq54NiTphI7jx"
            urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
            merchantIdentifier="merchant.com.{{YOUR_APP_NAME}}" // required for Apple Pay
        >
            <View display="flex" h="$full" backgroundColor="$backgroundDefault">
                <View p="$4">
                    <CenterGoBack navigation={navigation} title="Order Summary" />
                </View>
                <ScrollView h="$full">
                    <OrderSummaryList />
                </ScrollView>
                <FabButton buttonText="Confirm Payment" onPress={handlePay} />
            </View>
        </StripeProvider>
    );
};

export default OrderSummaryScreen;