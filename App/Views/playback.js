import React, {
  Animated,
  Component,
  View,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';

import ReactSplashScreen from '@remobile/react-native-splashscreen';
import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';

var timerMixin = {
  mixins: [TimerMixin]
};

var {width, height} = Dimensions.get('window');

export default class Playback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: new Animated.Value(0),
    }
  }

  /* Splash screen is blocking the amazing animation so I setTimeout just to show the effect*/
  componentWillMount() {
    ReactSplashScreen.hide();
  }

  componentDidMount() {
    this.setTimeout(
      () => {
        Animated.timing(
          this.state.height,
          {toValue: 100}
        ).start();
      }, 2000
    );
  }

  render () {
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.bar, {height: this.state.height}]}>
        </Animated.View>
        <Image style={styles.backgroundImage} source={require('./../Images/skull.png')}/>
      </View>
     )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  backgroundImage: {
    height: height,
    width: width,
  },
  bar: {
    marginTop: 300,
    borderRadius: 5,
    backgroundColor: '#F55443',
    width: 300,
    position: 'absolute',
  }
});

reactMixin.onClass(Playback, timerMixin);
