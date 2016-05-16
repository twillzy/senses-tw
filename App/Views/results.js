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

    Animated.sequence([
              timing(this.state.gsr, {
                toValue: 100,
                easing: Easing.linear,
              }),
              Animated.delay(200),
              timing(this.state.gsr, {
                toValue: 150,
                easing: Easing.linear,
              }),
              Animated.delay(200),
              timing(this.state.gsr, {
                toValue: 80,
                easing: Easing.linear,
              }),
              Animated.delay(200),
              timing(this.state.gsr, {
                toValue: 200,
                easing: Easing.linear,
              }),
              Animated.delay(1000),
            ]).start();
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
    width: 100,
  }
});
