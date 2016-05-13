import React, {
  Component,
  Text,
  View,
} from 'react-native';

import MK, {
  MKButton,
  MKSpinner,
} from 'react-native-material-kit';

import GlobalStyles from './../../App/Styles/globalStyles';
import ConnectToHardwareModule from './../../App/Modules/ConnectToHardwareModule';

export default class Sense extends Component {

  constructor(props) {
    super(props);
    this.state = {
      buttonHasBeenPressed: false,
    };
  }

  _navigate(property){
    this.props.navigator.push({
      name: property,
    });
  }

  render() {
    return (
      <View style={GlobalStyles.container}>
        <MKSpinner
          style={GlobalStyles.spinner}
          strokeColor='white'/>
        <Text style={GlobalStyles.whiteText}>Sensing...</Text>
        <MKButton
          backgroundColor="white"
          borderRadius={4}
          padding={15}
          disabled={this.state.buttonHasBeenPressed}
          onPress={this.handlePress.bind(this)}
          >
          <Text pointerEvents="none"
                style={[GlobalStyles.blueText, GlobalStyles.boldText]}>
            STOP SENSING
          </Text>
        </MKButton>
      </View>
    );
  }

  handlePress(event) {
    var self = this;
    self.setState({buttonHasBeenPressed: true});
    stopStreaming();
    self._navigate('results');
  }

}

async function stopStreaming() {
  try {
    var {

    } = await ConnectToHardwareModule.stopShimmerStreaming();
  } catch (error) {
    console.error(error);
  }
}
