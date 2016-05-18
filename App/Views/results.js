import React, {
  Component,
  Text,
  Animated,
  View,
  Image,
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
    ReactSplashScreen.hide();
    var promise = getGSRValues();
    var self = this;
    promise.then(function(gsrValues) {
       self.setState({fetchedGsrValues: gsrValues});
       self.animateGSRValues();
    }, function(error) {
      console.log(error);
    });
  }

  animateGSRValues() {
    var timing = Animated.timing;
    var timingSequence = [];
    var self = this;
    //for testing
    // var dummyValues = [340, 500, 300, 200, 250, 100, 40, 79, 60, 450, 450, 450,
    //   23, 45, 340, 500, 300, 200, 250, 100, 40, 79, 60, 450, 450, 450, 23, 45,
    //   340, 500, 300, 200, 250, 100, 40, 79, 60, 450, 450, 450, 23, 45,340, 500,
    //   300, 200, 250, 100, 40, 79, 60, 450, 450, 450, 23, 45,340, 500, 300, 200,
    //   250, 100, 40, 79, 60, 450, 450, 450, 23, 45,340, 500, 300, 200, 250, 100,
    //   40, 79, 60, 450, 450, 450, 23, 45,340, 500, 300, 200, 250, 100, 40, 79, 60,
    //   450, 450, 450, 23, 45,340, 500, 300, 200, 250, 100, 40, 79, 60, 450, 450,
    //   450, 23, 45];
    // self.setState({fetchedGsrValues: dummyValues});
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
});
