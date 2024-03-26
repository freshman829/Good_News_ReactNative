import { Box, Heading, VStack } from "@gluestack-ui/themed";
import CustomSelect from "../../../components/CustomSelect";
import { useUserInfoStore } from "../../../store/UserStore";

const CPreferStep = () => {
    const {userInfo, setUserInfo} = useUserInfoStore();

    const SelectPrefer = (value: string) => {
        if (value === "SN" || value === "FV")
            setUserInfo({ ...userInfo, prefer: value });
    }



    return (
        <Box>
            <VStack>
                <Heading color="$black"  color="$black">
                    Do you prefer Single-Protein Days or Fruits & Vegetables Days?
                </Heading>
                <CustomSelect
                    value={userInfo.prefer}
                    options={[
                        { value: "SP", label: "I Prefer Single-Protein Days" },
                        { value: "FV", label: "I Prefer Fruits & Vegetables Days" }
                    ]}
                    onSelect={(value: string) => SelectPrefer(value)}
                    my="$8"
                />
            </VStack>
        </Box>
    )
}

export default CPreferStep;