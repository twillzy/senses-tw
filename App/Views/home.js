import React, {
  Component,
  Text,
  View
} from 'react-native';

import MK, {
  MKButton,
} from 'react-native-material-kit';

import ConnectToHardwareModule from './../../App/Modules/ToastModule';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCurrentlySensing: false,
    };
  }

  render() {
    let text = (this.state.isCurrentlySensing) ? "STOP SENSING" : "START SENSING";
    let backgroundColor = (this.state.isCurrentlySensing) ? "#58E2C2" : "#4E92DF";

    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: backgroundColor}}>
        <MKButton
          backgroundColor="white"
          borderRadius={4}
          padding={15}
          onPress={this.handlePress.bind(this)}
          >
          <Text pointerEvents="none"
                style={{color: '#66E5C8', fontWeight: 'bold',}}>
            {text}
          </Text>
        </MKButton>
      </View>
    );
  }

  handlePress(event) {
    // ToastAndroidLOL.show('Awesome', ToastAndroidLOL.SHORT);
    console.warn(ConnectToHardwareModule);
    ConnectToHardwareModule.connectToShimmer();
    this.setState({isCurrentlySensing: !this.state.isCurrentlySensing});
  }
}
