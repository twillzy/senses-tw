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
} from 'react-native-material-kit';

import GlobalStyles from './../../App/Styles/globalStyles';
import ReactSplashScreen from '@remobile/react-native-splashscreen';
import ConnectToHardwareModule from './../../App/Modules/ConnectToHardwareModule';

export default class Results extends Component {

  constructor(props) {
    super(props);
    this.state = {
      gsr: new Animated.Value(0),
      fetchedGsrValues: [],
      minTimeOffset: 0,
      maxTimeOffset: 0,
    };
  }

  componentWillMount() {
    var promise = getGSRValues();
    var self = this;
    // this.dummyValues = [{timeOffset: 123, averageGSRValue: 123}, {timeOffset: 456, averageGSRValue: 456}];
    // this.setState({fetchedGsrValues: this.dummyValues});
    promise.then(function(gsrValues) {
       self.setState({fetchedGsrValues: gsrValues});
       self.setState({minTimeOffset: parseInt(Object.keys(self.state.fetchedGsrValues)[0])});
       self.setState({maxTimeOffset: parseInt(Object.keys(self.state.fetchedGsrValues)[Object.keys(self.state.fetchedGsrValues).length - 1])});
       self.setState({minGSRValue: Math.min(...Object.values(self.state.fetchedGsrValues))});
       self.setState({maxGSRValue: Math.max(...Object.values(self.state.fetchedGsrValues))});

       console.log("===============");
       console.log(self.state.fetchedGsrValues);
       console.log(self.state.minTimeOffset);
       console.log(self.state.maxTimeOffset);
       console.log(self.state.maxGSRValue);
       console.log(self.state.minGSRValue);

       self.setState({scaling: 135});
       self.setState({offset: 180});

       let timelineSlider = self.refs.timelineSlider;
    }, function(error) {
      console.log(error);
    });
  }

  componentDidMount() {
    ReactSplashScreen.hide();
  }

  animateGSRValues() {
    var timing = Animated.timing;
    var timingSequence = [];
    var self = this;

    self.state.fetchedGsrValues.forEach((value) => {
      timingSequence.push(
      timing(self.state.gsr,
        {
          toValue: (((value - self.state.minGSRValue) /
                  (self.state.maxGSRValue - self.state.minGSRValue))
                  * self.state.scaling)
                  + self.state.offset,
          easing: Easing.ease,
        }));
      });

    Animated.sequence(timingSequence).start();
  }

  displayVisual(newValueInDecimals) {
    var bestFitGSR = this.roundDownToNearestGSRValue(newValueInDecimals); //TODO
    Animated.timing(this.state.gsr,
    {
      toValue: (((bestFitGSR - this.state.minGSRValue) /
              (this.state.maxGSRValue - this.state.minGSRValue))
              * this.state.scaling)
              + this.state.offset,
      easing: Easing.ease,
    }).start();
  }

  render () {
    return (
      <View style={GlobalStyles.container}>
        <Animated.View style={[styles.bar, {height: this.state.gsr}]}>
        </Animated.View>
        <Image
          style={styles.head}
          source={require('./../Assets/images/head.png')}/>
          <MKSlider
              ref="timelineSlider"
              style={styles.slider}
              min={this.state.minTimeOffset}
              max={this.state.maxTimeOffset}
              lowerTrackColor='#FFFFFF'
              onChange={(timeOffset) => {this.displayVisual(timeOffset)}}/>
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
  head: {
    height: 500,
    width: 300,
    alignSelf: 'center',
  },
  slider: {
    width: 300,
    marginBottom: 100,
  }
});
