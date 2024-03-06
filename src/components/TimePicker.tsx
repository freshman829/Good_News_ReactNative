import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import SelectDropdown from "react-native-select-dropdown";

type TimePickerProps = {
    isWake: boolean,
    limitTime?: string,
    setTime: (time: string) => void
}

const TimePicker: React.FC<TimePickerProps> = ({ isWake = true, limitTime, setTime }) => {
    const [selectedTime, setSelectedTime] = useState('05:00');

    useEffect(() => {
        if (isWake) {
            setSelectedTime('05:00');
        } else {
            setSelectedTime('23:00');
        }
    }, []);
    // Generate time options
    const generateTimeOptions = () => {
        const times = [];
        for (let hour = 5; hour <= 23; hour++) {
            // Convert 24-hour time to 12-hour format
            let hour12 = hour % 12 === 0 ? 12 : hour % 12; // Handles the 0 hour case
            let ampm = hour < 12 || hour === 24 ? "AM" : "PM"; // Determine AM/PM
            let hourString = `${hour12 < 10 ? `0${hour12}` : `${hour12}`}`;

            times.push(`${hourString}:00 ${ampm}`);
            if (hour < 23) {
                // Adding 30 minutes step only if it's before 11 PM
                times.push(`${hourString}:30 ${ampm}`);
            }
        }
        let start = '05:00 AM';
        let end = '11:00 PM';
        if (limitTime) {
            let limitHour = parseInt(limitTime.substring(0, 2), 10);
            let limitMinute = limitTime.substring(3);
            let limitAMPM = limitHour < 12 || limitHour === 24 ? "AM" : "PM";
            limitHour = limitHour % 12 === 0 ? 12 : limitHour % 12;
            let limitHourString = `${limitHour < 10 ? `0${limitHour}` : `${limitHour}`}`;

            limitTime = `${limitHourString}:${limitMinute} ${limitAMPM}`;

            if (isWake) start = limitTime;
            else end = limitTime;
        }
        return times.filter(time => {
            // Convert both current time and start/end times to 24-hour format for comparison
            const time24 = convertTo24HourFormat(time);
            const start24 = convertTo24HourFormat(start);
            const end24 = convertTo24HourFormat(end);

            return time24 <= end24 && time24 >= start24;
        });
    };
    function convertTo24HourFormat(time12: string) {
        let [time, modifier] = time12.split(' ');
        let [hours, minutes] = time.split(':');
        if (hours === '12') {
            hours = '00';
        }
        if (modifier === 'PM') {
            hours = (parseInt(hours, 10) + 12).toString();
        }
        return `${hours}:${minutes}`;
    }

    return (
        <View style={styles.container}>
            <SelectDropdown
                data={generateTimeOptions()}
                buttonStyle={styles.dropwdownBtnStyle}
                buttonTextStyle={styles.dropdownBtnTxtStyle}
                dropdownStyle={styles.dropdownDropdownStyle}
                onSelect={(selectedItem, index) => {
                    setSelectedTime(selectedItem);
                    setTime(selectedItem);
                }}
                buttonTextAfterSelection={(selectedTime, index) => {
                    return selectedTime;
                }}
                rowTextForSelection={(item, index) => {
                    return item;
                }}
            />
            {/* <Picker
                selectedValue={selectedTime}
                style={styles.picker}
                onValueChange={(itemValue) => {
                    setSelectedTime(itemValue)
                    setTime(itemValue)
                }
                }>
                {generateTimeOptions().map((time) => (
                    <Picker.Item key={time} label={time} value={time} />
                ))}
            </Picker> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 200
    },
    dropwdownBtnStyle: {
        flex: 1,
        height: 50,
        backgroundColor: '#FFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#444',
    },
    dropdownBtnTxtStyle: { color: '#444', textAlign: 'left' },
    dropdownDropdownStyle: { backgroundColor: '#EFEFEF' },
    dropdownRowStyle: { backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5' },
    dropdownRowTxtStyle: { color: '#444', textAlign: 'left' },
    picker: {
        height: 50,
        width: 120,
    },
});

export default TimePicker;
