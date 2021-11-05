import React from 'react';
import { Image, Text, View, Dimensions } from 'react-native';
import { Button, Paragraph, Dialog,} from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';

function Notice({ visible, hideNotice, notice, img, role, specGB, inventoryInquiry}){
  function wp (percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}
  const IS_IOS = Platform.OS === 'ios';
  const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
  const slideHeight = viewportHeight * 0.3;
  const slideWidth = wp(80);
  const iPad = slideWidth > 800
  const iPhone8 = viewportHeight < 812
    return (
        <Dialog visible={visible} onDismiss={hideNotice}>
          <Dialog.Title style={iPad?{padding:30}:{}}><Text style={iPad?{fontSize:40, lineHeight:40}:{}}>{notice.title}</Text></Dialog.Title>
          <Dialog.Content style={iPad ? { maxHeight: 800 } : { maxHeight: 400}}>
           
            <ScrollView>
            {notice.data_list!==undefined?
            (notice.img_data!==null)?
            // TopList 신아이템
            <View style={iPad?{flex:1, justifyContent:'center', alignItems:'center', paddingBottom:50, paddingVertical:30}:
            {flex:1, justifyContent:'center', alignItems:'center', paddingBottom:20, paddingVertical:10}}>
            <Image
                    source={{uri:`data:image/png;base64,${notice.img_data}`}}
                    style={iPad ? {width:400, height:400 } : iPhone8 ? {width:200, height:200} : {width : 250, height: 250}}
                />
            </View>
              :
              (img===undefined)?
              <>
              {
                notice.data_list.map((data, i)=>(
                  // <View
                  //   key={i}
                  //   style={{flexDirection:'row', alignItems:'center', paddingVertical:10}}
                  // >
                  //   <View style={{justifyContent:'center', alignItems:'center'}}>
                  //     <View style={{backgroundColor:`#${data.html_no}`, width:50,height:50}}/>
                  //     <View style={{alignItems:'center'}}><Text style={{fontWeight:'bold'}}>PANTONE</Text><Text>{data.panton_no}</Text></View>
                  //   </View>
                  //   <View>
                  //     <Text>    {data.color_yw}</Text>
                  //     <Text/>
                  //     <Text/>
                  //   </View>
                  // </View>
                  <View
                    key={i}
                    style={{flexDirection:'row', alignItems:'center', paddingVertical:10}}
                  >
                      <View style={iPad?{backgroundColor:`#${data.html_no}`, width:100,height:100, marginLeft:30}:{backgroundColor:`#${data.html_no}`, width:50,height:50}}/>
                      <View style={{alignItems:'center'}}></View>
                      <Text style={iPad?{marginLeft:50, fontWeight:"bold", fontSize:25}:{marginLeft:30, fontWeight:'bold'}}>{data.color_yw}</Text><View style={iPad?{marginLeft:50}:{marginLeft:30}}><Text style={iPad?{fontSize:25, fontWeight:'bold'}:{fontWeight:'bold'}}>PANTONE</Text><Text style={iPad?{fontSize:25}:{}}>{data.panton_no}</Text></View>
                  </View>
                ))
              }
              </>
              :(img!==null)?<View style={iPad?{flex:1, justifyContent:'center', alignItems:'center', paddingBottom:50, paddingVertical:30}:
              {flex:1, justifyContent:'center', alignItems:'center', paddingBottom:20, paddingVertical:10}}>
              {/* BodyList 신아이템 */}
              <Image
                      source={{uri:`data:image/png;base64,${img}`}}
                      style={iPad?{width:400, height:400}: iPhone8 ? {width:200, height:200} : {width:250, height:250 }}
                  />
              </View>:
              <>
              {
                notice.data_list.map((data, i)=>(
                  // <View
                  //   key={i}
                  //   style={{flexDirection:'row', alignItems:'center', paddingVertical:10}}
                  // >
                  //   <View style={{justifyContent:'center', alignItems:'center'}}>
                  //     <View style={{backgroundColor:`#${data.html_no}`, width:50,height:50}}/>
                  //     <View style={{alignItems:'center'}}><Text style={{fontWeight:'bold'}}>PANTONE</Text><Text>{data.panton_no}</Text></View>
                  //   </View>
                  //   <View>
                  //     <Text>    {data.color_yw}</Text>
                  //     <Text/>
                  //     <Text/>
                  //   </View>
                  // </View>
                  <View
                    key={i}
                    style={{flexDirection:'row', alignItems:'center', paddingVertical:10}}
                  >
                      <View style={iPad?{backgroundColor:`#${data.html_no}`, width:100,height:100, marginLeft:30}:{backgroundColor:`#${data.html_no}`, width:50,height:50}}/>
                      <View style={{alignItems:'center'}}></View>
                      <Text style={iPad?{marginLeft:50, fontWeight:"bold", fontSize:25}:{marginLeft:30, fontWeight:'bold'}}>{data.color_yw}</Text><View style={iPad?{marginLeft:50}:{marginLeft:30}}><Text style={iPad?{fontSize:25, fontWeight:'bold'}:{fontWeight:'bold'}}>PANTONE</Text><Text style={iPad?{fontSize:25}:{}}>{data.panton_no}</Text></View>
                  </View>
                ))
              }
              </>
              :undefined
            }
            {
              specGB === 'Y' ?
              <>
                <Paragraph style={iPad?{fontSize:25, lineHeight:45, marginLeft:35}:{}}>{notice.content_side}</Paragraph>
                <Paragraph></Paragraph>
                <Paragraph style={iPad?{fontSize:25, lineHeight:45, marginLeft:35}:{}}>혼용률 : {notice.mix_ratio}</Paragraph>
                <Paragraph style={iPad?{fontSize:25, lineHeight:45, marginLeft:35}:{}}>사용폭 : {notice.use_width},     중량 : {notice.weight_yard}</Paragraph>
                <Paragraph style={iPad?{fontSize:25, lineHeight:45, marginLeft:35}:{}}>후가공 : {notice.finish}</Paragraph>
                <Paragraph></Paragraph>
                <Paragraph style={iPad?{fontSize:25, lineHeight:45, marginLeft:35}:{}}>경사사종 : {notice.logt_name}</Paragraph>
                <Paragraph style={iPad?{fontSize:25, lineHeight:45, marginLeft:35}:{}}>위사사종 : {notice.latt_name}</Paragraph>
                <Paragraph style={iPad?{fontSize:25, lineHeight:45, marginLeft:35}:{}}>경사본수 : {notice.logt_num}</Paragraph>
                <Paragraph style={iPad?{fontSize:25, lineHeight:45, marginLeft:35}:{}}>경사밀도 : {notice.logt_deny},     위사밀도 : {notice.latt_deny}</Paragraph>
              </> : 
              specGB ==='N' && notice.noty_gb === 'N' && role ==='employee' ? 
              // 신아이템 직원
              <>
                <Paragraph style={iPad?{fontSize:25, lineHeight:45, marginLeft:35}:{}}>{notice.content_side}</Paragraph>
                <Paragraph></Paragraph>
                <Paragraph style={iPad?{fontSize:25, lineHeight:45, marginLeft:35}:{}}>혼용률 : {notice.mix_ratio}</Paragraph>
                <Paragraph style={iPad?{fontSize:25, lineHeight:45, marginLeft:35}:{}}>사용폭 : {notice.use_width},     중량 : {notice.weight_yard}</Paragraph>
                <Paragraph style={iPad?{fontSize:25, lineHeight:45, marginLeft:35}:{}}>후가공 : {notice.finish}</Paragraph>
                <Paragraph></Paragraph>
              </> : 
              notice.noty_gb === 'N' && role !== 'employee' ?
              // 신아이템 고객
              <>
                <Paragraph style={iPad?{fontSize:25, lineHeight:45, marginLeft:35}:{}}>{notice.content}</Paragraph>
                <Paragraph></Paragraph>
                <Paragraph style={iPad?{fontSize:25, lineHeight:45, marginLeft:35}:{}}>혼용률 : {notice.mix_ratio}</Paragraph>
                <Paragraph style={iPad?{fontSize:25, lineHeight:45, marginLeft:35}:{}}>사용폭 : {notice.use_width},     중량 : {notice.weight_yard}</Paragraph>
                <Paragraph style={iPad?{fontSize:25, lineHeight:45, marginLeft:35}:{}}>후가공 : {notice.finish}</Paragraph>
              </> :
              // 신컬러
              <Paragraph></Paragraph>
            }
            </ScrollView>
          </Dialog.Content>
          <Dialog.Actions style={{justifyContent:'space-around'}}>
            <Button color='#1E388D' onPress={()=>{
                hideNotice()
                inventoryInquiry(notice.item_name)}
              }><Text style={iPad ? {fontSize:25}:{}}>재고 조회</Text></Button>
            <Button color='#1E388D' onPress={hideNotice}><Text style={iPad ? {fontSize:25}:{}}>닫기</Text></Button>
          </Dialog.Actions>
        </Dialog>
    )
}

export default Notice;