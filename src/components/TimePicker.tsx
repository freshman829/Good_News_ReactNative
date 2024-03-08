import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import SelectDropdown from "react-native-select-dropdown";
import { convertTo24HourFormat } from '../utils/numberUtil';
import DropDownPicker from 'react-native-dropdown-picker';

type TimePickerProps = {
    isWake: boolean,
    value?: string,
    limitTime?: string,
    setTime: (time: string | null) => void
}

const TimePicker: React.FC<TimePickerProps> = ({ isWake = true, value, limitTime, setTime }) => {
    const [selectedTime, setSelectedTime] = useState('05:00 AM');
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (value) {
            setSelectedTime(value);
        } else if (isWake) {
            setSelectedTime('05:00 AM');
        } else {
            setSelectedTime('11:00 PM');
        }
    }, []);
    useEffect(() => {
        if (value !== selectedTime) {
            setTime(selectedTime);
        }
    }, [selectedTime]);
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


    return (
        <View style={styles.container}>
            <DropDownPicker
                open={open}
                value={selectedTime}
                items={generateTimeOptions().map((value, index) => { return {label: value, value} })}
                setOpen={setOpen}
                setValue={setSelectedTime}
                style={{ width: 150 }}
                containerStyle={{ width: 150 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 200,
        padding: 10
    }
});

export default TimePicker;
