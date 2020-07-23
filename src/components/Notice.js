import React from 'react';
import { Image, Text, View, Dimensions } from 'react-native';
import { Button, Paragraph, Dialog,} from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import styles from '../styles/SliderEntry.style';

function Notice({ visible, hideNotice, notice }){
  function wp (percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}
  const IS_IOS = Platform.OS === 'ios';
  const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
  const slideHeight = viewportHeight * 0.3;
  const slideWidth = wp(80);

    return (
        <Dialog visible={visible} onDismiss={hideNotice}>
          <Dialog.Title>{notice.title}</Dialog.Title>
          <Dialog.Content style={{ maxHeight: 400 }}>
           
            <ScrollView>
            {notice.data_list!==undefined?
            (notice.data_list.length===0)?
              undefined
              :
              // <>
              // <View style={{width:slideWidth, height:slideHeight}}>
              //   {notice.data_list.map((data,i)=>(
              //     <View
              //       key={i}
              //       style={{flex:1, backgroundColor:`#${data.html_no}`}}
              //     >
              //       <Text style={{backgroundColor:'white'}}>{data.html_no}</Text>
              //     </View>
              //   ))}
              //   {/* <Image
              //     source={{ uri: notice.image }}
              //     style={styles.image}
              //   /> */}
              // </View>
              // <Paragraph></Paragraph>
              // </>
              <>
              {
                notice.data_list.map((data, i)=>(
                  <View
                    key={i}
                    style={{flexDirection:'row', alignItems:'center', paddingVertical:10}}
                  >
                    <View style={{backgroundColor:`#${data.html_no}`, width:50,height:50}}></View><Text>  {data.html_no}</Text>
                  </View>
                ))
              }
              </>
              :undefined
            }
            
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