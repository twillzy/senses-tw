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

import GlobalStyles from './../../App/Styles/globalStyles';
import ReactSplashScreen from '@remobile/react-native-splashscreen';
import ConnectToHardwareModule from './../../App/Modules/ConnectToHardwareModule';

export default class Results extends Component {

  constructor(props) {
    super(props);
    this.state = {
      timeOffsetAndGsr: new Animated.ValueXY({x: 0, y: 0}),
      fetchedGsrValues: [],
      minTimeOffset: 0,
      maxTimeOffset: 0,
    };
  }

  componentWillMount() {
    var promise = getGSRValues();
    var self = this;
    promise.then(function(gsrValues) {
      // var gsrValues = {120: 340, 200: 450, 300: 100, 400: 980, 500: 1000, 600: 89, 700: 234, 800: 789, 900: 897, 1000: 877};
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
    var bestFitTimeOffset = this.roundDownToNearestGSRValue(sliderValue);
    var bestFitGSR = this.state.fetchedGsrValues[bestFitTimeOffset];
    Animated.timing(this.state.timeOffsetAndGsr,
    {
      toValue: {x: bestFitTimeOffset, y: this.normaliseGSR(bestFitGSR)},
      easing: Easing.ease,
    }).start();
  }

  roundDownToNearestGSRValue(sliderValue) {
    sliderValue = parseInt(sliderValue);
    var timeOffsets = Object.keys(this.state.fetchedGsrValues);
    var startIndex = 0;
    var endIndex = timeOffsets.length - 1;
    var currentIndex = 0;
    while (startIndex <= endIndex) {
      currentIndex = (startIndex + endIndex) / 2 | 0;
      if (sliderValue < timeOffsets[currentIndex]) {
        endIndex = currentIndex - 1;
      } else {
        startIndex = currentIndex + 1;
      }
    }
    return timeOffsets[currentIndex];
  }

  animateGSRValues() {
    var timing = Animated.timing;
    var timingSequence = [];
    var self = this;

    this.state.timeOffsetAndGsr.x.addListener((timeOffset) => {
      console.log(timeOffset);
      this.refs.progressBar.progress = timeOffset.value / this.state.maxTimeOffset;
    });

    var timeOffsets = Object.keys(self.state.fetchedGsrValues);
    timeOffsets.forEach((timeOffset) => {
      timingSequence.push(
      timing(self.state.timeOffsetAndGsr,
        {
          toValue: {x: timeOffset, y: self.normaliseGSR(self.state.fetchedGsrValues[timeOffset])},
          easing: Easing.ease,
        }));
        timingSequence.push(Animated.delay(timeOffset | 0));
      });

    Animated.sequence(timingSequence).start();
  }

  normaliseGSR(gsrValue) {
    return (((gsrValue - this.state.minGSRValue) /
            (this.state.maxGSRValue - this.state.minGSRValue))
            * this.state.scaling)
            + this.state.offset;
  }

  render () {
    return (
      <View style={GlobalStyles.container}>
        <Animated.View style={[styles.bar, {height: this.state.timeOffsetAndGsr.y}]}>
        </Animated.View>
        <Image
          style={styles.head}
          source={require('./../Assets/images/head.png')}/>
        <MKProgress
          style={styles.slider}
          ref="progressBar"
        />

        <View style={styles.rowContainer}>
          <MKSlider
              ref="timelineSlider"
              style={styles.slider}
              min={this.state.minTimeOffset}
              max={this.state.maxTimeOffset}
              lowerTrackColor='#FFFFFF'
              onChange={(sliderValue) => {
                this.displayVisual(sliderValue)}}/>


            <MKButton
              backgroundColor="white"
              borderRadius={4}
              padding={15}
              onPress={this.animateGSRValues.bind(this)}
              >
                <Text>
                  >
                </Text>
            </MKButton>
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
