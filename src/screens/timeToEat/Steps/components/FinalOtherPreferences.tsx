import { Box, Heading, VStack } from "@gluestack-ui/themed";
import CustomSelect from "../../../../components/CustomSelect";
import { useUserInfoStore } from "../../../../store/UserStore";

const FinalOtherPreferences = () => {
    const {userInfo, setUserInfo} = useUserInfoStore();

    const SelectPrefer = (value: string) => {
        if (value === "SN" || value === "FV")
            setUserInfo({ ...userInfo, prefer: value });
    }
    return (
        <Box mt={16}>
            <VStack>
                <Heading size="sm">
                    Other Preferences and Info
                </Heading>
                <CustomSelect
                    value={userInfo.prefer}
                    options={[
                        { value: "SP", label: "Prefer Single-Protein" },
                        { value: "FV", label: "Prefer Fruits & Vegetables" }
                    ]}
                    onSelect={(value: string) => SelectPrefer(value)}
                />
            </VStack>
        </Box>
    )
}

export default FinalOtherPreferences;