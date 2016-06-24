import React, {
  Component,
  Text,
  Animated,
  View,
  Image,
  StyleSheet,
  Easing,
  Dimensions,
} from 'react-native';

import MK, {
  MKSlider,
  MKButton,
} from 'react-native-material-kit';

import GlobalStyles from './../../App/Styles/globalStyles';
import ConnectToHardwareModule from './../../App/Modules/ConnectToHardwareModule';
import tweenState from 'react-tween-state';
import Video from 'react-native-video';

export default class Results extends Component {

  constructor(props) {
    super(props);
    this.state = {
      timeOffsetAndGsr: new Animated.ValueXY({x: 0, y: 0}),
      fetchedGsrValues: [],
      minTimeOffset: 0,
      maxTimeOffset: 0,
      isReplaying: false,
      replayIsOverWhenBackToBeginning: 0,
      videoUri: this.props.videoUri,
      pressPlay: false
    };
  }

  componentWillMount() {
    getGSRValues().then((gsrValues) => {
      console.log(gsrValues);
      this.setState({fetchedGsrValues: gsrValues});
      this.setState({minTimeOffset: parseInt(Object.keys(this.state.fetchedGsrValues)[0])});
      this.setState({maxTimeOffset: parseInt(Object.keys(this.state.fetchedGsrValues)[Object.keys(this.state.fetchedGsrValues).length - 1])});
      this.setState({minGSRValue: Math.min(...Object.values(this.state.fetchedGsrValues))});
      this.setState({maxGSRValue: Math.max(...Object.values(this.state.fetchedGsrValues))});
      this.setState({scaling: 135});
      this.setState({offset: 0});
    }).catch((error) => {
      console.log(error);
    });
  }

  animateGSRValues() {
    this.setState({isReplaying: true});

    this.state.timeOffsetAndGsr.x.addListener((timeOffset) => {
      this.refs.timelineSlider.value = timeOffset.value;
    });

    var timingSequence = [];
    var timeOffsets = Object.keys(this.state.fetchedGsrValues);
    var self = this;

    for (var i = 1; i < timeOffsets.length; i++) {
      var currentTimeOffset = timeOffsets[i];
      var previousTimeOffset = timeOffsets[i - 1];
      var timeDiff = currentTimeOffset - previousTimeOffset;

      timingSequence.push(
        Animated.timing(self.state.timeOffsetAndGsr,
               {
                 toValue: {x: currentTimeOffset, y: self.normaliseGSR(self.state.fetchedGsrValues[currentTimeOffset])},
                 easing: Easing.linear,
                 duration: timeDiff
               }));
    }
    this.setState({pressPlay: true});
    Animated.sequence(timingSequence).start();
  }

  normaliseGSR(gsrValue) {
    return (((gsrValue - this.state.minGSRValue) / (this.state.maxGSRValue - this.state.minGSRValue)) * this.state.scaling) + this.state.offset;
  }

  render () {
    const videoPlayback = (
      <Video source={{uri: this.state.videoUri}}
             rate={1.0}
             volume={1.0}
             muted={false}
             paused={false}
             resizeMode="stretch"
             repeat={false}
             playInBackground={false}
             playWhenInactive={false}
             onLoadStart={this.loadStart}
             onLoad={this.setDuration}
             onProgress={this.setTime}
             onEnd={this.onEnd}
             onError={this.videoError}
             style={styles.backgroundVideo} />);

    const videoImage = (
      <Image ref="image"
             source={{uri: this.state.videoUri}}
             style={styles.backgroundVideo}/>);

    return (
      <View style={styles.container}>
        <View style={styles.figureHeadViewContainer}>
          <Animated.View style={[styles.bar, {height: this.state.timeOffsetAndGsr.y}]}>
          </Animated.View>

          {/*<Image
           style={styles.head}
           source={require('./../Assets/images/head.png')}/>*/}

          <View style={styles.rowContainer}>
            <MKSlider ref="timelineSlider"
                      style={styles.slider}
                      min={this.state.minTimeOffset}
                      max={this.state.maxTimeOffset}
                      lowerTrackColor='#FFFFFF'/>
            <MKButton backgroundColor="white"
                      borderRadius={4}
                      padding={15}
                      onPress={this.animateGSRValues.bind(this)}>
              <Text>py></Text>
            </MKButton>
          </View>
        </View>

        <View style={styles.videoViewContainer}>
          {this.state.pressPlay && videoPlayback}
          {!this.state.pressPlay && videoImage}
        </View>
      </View>
    );
  }
}

async function getGSRValues() {
  try {
    var {
      gsrVals
    } = await ConnectToHardwareModule.getGSRData();
    return gsrVals;
  } catch (error) {
    console.error(error);
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  figureHeadViewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#4E92DF"
  },
  bar: {
    backgroundColor: '#66E5C8',
    width: 250,
    position: 'absolute',
    bottom: 1,
    left: 50,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  head: {
    height: 500,
    width: 300,
    alignSelf: 'center',
  },
  slider: {
    width: 300,
  },
  videoViewContainer: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#4E92DF'
  },
  backgroundVideo: {
    width: Dimensions.get('window').width / 2,
    height: Dimensions.get('window').height / 2
  },
});
