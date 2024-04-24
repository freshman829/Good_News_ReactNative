import { Box, Divider, Heading, VStack } from "@gluestack-ui/themed";
import GEmotionalStep from "./GEmotionalStep";
import FinalPersonalPreference from "./components/FinalPersonalPreference";
import FinalAllergies from "./components/FinalAllergies";
import FinalOtherPreferences from "./components/FinalOtherPreferences";
import FinalSocialDays from "./components/FinalSocialDays";
import FinalGoals from "./components/FinalGoals";
import FinalWeight from "./components/FinalWeight";


const HFinalStep = () => {

    return (
        <Box>
            <Heading>
                Confirmation of Choices
            </Heading>
            <Box>
                <GEmotionalStep finalStep={true}/>
                <Divider />
                <FinalPersonalPreference />
                <Divider mt={6}/>
                <FinalAllergies />
                <Divider mt={6}/>
                <FinalOtherPreferences />
                <Divider mt={6}/>
                <FinalSocialDays />
                <Divider mt={6}/>
                <FinalGoals />
                <Divider mt={6}/>
                <FinalWeight />
            </Box>
        </Box>
    )
}

export default HFinalStep;

