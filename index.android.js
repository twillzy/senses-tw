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

  constructor(props) {
    super(props); 
    this.state = {
      isCurrentlySensing: false,
    };
  }

  render() {
    var text = (this.state.isCurrentlySensing) ? "STOP SENSING" : "START SENSING";

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
            {text}
          </Text>
        </MKButton>
      </View>
    );
  }

  _handlePress(event) {
    console.warn("clicked!");
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
