import React, {
  Component,
  Text,
  Animated,
  View,
  StyleSheet,
  Easing,
} from 'react-native';

import GlobalStyles from './../../App/Styles/globalStyles';
import ReactSplashScreen from '@remobile/react-native-splashscreen';
import ConnectToHardwareModule from './../../App/Modules/ConnectToHardwareModule';

export default class Results extends Component {

  constructor(props) {
    super(props);
    this.state = {
      gsr: new Animated.Value(0),
      fetchedGsrValues: [],
    };
  }

  componentDidMount() {
    var promise = getGSRValues();
    var self = this;
    promise.then(function(gsrValues) {
      gsrValues.push(0);
       self.setState({fetchedGsrValues: gsrValues});
       self.animateGSR();
    }, function(error) {
      console.log(error);
    });
  }

  animateGSR() {
    var timing = Animated.timing;
    var timingSequence = [];
    var self = this;
    self.state.fetchedGsrValues.forEach((value) => timingSequence.push(
      timing(self.state.gsr,
        {
          toValue: value % 500,
          easing: Easing.ease,
        })));

    Animated.sequence(timingSequence).start();
  }

  render () {
    return (
      <View style={GlobalStyles.container}>
        <Animated.View style={[styles.bar, {height: this.state.gsr}]}>
        </Animated.View>
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
    width: 200,
  }
});
