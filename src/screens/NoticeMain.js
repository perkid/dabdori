import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { StyleSheet, View, Dimensions, Platform, Text, BackHandler} from 'react-native';
import { FAB, DataTable, Portal } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import Fab from 'rn-fab';
import Tab from '../components/Tab';
import getActions from '../static/FABaction';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import SliderEntry from '../components/SliderEntry';
import { sliderWidth, itemWidth } from '../styles/SliderEntry.style';
import cStyles, { colors } from '../styles/index.style';
import { GiftedChat } from 'react-native-gifted-chat';
import { sendMessage } from '../redux/messagesApp';
import Notice from '../components/Notice';
import { setNoticeTopListRequest, setNoticeBodyListRequest, getNotyDetailRequest, getNotyDetail } from '../redux/notice';

function NoticeMain({ navigation }) {

  const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

  const r = viewportWidth/12;
  const t = Platform.OS==='ios' ? 45 : 25;
  const iPhone8 = viewportHeight < 812
  const iPad = r > 85
  const userInfo = useSelector(state => state.authentication.user);
  const topList = useSelector(state => state.notice.notice.topList);
  const bodyList = useSelector(state => state.notice.notice.bodyList);
  const detail = useSelector(state => state.notice.notice.notyDetail);

  const actions = getActions(userInfo.role !== 'employee');

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setNoticeTopListRequest(userInfo.role));
    dispatch(setNoticeBodyListRequest(userInfo.role));
  }, []);

  // Carousel 공지
  const firstItem = 0;
  const [slider1ActiveSlide, setSlider1ActiveSlide] = useState(firstItem);
  const [slider1Ref, setSlider1Ref] = useState(null);

  const [noticeVisible, setNoticeVisible] = useState(false);
  const [noticeIndex, setNoticeIndex] = useState(0);

  const showNotice = () => setNoticeVisible(true);

  const hideNotice = () => setNoticeVisible(false);

  const TOPENTRIES = [];

  if (topList.length > 0) {
    topList.forEach((notice, i) => {
      TOPENTRIES.push({
        setNoticeIndex: setNoticeIndex,
        showNotice: showNotice,
        index: i,
        title: notice.title,
        subtitle: '',
        illustration: notice.data_list.length === 0 ? '' : notice.data_list, // 칼라정보
        img_data: notice.img_data === null ? '' : notice.img_data // 이미지
      })
    })
  }

  // console.log(topList)
  function _renderItemWithParallax({ item, index }, parallaxProps) {
    return (
      <SliderEntry
        data={item}
        even={(index + 1) % 2 === 0}
        parallax={true}
        parallaxProps={parallaxProps}
      />
    );
  }
  

  // 게시판 공지
  const [noticeBodyVisible, setNoticeBodyVisible] = useState(false);

  const showBodyNotice = () => setNoticeBodyVisible(true);

  const hideBodyNotice = () => setNoticeBodyVisible(false);

  const handleDetail = (noty_id, img_data) => {
    dispatch(getNotyDetailRequest(noty_id, img_data))
  }

  useEffect(() => {
    if (detail.status === 'SUCCESS') {
      showBodyNotice()
      dispatch(getNotyDetail())
    }
  }, [detail.status])

  // 페이징
  const itemsPerPage = 5;
  const [page, setPage] = useState(0);
  const from = page * itemsPerPage;
  const to = (page + 1) * itemsPerPage;

  // 현물현황 조회
  const messages = useSelector(state => state.messagesApp.messages)

  const inventoryInquiry = (item) => {
    navigation.navigate('Chat')

    let option;
    let subOption;
    
    let message = {
      createdAt: new Date(),
      _id: Math.round(Math.random() * 1000000),
      text: '현물조회',
      user: {
        _id: 1,
      }
    }
    dispatch(sendMessage(GiftedChat.append(messages, [message])))

    message = {
      createdAt: new Date(),
      _id: Math.round(Math.random() * 1000000),
      text: item,
      user: {
        _id: 1,
        option: option,
        subOption: subOption
      }
    }

    function timeout() {
      dispatch(sendMessage(GiftedChat.append(messages, [message])))
      // navigation.navigate('Chat')
    }
    setTimeout(timeout, 500)
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      <Header titleText='공지사항' navigation={navigation} auth={true} app={true} />
      {/* Carousel 공지 */}
      <View style={styles.notice, iPhone8?{marginTop:0}:styles.notice}>
        <Carousel
          ref={c => setSlider1Ref(c)}
          data={TOPENTRIES}
          renderItem={_renderItemWithParallax}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          hasParallaxImages={true}
          firstItem={0}
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
          onSnapToItem={(index) => setSlider1ActiveSlide(index)}
        />
        {/* <Pagination
                  dotsLength={TOPENTRIES.length}
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
      <Portal>
        {
          topList.length > 0 ? <Notice
            visible={noticeVisible}
            hideNotice={hideNotice}
            notice={topList[noticeIndex]}
            role={userInfo.role}
            inventoryInquiry={inventoryInquiry}
          /> : undefined
        }
      </Portal>
      {/* 게시판 공지 */}
      <View style={styles.container, iPhone8?{marginTop:-20}:styles.container}>
        <DataTable>
          {
            bodyList.length > 0 ?
              bodyList.slice(from, to).map((notice, i) => (
                <DataTable.Row
                  style={iPad ? {height:80}:{}}
                  key={i}
                  onPress={() => {
                    handleDetail(notice.noty_id, notice.img_data)
                  }}>
                  <DataTable.Cell style={{ flex: 0.3 }}></DataTable.Cell>
                  <DataTable.Cell style={{ flex: 9 }}><Text style={iPad?{fontSize:20}:{}}>{notice.title}</Text></DataTable.Cell>
                  <DataTable.Cell></DataTable.Cell>
                </DataTable.Row>
              ))
              : undefined
          }
          <DataTable.Pagination
            page={page}
            numberOfPages={bodyList.length > 0 ? Math.ceil(bodyList.length / itemsPerPage) : 0}
            onPageChange={page => {
              setPage(page)
            }}
            label={`${from + 1}-${bodyList.length < to ? bodyList.length : to} of ${bodyList.length > 0 ? bodyList.length : 0}`}
          />
        </DataTable>
      </View>
      <Portal>
        {
          detail !== undefined ?
            <Notice
              visible={noticeBodyVisible}
              hideNotice={hideBodyNotice}
              notice={detail.detail}
              img={detail.img_data}
              role={userInfo.role}
              inventoryInquiry={inventoryInquiry}
            /> : undefined
        }
      </Portal>
      {/* <FAB
                style={styles.fab}
                small
                icon="plus"
                onPress={() => messageSend('거북선')}
              /> */}
      {/* 햄버거 메뉴 */}
      <Fab
        actions={actions}
        style={iPad?{right:35, top: 25}:iPhone8?{right: 25, top: 20}:{right: r, top: t}}
        rotation={"0deg"}
        onPress={name => {
          if (name == "btn_cart") {
            navigation.navigate('Cart', userInfo)
          }
          if (name == "btn_order") {
            navigation.navigate('OrderHistory', userInfo)
          }
          if (name == "btn_user") {
            navigation.navigate('MyPage', userInfo)
          }
          if (name == "btn_qna") {
            navigation.navigate('QNA', userInfo)
          }
          if (name == "btn_test") {
            console.log('눌림')
            _exitApp()
          }
        }}
      />
      {/* 탭 네비게이션 */}
      <Tab navigation={navigation} />
    </View>
  )
}

const styles = StyleSheet.create({
  notice: {
    paddingTop: 10,
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: `#FFF`,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    height: 25,
    width: 25
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 90,
    backgroundColor: '#1e388d'
  }
})

export default NoticeMain;