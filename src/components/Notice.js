import React from 'react';
import { Image, View } from 'react-native';
import { Button, Paragraph, Dialog,} from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import styles from '../styles/SliderEntry.style';

function Notice({ visible, hideNotice, notice }){
    return (
        <Dialog visible={visible} onDismiss={hideNotice}>
          <Dialog.Title>{notice.title}</Dialog.Title>
          <Dialog.Content style={{ maxHeight: 400 }}>
            <ScrollView>
            {notice.image===''?
            undefined
            :
            <View style={{width:150, height:150}}>
              <Image
                source={{ uri: notice.image }}
                style={styles.image}
              />
            </View>
            }
            <Paragraph></Paragraph>
              <Paragraph>{notice.content}.</Paragraph>
            </ScrollView>
          </Dialog.Content>
          <Dialog.Actions>
            <Button color='#1E388D' onPress={hideNotice}>닫기</Button>
          </Dialog.Actions>
        </Dialog>
    )
}

export default Notice;