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
       console.warn(self.state.fetchedGsrValues);
       self.setState({minTimeOffset: parseInt(Object.keys(self.state.fetchedGsrValues)[0])});
       self.setState({maxTimeOffset: Object.keys(self.state.fetchedGsrValues)[self.state.fetchedGsrValues.length - 1]});
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
    var min = Math.min(...self.state.fetchedGsrValues);
    var max = Math.max(...self.state.fetchedGsrValues);

    var offset = 180;
    var scaling = 135;
    self.state.fetchedGsrValues.forEach((value) => {
      timingSequence.push(
      timing(self.state.gsr,
        {
          toValue: (((value - min) / (max - min)) * scaling) + offset,
          easing: Easing.ease,
        }));
      });

    Animated.sequence(timingSequence).start();
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
              onChange={(timeOffset) => {}}/>
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
  }
});
