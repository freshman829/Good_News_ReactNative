import { Badge, BadgeText, CalendarDaysIcon, Card, Divider, HStack, Icon, Text, View } from "@gluestack-ui/themed"
import { OrderHistory, OrderItem } from "../../types/data";
import { formatDate, formatNumber } from "../../utils/common";

interface OrderHistoryItemProps {  
    order: OrderHistory;
};
const OrderHistoryItem: React.FC<OrderHistoryItemProps> = ({ order }) => {

    let orderStatusText = "Pending";

    switch (order.status) {
        case 0:
            orderStatusText = "Pending";
            break;
        case 1:
            orderStatusText = "Success";
            break;
        case 2:
            orderStatusText = "Cancelled";
            break;
        case 3:
            orderStatusText = "Failed";
            break;
    
        default:
            orderStatusText = "Pending";
            break;
    }

    return (
        <Card
            w="$full"
            p="$4"
            borderRadius="$lg"
            mt="$4"
            borderColor="$textLight200"
            borderWidth={1}
            gap="$3"
        >
            <HStack justifyContent="space-between">
                <Text size="sm">ID: {order.orderNumber}</Text>
                <Text color="">Total: {formatNumber(order.total, 2, true, false, true, true)}</Text>
            </HStack>
            <HStack gap="$3">
                {order?.items.map((item: OrderItem, index) =>
                    <Badge key={index}>
                        <Text>
                            {item.name}
                        </Text>
                    </Badge>
                )}
            </HStack>
            <Divider />
            <HStack justifyContent="space-between">
                <HStack alignItems="center" gap="$2">
                    <Icon as={CalendarDaysIcon} size="sm" />
                    <Text size="sm">{formatDate(order.orderDate)}</Text>
                </HStack>
                <Badge>
                    <BadgeText>
                        {orderStatusText}
                    </BadgeText>
                </Badge>
            </HStack>
        </Card>
    )
};

export default OrderHistoryItem;