import { Input, InputField, InputIcon, InputSlot, SearchIcon } from "@gluestack-ui/themed";

interface SearchInputProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
};
const SearchInput: React.FC<SearchInputProps> = ({ value, onChangeText, placeholder = "Search..." }) => {

    return (
        <Input>
            <InputSlot pl="$3">
                <InputIcon as={SearchIcon} />
            </InputSlot>
            <InputField 
                placeholder={placeholder} 
                value={value}
                onChangeText={onChangeText}
            />
        </Input>
    )
};

export default SearchInput;