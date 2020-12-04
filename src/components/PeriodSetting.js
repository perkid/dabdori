import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button, Portal, Dialog, DataTable, RadioButton } from 'react-native-paper';
import Datepicker from '../components/Datepicker';

function PeriodSetting({ visible, _hideDialog, startDate, endDate, getFormatDate, handleStartDate, handleEndDate, handleStatus }) {
    const [dateRange, setDateRange] = useState('custom');
    const [status, setStatus] = useState('all');

    const [initStartDate, setInitStartDate] = useState(startDate);
    const [initEndDate, setInitEndDate] = useState(endDate);

    const setCustom = () => {
        setDateRange('custom')
    }

    useEffect(() => {
        if (dateRange === 'threeMonth') {
            let d = new Date()
            let month = d.getMonth();
            d.setMonth(month - 3);
            handleStartDate(d)
        }
        if (dateRange === 'sixMonth') {
            let d = new Date()
            let month = d.getMonth();
            d.setMonth(month - 6);
            handleStartDate(d)
        }
    }, [dateRange])

    const dismiss = () => {
        handleStartDate(initStartDate)
        handleEndDate(initEndDate)
        setDateRange('custom')
        setStatus('all')
        _hideDialog()
    }
    const apply = () => {
        setInitStartDate(startDate)
        setInitEndDate(endDate)
        setDateRange('custom')
        handleStatus(status)
        setStatus('all')
        _hideDialog()
    }
    return (
        <Portal>
            <Dialog
                visible={visible}
                onDismiss={() => dismiss()}>
                <Dialog.Title style={{ textAlign: 'center' }}>기간설정</Dialog.Title>
                <DataTable style={{ marginVertical: 10 }}>
                    <DataTable.Row>
                        <DataTable.Cell style={{ flex: 2, marginLeft: 30 }}>시작일</DataTable.Cell>
                        <Datepicker
                            setCustom={setCustom}
                            date={startDate}
                            maximumDate={endDate}
                            getFormatDate={getFormatDate}
                            handleDate={handleStartDate}
                            />
                        <DataTable.Cell></DataTable.Cell>
                    </DataTable.Row>
                    <DataTable.Row>
                        <DataTable.Cell style={{ flex: 2, marginLeft: 30 }}>종료일</DataTable.Cell>
                        <Datepicker
                            setCustom={setCustom}
                            minimumDate={startDate}
                            date={endDate}
                            getFormatDate={getFormatDate}
                            handleDate={handleEndDate}
                        />
                        <DataTable.Cell />
                    </DataTable.Row>
                    <DataTable.Row>
                        <View style={styles.radioContainer}>
                            <View style={styles.radio}>
                                <RadioButton.Android
                                    color='#1E388D'
                                    value="threeMonth"
                                    status={dateRange === 'threeMonth' ? 'checked' : 'unchecked'}
                                    onPress={() => setDateRange('threeMonth')}
                                /><Text>3개월</Text>
                            </View>
                            <View style={styles.radio}>
                                <RadioButton.Android
                                    color='#1E388D'
                                    value="sixMonth"
                                    status={dateRange === 'sixMonth' ? 'checked' : 'unchecked'}
                                    onPress={() => setDateRange('sixMonth')}
                                /><Text>6개월</Text>
                            </View>
                            <View style={styles.radio}>
                                <RadioButton.Android
                                    color='#1E388D'
                                    value="custom"
                                    status={dateRange === 'custom' ? 'checked' : 'unchecked'}
                                    onPress={() => setDateRange('custom')}
                                /><Text>기간설정</Text>
                            </View>
                        </View>
                    </DataTable.Row>
                </DataTable>
                <Dialog.Title style={{ textAlign: 'center' }}>상태설정</Dialog.Title>
                <DataTable style={{ marginVertical: 10 }}>
                    <DataTable.Row>
                        <View style={styles.radioContainer}>
                            <View style={styles.radio}>
                                <RadioButton.Android
                                    color='#1E388D'
                                    value="1"
                                    status={status === '1' ? 'checked' : 'unchecked'}
                                    onPress={() => setStatus('1')}
                                /><Text>접수</Text>
                            </View>
                            <View style={styles.radio}>
                                <RadioButton.Android
                                    color='#1E388D'
                                    value="2"
                                    status={status === '2' ? 'checked' : 'unchecked'}
                                    onPress={() => setStatus('2')}
                                /><Text>준비</Text>
                            </View>
                            <View style={styles.radio}>
                                <RadioButton.Android
                                    color='#1E388D'
                                    value="3"
                                    status={status === '3' ? 'checked' : 'unchecked'}
                                    onPress={() => setStatus('3')}
                                /><Text>완료</Text>
                            </View>
                            <View style={styles.radio}>
                                <RadioButton.Android
                                    color='#1E388D'
                                    value="4"
                                    status={status === '4' ? 'checked' : 'unchecked'}
                                    onPress={() => setStatus('4')}
                                /><Text>취소</Text>
                            </View>
                            <View style={styles.radio}>
                                <RadioButton.Android
                                    color='#1E388D'
                                    value="all"
                                    status={status === 'all' ? 'checked' : 'unchecked'}
                                    onPress={() => setStatus('all')}
                                /><Text>전체</Text>
                            </View>
                        </View>
                    </DataTable.Row>
                </DataTable>
                <Dialog.Actions style={{ justifyContent: 'center', marginVertical: 25 }}>
                    <Button
                        mode='outlined'
                        color='#1E388D'
                        onPress={() => dismiss()}
                        style={{ width: '40%', marginHorizontal: 10 }}
                    >
                        취소
                  </Button>
                    <Button
                        mode='contained'
                        color='#1E388D'
                        onPress={() => apply()}
                        style={{ width: '40%', marginHorizontal: 10 }}
                    >
                        완료
                </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}

const styles = StyleSheet.create({
    radioContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%'
    },
    radio: {
        alignItems: 'center',
        flexDirection: 'row'
    }
})
export default PeriodSetting;