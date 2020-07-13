import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { StyleSheet, View, Image, Alert , TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, Card, Title, Paragraph, DataTable, Portal } from 'react-native-paper';
import { useSelector } from 'react-redux';
import Fab from 'rn-fab';
import Tab from '../components/Tab';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import getActions from '../static/FABaction';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import SliderEntry from '../components/SliderEntry';
import { sliderWidth, itemWidth } from '../styles/SliderEntry.style';
import cStyles, { colors } from '../styles/index.style';
// import { ENTRIES1 } from '../static/entries';
// import { notice } from '../static/notice';
import Notice from '../components/Notice';
import {logo } from '../static/base64logo';

function NoticeMain({ navigation}) {
    const userInfo = useSelector(state => state.authentication.user);
    const actions = getActions(userInfo.role!=='employee')
    
    const notice = useSelector(state => state.notice.notice.noticeList);
    const sortedNotice = notice.sort((a, b)=>{
      return a.index < b.index;
    })
    
    const itemsPerPage = 5;
    const [noticeVisible, setNoticeVisible] = useState(false);
    const [noticeIndex, setNoticeIndex] = useState(0);
    const [page, setPage] = useState(0);
    const from = page * itemsPerPage;
    const to = (page + 1) * itemsPerPage;
    const n = sortedNotice.slice(from, to)
    const nop = Math.ceil(notice.length / itemsPerPage);
    const reverseNotice = sortedNotice.reverse()
    const showNotice = () => setNoticeVisible(true);

    const hideNotice = () => setNoticeVisible(false);
    
    const firstItem = 0;
    const [slider1ActiveSlide, setSlider1ActiveSlide] = useState(firstItem);
    const [slider1Ref, setSlider1Ref] = useState(null);

    const ENTRIES2 = []

    reverseNotice.slice(notice.length-3, notice.length).map((notice)=>{
      ENTRIES2.push({
        setNoticeIndex:setNoticeIndex,
        showNotice:showNotice,
        index:notice.index,
        title:notice.title,
        subtitle:'',
        illustration:(notice.image==='')?logo:notice.image
      })
    });

    function _renderItemWithParallax ({item, index}, parallaxProps) {
      return (
          <SliderEntry
            data={item}
            even={(index + 1) % 2 === 0}
            parallax={true}
            parallaxProps={parallaxProps}
          />
      );
  }
    return (
        <View style={{flex:1, backgroundColor:'#FFF'}}>
            <Header titleText='공지사항' navigation={navigation} auth={true} app={true}/>
            <View style={styles.notice}>
            <Carousel
                  ref={c => setSlider1Ref(c)}
                  data={ENTRIES2}
                  renderItem={_renderItemWithParallax}
                  sliderWidth={sliderWidth}
                  itemWidth={itemWidth}
                  hasParallaxImages={true}
                  firstItem={firstItem}
                  inactiveSlideScale={0.94}
                  inactiveSlideOpacity={0.7}
                  // inactiveSlideShift={20}
                  containerCustomStyle={cStyles.slider}
                  contentContainerCustomStyle={cStyles.sliderContentContainer}
                  loop={true}
                  loopClonesPerSide={2}
                  autoplay={true}
                  autoplayDelay={500}
                  autoplayInterval={3000}
                  removeClippedSubviews={false}
                  onSnapToItem={(index) => setSlider1ActiveSlide(index) }
                />
                {/* <Pagination
                  dotsLength={ENTRIES1.length}
                  activeDotIndex={slider1ActiveSlide}
                  containerStyle={cStyles.paginationContainer}
                  dotColor={'rgba(255, 255, 255, 0.92)'}
                  dotStyle={styles.paginationDot}
                  inactiveDotColor={colors.red}
                  inactiveDotOpacity={0.4}
                  inactiveDotScale={0.6}
                  carouselRef={slider1Ref}
                  tappableDots={!!slider1Ref}
                /> */}
            </View>
            <View style={styles.container}>
              <DataTable>
              {
                n.map((notice,i)=>(
                  <DataTable.Row 
                  key={i}
                  onPress={()=>{
                    setNoticeIndex(notice.index-1)
                    showNotice()
                  }}>
                  <DataTable.Cell style={{flex:1}}>{notice.index}</DataTable.Cell>
                  <DataTable.Cell style={{flex:9}}>{notice.title+' '+notice.subtitle}</DataTable.Cell>
                  <DataTable.Cell></DataTable.Cell>
                </DataTable.Row>
                ))
              }
              <DataTable.Pagination
                page={page}
                numberOfPages={nop}
                onPageChange={page => {
                  setPage(page)
                }}
                label={`${from + 1}-${notice.length<to?notice.length:to} of ${notice.length}`}
              />
              </DataTable>
            </View>

            <Portal>
              <Notice
                visible = {noticeVisible}
                hideNotice = {hideNotice}
                notice = {notice[noticeIndex]}
              />
            </Portal>
            <Fab
            actions={actions}
            style={{right: 40, top: 45}}
            rotation={"0deg"}
            onPress={name => {
                if(name == "btn_cart"){
                navigation.navigate('Cart', userInfo)
                }
                if(name == "btn_order"){
                navigation.navigate('OrderHistory', userInfo)
                }
                if(name == "btn_user"){
                navigation.navigate('MyPage', userInfo)
                }
                if(name == "btn_test"){
                showTest()
                }
            }}
            />
            <Tab navigation={navigation}/>
        </View>
    )
}

const styles = StyleSheet.create({
    notice: {
        paddingTop:40,
        flex: 1,
        // backgroundColor: `#1E388D`,
        backgroundColor:'#ffffff',
    },
    container: {
        flex: 1,
        backgroundColor: `#FFF`,
    },
    button:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    icon:{
        height:25,
        width:25
      },
})

export default NoticeMain;