import React, {
  Component,
  Text,
  Animated,
  View,
} from 'react-native';

import GlobalStyles from './../../App/Styles/globalStyles';

export default class Results extends Component {

  constructor(props) {
    super(props);
    this.state = {
      gsr: new Animated.Value(0),
    }
  }

  handleAnimation(nextValue) {
    this.timing = Animated.timing;

    Animated.timing(
           this.state.gsr,
           {toValue: nextValue}
         ).start();
  }


  render () {
    return (
      <View style={GlobalStyles.container}>
        <Animated.View style={[styles.bar, {height: this.state.height}]}>
        </Animated.View>
      </View>
     )
  }

  var styles = StyleSheet.create({
    bar: {
      marginTop: 300,
      borderRadius: 5,
      backgroundColor: '#F55443',
      width: 300,
      position: 'absolute',
    }
  });

}
