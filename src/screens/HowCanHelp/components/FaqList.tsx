import { View } from "@gluestack-ui/themed";
import { Faq } from "../../../types/faq";
import FaqItem from "../../../components/howcanhelp/FaqItem";

interface FaqListProps {
    faqs: Faq[];
};
const FaqList: React.FC<FaqListProps> = ({ faqs }) => {

    return (
        <View mt="$4">
            {faqs.map((faq) => {
                return (
                    <FaqItem faq={faq} />
                )
            })}
        </View>
    );
}

export default FaqList;