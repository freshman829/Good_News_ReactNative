import { Box } from '@gluestack-ui/themed';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type SelectOption = {
    label: string,
    value: string
}

interface CustomSelectProps {
    value?: string,
    options: SelectOption[],
    onSelect?: (value: string) => void
    my?: string,
}

const CustomSelect: React.FC<CustomSelectProps> = ({ value, options, onSelect, my ="$1" }) => {
    const [selectedValue, setSelectedValue] = useState<string>("");

    useEffect(() => {
        if (options && options.length)
            if (value) {
                setSelectedValue(value);
            } else {
                setSelectedValue(options[0].value);
            }
    }, [])

    const handleSelect = (value: string) => {
        setSelectedValue(value);
        onSelect && onSelect(value);
    };

    return (
        <Box style={styles.container} my={my}>
            {options.map((option, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => handleSelect(option.value)}
                    style={[
                        styles.option,
                        selectedValue === option.value ? styles.selectedOption : styles.unselectedOption
                    ]}
                >
                    <Text style={selectedValue === option.value ? styles.selectedText : styles.unselectedText}>
                        {option.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </Box>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center'
    },
    option: {
        margin: 4,
        padding: 8,
        borderWidth: 1,
        borderColor: 'lightgrey',
        borderRadius: 4,
    },
    selectedOption: {
        backgroundColor: 'skyblue',
    },
    unselectedOption: {
        backgroundColor: 'whitesmoke',
    },
    selectedText: {
        fontWeight: 'bold',
        color: 'white',
    },
    unselectedText: {
        color: 'grey',
    },
});

export default CustomSelect;