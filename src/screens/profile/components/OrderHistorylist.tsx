import { View } from "@gluestack-ui/themed";
import { Order } from "../../../types/data";
import OrderHistoryItem from "../../../components/profile/OrderHistoryItem";

interface OrderHistorylistProps {
    orders: Order[];
};
const OrderHistorylist: React.FC<OrderHistorylistProps> = ({ orders }) => {

    return (
        <View px="$4" py="$2">
            {orders.map((order, index) => 
                <OrderHistoryItem order={order} key={index}/>
            )}
        </View>
    )
};

export default OrderHistorylist;