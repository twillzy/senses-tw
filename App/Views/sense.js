import React, {
  Component,
  Text,
  View,
} from 'react-native';

import MK, {
  MKButton,
} from 'react-native-material-kit';

import ConnectToHardwareModule from './../../App/Modules/ConnectToHardwareModule';
import ReactSplashScreen from '@remobile/react-native-splashscreen';

export default class Sense extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCurrentlySensing: false,
      isBluetoothEnabled: false,
    };
  }

  componentDidMount() {
    var self = this;
    var promise = enableBluetooth();
    promise.then(function(resultCode) {
       if (resultCode === "OK") {
        console.log("OK");
        self.setState({isBluetoothEnabled: true});
        ReactSplashScreen.hide();
       } else if (resultCode === "CANCEL") {
          //TODO message
       }
    }, function(error) {
      console.log(error);
    });
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
    ConnectToHardwareModule.connectToShimmer();

    // this.setState({isCurrentlySensing: !this.state.isCurrentlySensing});
  }

}


async function enableBluetooth() {
  try {
    var {
      resultCode
    } = await ConnectToHardwareModule.enableBluetooth();
    return resultCode;
  } catch (e) {
    console.error(e);
  }
}
