import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Portal, Dialog, Button } from "react-native-paper"
import DateTimePicker from '@react-native-community/datetimepicker';

function Datepicker({setCustom, minimumDate, maximumDate, date, getFormatDate, handleDate }) {
    const [show, setShow] = useState(false);
    const [initDate, setInitDate] = useState(date);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios' ? true : false);

        if (Platform.OS === 'android') {
            handleDate(currentDate)
        }
        if (Platform.OS === 'ios') {
            handleDate(currentDate)
        }
    };

    const showDatepicker = () => {
        setCustom()
        setShow(true);
    };

    const dismiss = () => {
        if (Platform.OS === 'android') {
            setShow(false);
        }
        if (Platform.OS === 'ios') {
            handleDate(initDate)
            setShow(false)
        }
    }

    const iosDatePick = () => {
        setInitDate(date)
        setShow(false)
    }
    
    const formatDate = getFormatDate(date);

    return (
        <View>
            <Button style={{ marginTop: 6 }} color='#1E388D' onPress={showDatepicker}>{formatDate}</Button>
            <Portal>
                <Dialog
                    visible={show}
                    onDismiss={() => dismiss()}
                >
                    {show && (
                        <View>
                            <DateTimePicker
                                testID="dateTimePicker"
                                timeZoneOffsetInMinutes={0}
                                value={date}
                                minimumDate={minimumDate}
                                maximumDate={maximumDate}
                                mode={'date'}
                                display="spinner"
                                onChange={onChange}
                            />
                            {Platform.OS === 'ios' ?
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 10 }}>
                                    <Button mode='outlined' style={styles.button} labelStyle={styles.buttonText} color='#1E388d' onPress={() => dismiss()}>취소</Button>
                                    <Button mode='contained' style={styles.button} labelStyle={styles.buttonText} color='#1E388d' onPress={() => iosDatePick()}>확인</Button>
                                </View>
                                : undefined}
                        </View>
                    )}
                </Dialog>
            </Portal>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        width: '40%',
        marginHorizontal: 10
    },
    buttonText: {
        fontSize: 16
    }
})

export default Datepicker;