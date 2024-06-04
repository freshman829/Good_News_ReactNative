import { FlatList, View, Box, HStack, Text, Switch, ScrollView } from "@gluestack-ui/themed";
import { UserInterface } from "../../../store/UserStore";
import Notification from "../../../utils/Notification";
import { saveRotationSchedule } from "../../../api/userAPI";

interface AlamListProps {
    alarms: any[];
    userInfo: UserInterface;
    setUserInfo: (userInfo: UserInterface) => void;
}
const AlarmList: React.FC<AlamListProps> = ({ alarms, userInfo, setUserInfo }) => { 
    const AlarmItem = (item: any) => {
        return (
            <Box
                borderBottomWidth="$1"
                borderColor="$trueGray300"
                $dark-borderColor="$trueGray100"
                $base-pl="$0"
                $base-pr="$0"
                $sm-pl="$4"
                $sm-pr="$4"
                py="$2"
            >
                <HStack justifyContent="space-between">
                    <Text size="md" bold={item.item.isSpecial}>{item.item.time}</Text>
                    <Switch value={item.item.isActive} onChange={() => updateAlarm(item.item)} />
                </HStack>
            </Box>
        )
    };

    const updateAlarm = async (item: any) => {
        const updatedAlarms = userInfo.rotationPlan.alarms.map(alarm => 
          alarm.id === item.id ? { ...alarm, isActive: !alarm.isActive } : alarm
        );
        setUserInfo({ ...userInfo, rotationPlan: { ...userInfo.rotationPlan, alarms: updatedAlarms } });
        
        if (item.isActive) {
          await Notification.toggleNotification({ id: item.id });
        } else {
          await Notification.toggleNotification({
            id: item.id,
            reminder: item.isSpecial ? "It's special time to rotate" : "It's time to rotate",
            date: new Date(item.timeDate)
          });
        }
        await saveRotationSchedule({ ...userInfo, rotationPlan: { ...userInfo.rotationPlan, alarms: updatedAlarms } });
    };

    return (
        <View mt="$4" h="$72">
            <ScrollView>
                {alarms.length > 0 && alarms.map((alarm, index) => (
                        <AlarmItem key={index} item={alarm}/>
                    )
                )}
            </ScrollView>
        </View>
    )
};

export default AlarmList;