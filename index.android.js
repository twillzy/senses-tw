import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View
} from 'react-native';

var MK = require('react-native-material-kit');
var {
  MKButton,
  MKColor,
} = MK;

class senses extends Component {
  render() {
    return (
      <View style={styles.container}>
        <MKButton
          backgroundColor="white"
          borderRadius={4}
          padding={15}
          onPress={this._handlePress}
          >
          <Text pointerEvents="none"
                style={{color: '#66E5C8', fontWeight: 'bold',}}>
            START SENSING
          </Text>
        </MKButton>
      </View>
    );
  }

  _handlePress(event) {
    console.warn('Clicked!');
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4E92DF',
  }
});

AppRegistry.registerComponent('senses', () => senses);
