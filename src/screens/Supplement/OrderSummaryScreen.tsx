import { NativeStackScreenProps } from "@react-navigation/native-stack";
// import { AllowedCardAuthMethodsType, AllowedCardNetworkType, GooglePay } from 'react-native-google-pay';
import { RootStackParamList } from "../../types/data";
import { View, ScrollView } from "@gluestack-ui/themed";
import CenterGoBack from "../../components/common/CenterGoBack";
import FabButton from "../../components/common/FabButton";
import OrderSummaryList from "./components/OrderSummaryList";
import { useStripe, StripeProvider } from "@stripe/stripe-react-native";
import { useEffect, useState } from "react";
import { Supplement } from "../../types/supplement";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchGooglePaymentSheet } from "../../api/googlePayAPI";
import { ORDER_STATUS } from "../../constants/common";
import { createOrder } from "../../api/orderAPI";

type OrderSummaryScreenProps = NativeStackScreenProps<RootStackParamList, "OrderSummary">;

const OrderSummaryScreen: React.FC<OrderSummaryScreenProps> = ({ navigation }) => {
    // const allowedCardNetworks: AllowedCardNetworkType[] = ['VISA', 'MASTERCARD'];
    // const allowedCardAuthMethods: AllowedCardAuthMethodsType[] = ['PAN_ONLY', 'CRYPTOGRAM_3DS'];
    const [showButton, setShowButton] = useState(false);
    const [Loading, setLoading] = useState(false);
    const { confirmPayment, initPaymentSheet, presentPaymentSheet } = useStripe();

    const [basket, setBasket] = useState<Supplement[]>([]);
    const [amounts, setAmounts] = useState<{ [key: string]: number }>({});
    const [totalPrice, setTotalPrice] = useState<number>(0);

    useEffect(() => {
        const getBasket = async () => {
            const basket = await AsyncStorage.getItem("basket");
            if (basket !== null) {
                setBasket(JSON.parse(basket));
            }
        }
        getBasket();
    }, []);

    useEffect(() => {
        const getAmounts = async () => {
            const amounts: { [key: string]: number } = {};
            for (const item of basket) {
              const amount = await AsyncStorage.getItem(`${item._id}-amount`);
              if (amount !== null) {
                amounts[item._id] = parseInt(amount);
              }
            }
            setAmounts(amounts);
        };
        if (basket.length > 0) {
            getAmounts();
        }
    }, [basket]);

    useEffect(() => {
        if (Object.keys(amounts).length > 0) {
            let total_price = 0;
            for (const item of basket) {
                total_price += item.price * amounts[item._id];
            }
            setTotalPrice(total_price);
        }
    }, [amounts])

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

        if (basket.length > 0) { 
            await handleStoreOrder();
        }
    }

    const handleStoreOrder = async () => {
        const orderNumber = Math.floor(Math.random() * 1000000) + 1;
        const items = basket.map((item: Supplement) => {
            return {
                itemId: item._id,
                name: item.name,
                amount: amounts[item._id],
                price: item.price,
            }
        });
        const payload = {
            orderNumber: orderNumber.toString(),
            status: ORDER_STATUS.SUCCESS,
            total: totalPrice,
            items: items,
        }
        try {
            const result = await createOrder(payload);
            if (result.success) {
                await AsyncStorage.removeItem("basket");
                for (const item of basket) {
                    await AsyncStorage.removeItem(`${item._id}-amount`);
                }
                setBasket([]);
                setTotalPrice(0);
                navigation.navigate("OrderSuccess");
            }
        } catch (error) {
            
        }
    };


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
                    <OrderSummaryList basket={basket} amounts={amounts} totalPrice={totalPrice} />
                </ScrollView>
                <FabButton buttonText="Confirm Payment" onPress={handlePay} />
            </View>
        </StripeProvider>
    );
};

export default OrderSummaryScreen;