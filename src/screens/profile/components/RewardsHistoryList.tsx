import { View } from "@gluestack-ui/themed";
import { Rewards } from "../../../types/data";
import RewardsHistoryItem from "../../../components/profile/RewardsHistoryItem";

interface RewardsHistoryListProps {
    rewardsHistory: Rewards[];
};
const RewardsHistoryList: React.FC<RewardsHistoryListProps> = ({ rewardsHistory }) => {

    return (
        <View px="$4" py="$2">
            {rewardsHistory.map((reward, index) => 
                <RewardsHistoryItem key={index} reward={reward} />
            )}
        </View>
    )
};

export default RewardsHistoryList;