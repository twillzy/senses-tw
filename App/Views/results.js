import React, {
  Component,
  Text,
  Animated,
  View,
  Image,
  StyleSheet,
  Easing,
  Dimensions,
  TouchableOpacity,
  PanResponder
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
      videoUri: this.props.videoUri,
      isVideoOnPlay: false,
      isVideoOnPause: false,
      isVideoOnEnd: false,
      isAnimating: false,
      sliderCurrentTime: "00:00",
      sliderEndTime: "00:00",
      moving: false,
      timeOffsetAndGsrObject: {}
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
      console.warn(this.state.maxTimeOffset);
    }).catch((error) => {
      console.log(error);
    });

    this.holderPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderGrant: (e, gestureState) => {
          // this.setState({moving: true});
      },
      onPanResponderMove: (e, gestureState) => {
        // update timeOffsetAndGsrObject
        console.log("i'm moving");
      },
      onPanResponderRelease: (e, gesture) => {
        // do animation
        console.log("i'm released");
      }
    });
  }

  animateGSRValues(gsrValues) {
    this.setState({isAnimating: true});

    this.state.timeOffsetAndGsr.x.addListener((timeOffset) => {
      this.refs.timelineSlider.value = timeOffset.value;
    });

    var timingSequence = [];
    var timeOffsets = Object.keys(gsrValues);
    var self = this;

    for (var i = 1; i < timeOffsets.length; i++) {
      var currentTimeOffset = timeOffsets[i];
      var previousTimeOffset = timeOffsets[i - 1];
      var timeDiff = currentTimeOffset - previousTimeOffset;

      timingSequence.push(
        Animated.timing(self.state.timeOffsetAndGsr,
               {
                 toValue: {x: currentTimeOffset, y: self.normaliseGSR(gsrValues[currentTimeOffset])},
                 easing: Easing.linear,
                 duration: timeDiff
               }));
    }
    Animated.sequence(timingSequence).start();
  }

  sliderValueOnChange(sliderValue) {
    if (this.state.isVideoOnPlay || this.state.isAnimating) {
      return;
    }

    let timeOffsets = Object.keys(this.state.fetchedGsrValues);

    let fetchedGsrValues = timeOffsets.filter((time) => {
      return time >= sliderValue;
    });

    let newTimeOffSetsAndGsrObject = {};

    fetchedGsrValues.forEach((time, index, array) => {
      newTimeOffSetsAndGsrObject[time] = this.state.fetchedGsrValues[time];
    });

    this.animateGSRValues(newTimeOffSetsAndGsrObject);
  }

  normaliseGSR(gsrValue) {
    return (((gsrValue - this.state.minGSRValue) / (this.state.maxGSRValue - this.state.minGSRValue)) * this.state.scaling) + this.state.offset;
  }

  _onLoad(data) {
    this.setState({sliderEndTime: data.duration});
  }

  _onLoadStart() {
  }

  _onEnd() {
    this.setState({isVideoOnPlay: false, isAnimating: false});
  }

  imagePress() {
    this.setState({isVideoOnPlay: true});
    this.animateGSRValues(this.state.fetchedGsrValues);
  }

  videoPress() {
    this.setState({isVideoOnPause: !this.state.isVideoOnPause});
  }

  render () {
    const videoPlayback = (

      <Video ref="video"
             source={{uri: this.state.videoUri}}
             rate={1.0}
             volume={1.0}
             muted={false}
             paused={this.state.isVideoOnPause}
             resizeMode="stretch"
             repeat={false}
             playInBackground={false}
             playWhenInactive={false}
             onLoadStart={this._onLoadStart.bind(this)}
             onLoad={this._onLoad.bind(this)}
             onProgress={this.setTime}
             onSeek={this.onSeek}
             onEnd={this._onEnd.bind(this)}
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

        </View>

        <View style={styles.videoViewContainer}>
          <TouchableOpacity onPress={this.videoPress.bind(this)}>
            {this.state.isVideoOnPlay && videoPlayback}
          </TouchableOpacity>
          <TouchableOpacity onPress={this.imagePress.bind(this)}>
            {!this.state.isVideoOnPlay && videoImage}
          </TouchableOpacity>
        </View>

        <View style={styles.sliderContainer}>
          <Text style={styles.sliderText}>{this.state.sliderCurrentTime}</Text>
          <MKSlider ref="timelineSlider"
                    style={styles.slider}
                    min={this.state.minTimeOffset}
                    max={this.state.maxTimeOffset}
                    lowerTrackColor='#FFFFFF'
                    onConfirm={this.sliderValueOnChange.bind(this)}/>
          <Text style={styles.sliderText}>{this.state.sliderEndTime}</Text>
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
    flex: 7,
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
    width: 220,
  },
  videoViewContainer: {
    flex: 7,
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#4E92DF'
  },
  backgroundVideo: {
    width: Dimensions.get('window').width / 2,
    height: Dimensions.get('window').height / 2
  },
  sliderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    flexDirection: 'row'
  },
  sliderText: {
    color: 'white',
    marginHorizontal: 10
  }
});
