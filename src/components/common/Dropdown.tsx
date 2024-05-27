import { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

export interface DropdownOption {
    label: string,
    value: string
};

interface DropdownProps {
  data: DropdownOption[],
  onChange: (value: string) => void
  isSearch?: boolean
}

const DropdownGroup: React.FC<DropdownProps> = ({ data, onChange, isSearch=false }) => {
    const [value, setValue] = useState<string>("");

    const handleChange = (item: DropdownOption) => {
      setValue(item.value);
      onChange(item.value);
    };

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

const styles = StyleSheet.create({
  dropdown: {
    height: 30,
    width: 150,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 14,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

export default DropdownGroup;
