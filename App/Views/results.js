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

export default class Results extends Component {

  constructor(props) {
    super(props);
    this.state = {
      gsr: new Animated.Value(0),
    }
  }

  componentWillMount() {
    ReactSplashScreen.hide();
  }

  componentDidMount() {
    this.updateGSRandRedraw();
  }

  updateGSRandRedraw() {
    var timing = Animated.timing;
    var gsrValues = [100, 150, 80, 150, 200, 300, 400, 20, 35, 67, 100, 120, 69,
            150, 60, 200, 230, 450, 200, 99];
    var timingSequence = [];
    var self = this;
    gsrValues.forEach((value) => timingSequence.push(
      timing(self.state.gsr,
        {
          toValue: value,
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

var styles = StyleSheet.create({
  bar: {
    backgroundColor: '#66E5C8',
    width: 200,
  }
});
