import { Card, Text } from "@gluestack-ui/themed";
import { useState } from "react";
import { numberUtil } from "../../../utils";
import { TouchableOpacity } from "react-native";

const humors: string[] = [
    "Good news: You woke up, which means you're alive!",
    "Good news: The world hasn't ended yet.",
    "Good news: Your problems are only as real as you think they are.",
    "Good news: We're all in the same sinking boat.",
    "Rejoice! You've survived another day on this chaotic planet.",
    "Good news: The world is still spinning... for now.",
    "Celebration News: You've made it through another 24 hours of existential dread.",
    "Good News: You're one day closer to the sweet release of oblivion.",
    "On the bright side, nobody really knows what they're doing either.",
    "Good news: At least you're not a cat stuck in a tree... yet."
];
const GreetingSection: React.FC = () => {
    const [selected, setSelect] = useState<number>(numberUtil.getRandomNumber(humors.length));

    const selectRandomHumor = () => {
        setSelect(numberUtil.getRandomNumber(humors.length));
    }

    return (
        <TouchableOpacity onPress={selectRandomHumor}>
            <Card variant="elevated" bg="$blue500">
                <Text color="white">{humors[selected]}</Text>
            </Card>
        </TouchableOpacity>
    );
}

export default GreetingSection;