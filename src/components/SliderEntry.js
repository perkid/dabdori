import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { ParallaxImage } from 'react-native-snap-carousel';
import styles from '../styles/SliderEntry.style';
import { Platform } from 'react-native';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
function wp (percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

const slideHeight = viewportHeight * 0.4;
const slideWidth = wp(80);

const iPhone8 = viewportHeight < 812

export default class SliderEntry extends Component {

    static propTypes = {
        role: PropTypes.string,
        data: PropTypes.object.isRequired,
        even: PropTypes.bool,
        parallax: PropTypes.bool,
        parallaxProps: PropTypes.object
    };

    get image () {
        const { data: { illustration, img_data }, parallax, parallaxProps, even } = this.props;
        // if(illustration.length!==0){
        //     // console.log(illustration)
        //     return <View style={{backgroundColor:'white', flex:1, justifyContent:'center', alignItems:'center'}}>
        //         <View style={{backgroundColor:`#${illustration[0].html_no}`, width:150, height:150}}>
        //         </View>
        //         </View>
                
        // } else {
        //     return <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        //         <Image
        //                 source={(illustration)===''?require('../../assets/logo.png'):undefined}
        //                 style={{width:100, height:100 }}
        //             />
        //         </View>
        //     // return parallax ? (
        //     //     <ParallaxImage
        //     //       source={(illustration)===''?require('../../assets/img1.png'):undefined}
        //     //       containerStyle={[styles.imageContainer, even ? styles.imageContainerEven : {}]}
        //     //       style={(illustration)===''?styles.imageLogo:styles.image}
        //     //       parallaxFactor={0.35}
        //     //       showSpinner={true}
        //     //       spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
        //     //       {...parallaxProps}
        //     //     />
        //     // ) : (
        //     //     <Image
        //     //       source={{ uri: illustration }}
        //     //       style={styles.image}
        //     //     />
        //     // );
        // }
        if(img_data!==''){
            return <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <Image
                    source={{uri:`data:image/png;base64,${img_data}`}}
                    style={(Platform.OS == "ios")? slideWidth > 800 ?{width:slideWidth*0.45, height:slideHeight*0.6}:iPhone8?{width:slideWidth*0.5, height:slideHeight*0.5}:{width:slideWidth*0.7, height:slideHeight*0.6}:{width:slideWidth*0.6, height:slideHeight*0.6}}
                />
            </View>
        } else {
            return <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Image
                        source={require('../../assets/logo.png')}
                        style={{width:150, height:150 }}
                    />
                </View>
        }
        
    }

    render () {
        const { data: { setNoticeIndex, showNotice, index, title, subtitle }, even } = this.props;

        const uppercaseTitle = title ? (
            <Text
              style={[styles.title, even ? styles.titleEven : {}, slideWidth > 800 ? styles.titleiPad:{}]}
              numberOfLines={2}
            >
                { title.toUpperCase() }
            </Text>
        ) : false;

        return (
            <TouchableOpacity
              activeOpacity={1}
              style={styles.slideInnerContainer}
              onPress={() => {
                  setNoticeIndex(index);
                  showNotice();
              }}
              >
                <View style={styles.shadow} />
                <View style={[styles.imageContainer, even ? styles.imageContainerEven : {}]}>
                    { this.image }
                    <View style={[styles.radiusMask, even ? styles.radiusMaskEven : {}]} />
                </View>
                <View style={[styles.textContainer, even ? styles.textContainerEven : {}, iPhone8?{height:50}:{}]}>
                    { uppercaseTitle }
                    <Text
                      style={[styles.subtitle, even ? styles.subtitleEven : {}]}
                      numberOfLines={2}
                    >
                        { subtitle }
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
}
