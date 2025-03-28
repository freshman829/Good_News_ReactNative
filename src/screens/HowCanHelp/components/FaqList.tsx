import { View } from "@gluestack-ui/themed";
import { Faq } from "../../../types/faq";
import FaqItem from "../../../components/howcanhelp/FaqItem";

interface FaqListProps {
    faqs: Faq[];
};
const FaqList: React.FC<FaqListProps> = ({ faqs }) => {

    return (
        <View px="$4">
            {faqs.map((faq, index) => {
                return (
                    <FaqItem faq={faq} key={index}/>
                )
            })}
        </View>
    );
}

export default FaqList;