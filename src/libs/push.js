import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

// 토큰 생성 코드
export const registerForPushNotificationsAsync = async (handleToken) => {
    if (Constants.isDevice) {
        const { status: existingStatus } = await Permissions.getAsync(
            Permissions.NOTIFICATIONS
        );
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Permissions.askAsync(
                Permissions.NOTIFICATIONS
            );
            finalStatus = status;
        }
        // 푸시 알람 허용하지 않은 경우
        // if (finalStatus !== 'granted') {
        //   alert('Failed to get push token for push notification!');
        //   return;
        // }
        let token = await Notifications.getExpoPushTokenAsync();
        handleToken(token)
        return true;
    } else {

    }
}

// 푸시 보내기

export const sendPushNotification = async (pushToken, title, pushMessage) => {

    const message = {
        to: pushToken,
        sound: 'default',
        title: title,
        body: pushMessage,
        data: { data: '' },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    })
};
