import React, {
  Component,
  Text,
  Animated,
  View,
  Image,
  StyleSheet,
  Easing,
} from 'react-native';

import MK, {
  MKSlider,
  MKButton,
  MKProgress,
} from 'react-native-material-kit';

import blueToothIsToggledOn from '../FeatureToggles/featureToggles';

import GlobalStyles from './../../App/Styles/globalStyles';
import ReactSplashScreen from '@remobile/react-native-splashscreen';
import ConnectToHardwareModule from './../../App/Modules/ConnectToHardwareModule';

import tweenState from 'react-tween-state';


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
    };
  }

  componentWillMount() {
    var promise = getGSRValues();
    var self = this;
    promise.then(function(gsrValues) {
      if (!blueToothIsToggledOn) {
      console.log(gsrValues);
      var gsrValues = {360: 340, 1200: 450, 3300: 100, 3600: 980, 4500: 1000, 4800: 89, 8100: 234, 9000: 789, 10200: 897, 13500: 877};
      }
      self.setState({fetchedGsrValues: gsrValues});
      self.setState({minTimeOffset: parseInt(Object.keys(self.state.fetchedGsrValues)[0])});
      self.setState({maxTimeOffset: parseInt(Object.keys(self.state.fetchedGsrValues)[Object.keys(self.state.fetchedGsrValues).length - 1])});
      self.setState({minGSRValue: Math.min(...Object.values(self.state.fetchedGsrValues))});
      self.setState({maxGSRValue: Math.max(...Object.values(self.state.fetchedGsrValues))});
      console.log(self.state.fetchedGsrValues);
      self.setState({scaling: 135});
      self.setState({offset: 180});
    }, function(error) {
      console.log(error);
    });
  }

  componentDidMount() {
    ReactSplashScreen.hide();
  }

  displayVisual(sliderValue) {
    if (this.state.isReplaying === true) {
      return;
    }
    //this.state.fetchedGsrValues.stopAnimation();
    var bestFitTimeOffset = this.roundDownToNearestGSRValue(sliderValue);
    var bestFitGSR = this.state.fetchedGsrValues[bestFitTimeOffset];
    Animated.timing(this.state.timeOffsetAndGsr,
                    {
                      toValue: {x: bestFitTimeOffset, y: this.normaliseGSR(bestFitGSR)},
                      easing: tweenState.easingTypes.easeInOutCubic,
                    }).start();
  }

  roundDownToNearestGSRValue(sliderValue) {
    sliderValue = parseInt(sliderValue);
    var timeOffsets = Object.keys(this.state.fetchedGsrValues);
    var startIndex = 0;
    var endIndex = timeOffsets.length - 1;
    var currentIndex = 0;
    while (startIndex <= endIndex) {
      currentIndex = (startIndex + endIndex) / 2 || 0;
      if (sliderValue < timeOffsets[currentIndex]) {
        endIndex = currentIndex - 1;
      } else {
        startIndex = currentIndex + 1;
      }
    }
    return timeOffsets[currentIndex];
  }

  animateGSRValues() {
    this.setState({isReplaying: true});

    this.state.timeOffsetAndGsr.x.addListener((timeOffset) => {
      this.refs.timelineSlider.value = timeOffset.value;
    });

    var timing = Animated.timing;
    var timingSequence = [];
    var timeOffsets = Object.keys(this.state.fetchedGsrValues);
    var self = this;


    for (var i = 1; i < timeOffsets.length; i++) {
      var currentTimeOffset = timeOffsets[i];
      var previousTimeOffset = timeOffsets[i - 1];
      var timeDiff = currentTimeOffset - previousTimeOffset;

      //timingSequence.push(Animated.delay(timeDiff || 0));

      timingSequence.push(
        timing(self.state.timeOffsetAndGsr,
               {
                 toValue: {x: currentTimeOffset, y: self.normaliseGSR(self.state.fetchedGsrValues[currentTimeOffset])},
                 easing: Easing.linear,
                 duration: timeDiff
               }));
    }
    
    //timingSequence.push(
      //timing(self.state.timeOffsetAndGsr,
             //{
               //toValue: {x: self.state.minTimeOffset, y: self.normaliseGSR(self.state.fetchedGsrValues[self.state.minTimeOffset])},
               //easing: Easing.ease,
             //})
    //);
    
    console.log("Time offsets: ", timeOffsets);

    console.log("Timing sequence: ", timingSequence);

    Animated.sequence(timingSequence).start();
  }

  normaliseGSR(gsrValue) {
    return (((gsrValue - this.state.minGSRValue) /
             (this.state.maxGSRValue - this.state.minGSRValue))
    * this.state.scaling)
    + this.state.offset;
  }


        //onChange={(sliderValue) => {
        //this.displayVisual(sliderValue)}}/>
        
        
      //<Image
      //style={styles.head}
      //source={require('./../Assets/images/head.png')}/>

  render () {
    return (
      <View style={GlobalStyles.container}>
      <Animated.View style={[styles.bar, {height: this.state.timeOffsetAndGsr.y}]}>
      </Animated.View>

      <View style={styles.rowContainer}>
      <MKSlider
      ref="timelineSlider"
      style={styles.slider}
      min={this.state.minTimeOffset}
      max={this.state.maxTimeOffset}
      lowerTrackColor='#FFFFFF'
/>
        <MKButton
        backgroundColor="white"
        borderRadius={4}
        padding={15}
        onPress={this.animateGSRValues.bind(this)}
        >
        <Text>
        py>
        </Text>
        </MKButton>
        </View>
        </View>
    );
  }
}

async function getGSRValues() {

  if (blueToothIsToggledOn) {
    try {
      var {
        gsrVals
      } = await ConnectToHardwareModule.getGSRData();
      return gsrVals;
    } catch (error) {
      console.error(error);
    }
  }

  var gsrValues = {360: 340, 1200: 450, 3300: 100, 3600: 980, 4500: 1000, 4800: 89, 8100: 234, 9000: 789, 10200: 897, 13500: 877};
  return gsrValues;
}

var styles = StyleSheet.create({
  bar: {
    backgroundColor: '#66E5C8',
    width: 250,
    position: 'absolute',
    bottom: 180,
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
  }
});
