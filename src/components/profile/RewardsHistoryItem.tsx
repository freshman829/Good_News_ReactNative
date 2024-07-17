import { Badge, BadgeText, CalendarDaysIcon, Card, Divider, HStack, Icon, Text, View } from "@gluestack-ui/themed"
import {  Rewards } from "../../types/data";
import { formatDate, formatNumber } from "../../utils/common";
import { PARSE_REWARD_TYPE } from "../../constants/common";

interface RewardsHistoryItemProps {  
    reward: Rewards;
};
const RewardsHistoryItem: React.FC<RewardsHistoryItemProps> = ({ reward }) => {

    return (
        <Card
            w="$full"
            px="$4"
            py="$2"
            borderRadius="$lg"
            mt="$4"
            borderColor="$textLight200"
            borderWidth={1}
            gap="$1"
        >
            <HStack justifyContent="space-between">
                <Text size="md">{PARSE_REWARD_TYPE[reward.reason]}</Text>
                <Text color="grey">amount: {formatNumber(reward.amount, 2, true, false, false, true)}</Text>
            </HStack>
            <Divider />
            <HStack alignItems="center" gap="$2">
                <Icon as={CalendarDaysIcon} size="sm" />
                <Text size="sm">{formatDate(reward.createdAt)}</Text>
            </HStack>
        </Card>
    )
};

export default RewardsHistoryItem;