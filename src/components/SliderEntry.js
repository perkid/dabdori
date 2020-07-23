import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { ParallaxImage } from 'react-native-snap-carousel';
import styles from '../styles/SliderEntry.style';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp (percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

const slideHeight = viewportHeight * 0.4;
const slideWidth = wp(80);

export default class SliderEntry extends Component {

    static propTypes = {
        role: PropTypes.string,
        data: PropTypes.object.isRequired,
        even: PropTypes.bool,
        parallax: PropTypes.bool,
        parallaxProps: PropTypes.object
    };

    get image () {
        const { data: { illustration }, parallax, parallaxProps, even } = this.props;
        if(illustration.length!==0){
            return <View style={{backgroundColor:'white', flex:1, justifyContent:'center', alignItems:'center'}}>
                <View style={{backgroundColor:`#${illustration[0].html_no}`, width:150, height:150}}>
                </View>
                </View>
                
        } else {
            return <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Image
                        source={(illustration)===''?require('../../assets/logo.png'):undefined}
                        style={{width:100, height:100 }}
                    />
                </View>
            // return parallax ? (
            //     <ParallaxImage
            //       source={(illustration)===''?require('../../assets/img1.png'):undefined}
            //       containerStyle={[styles.imageContainer, even ? styles.imageContainerEven : {}]}
            //       style={(illustration)===''?styles.imageLogo:styles.image}
            //       parallaxFactor={0.35}
            //       showSpinner={true}
            //       spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
            //       {...parallaxProps}
            //     />
            // ) : (
            //     <Image
            //       source={{ uri: illustration }}
            //       style={styles.image}
            //     />
            // );
        }
    }

    render () {
        const { data: { setNoticeIndex, showNotice, index, title, subtitle }, even } = this.props;

        const uppercaseTitle = title ? (
            <Text
              style={[styles.title, even ? styles.titleEven : {}]}
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
                <View style={[styles.textContainer, even ? styles.textContainerEven : {}]}>
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
