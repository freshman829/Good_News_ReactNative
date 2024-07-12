import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, useColorScheme } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

export interface DropdownOption {
    label: string,
    value: string
};

interface DropdownProps {
  data: DropdownOption[],
  onChange: (value: string) => void
  isSearch?: boolean,
  defaultValue?: string
}

const DropdownGroup: React.FC<DropdownProps> = ({ data, onChange, isSearch=false, defaultValue }) => {
    const [value, setValue] = useState<string>(defaultValue || '');
    const colorScheme = useColorScheme();

    const handleChange = (item: DropdownOption) => {
      setValue(item.value);
      onChange(item.value);
    };

    useEffect(() => {
      setValue(defaultValue || '');
    }, [defaultValue]);

    const styles = getStyles(colorScheme === 'dark');

    return (
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search={isSearch}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Select item"
        searchPlaceholder="Search..."
        value={value}
        onChange={(item: DropdownOption) => {
          handleChange(item);
        }}
      />
    );
};

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  dropdown: {
    height: 50,
    width: 160,
    borderBottomColor: isDarkMode ? 'white' : 'gray',
    borderBottomWidth: 0.5,
    backgroundColor: isDarkMode ? '#333' : '#fff',
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 14,
    color: isDarkMode ? 'white' : 'black',
  },
  selectedTextStyle: {
    fontSize: 14,
    color: isDarkMode ? 'white' : 'black',
  },
  iconStyle: {
    width: 20,
    height: 20,
    tintColor: isDarkMode ? 'white' : 'black',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    backgroundColor: isDarkMode ? '#444' : '#f9f9f9',
    color: isDarkMode ? 'white' : 'black',
  },
});

export default DropdownGroup;

