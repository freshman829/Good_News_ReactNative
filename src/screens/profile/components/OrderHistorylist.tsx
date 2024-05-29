import { View } from "@gluestack-ui/themed";
import { OrderHistory } from "../../../types/data";
import OrderHistoryItem from "../../../components/profile/OrderHistoryItem";

interface OrderHistorylistProps {
    orders: OrderHistory[];
};
const OrderHistorylist: React.FC<OrderHistorylistProps> = ({ orders }) => {

    return (
        <View p="$4">
            {orders.map((order, index) => 
                <OrderHistoryItem order={order} key={index}/>
            )}
        </View>
    )
};

export default OrderHistorylist;