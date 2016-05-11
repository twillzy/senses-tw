import React, {
  Component,
  Text,
  View,
  StyleSheet,
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
      isHardwareConnectedViaBT: '',
    };
  }

  componentDidMount() {
    var self = this;
    var promise = enableBluetooth();
    promise.then(function(connectedToBluetooth) {
       if (connectedToBluetooth === "OK") {
        console.log("OK");
        self.setState({isBluetoothEnabled: true});
        ReactSplashScreen.hide();
       } else if (connectedToBluetooth === "CANCEL") {
          //TODO could not connect to bluetooth, display view here
       }
    }, function(error) {
      console.log(error);
    });
  }

  render() {
    let buttonText = (this.state.isCurrentlySensing) ? "STOP SENSING" : "START SENSING";
    let backgroundColor = (this.state.isCurrentlySensing) ? "#58E2C2" : "#4E92DF";
    let errorText = (this.state.isHardwareConnectedViaBT === false) ? "Could not find a Shimmer device to connect to." : "";

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
            {buttonText}
          </Text>
        </MKButton>
        <Text style={styles.errorText}>{errorText}</Text>
      </View>
    );
  }

  handlePress(event) {
    var self = this;
    var promise = connectToShimmer();
    promise.then(function(connectedToShimmer) {
      console.log(connectedToShimmer);
      self.setState({isHardwareConnectedViaBT: connectedToShimmer});
      if (connectedToShimmer === true) {
        self.setState({isCurrentlySensing: true});
      }
    }, function(error) {
      console.error(error);
    });
  }

}

async function connectToShimmer() {
  try {
    var {
      connectedToShimmer
    } = await ConnectToHardwareModule.connectToShimmer();
    return connectedToShimmer;
  } catch (error) {
    console.error(error);
  }
}


async function enableBluetooth() {
  try {
    var {
      connectedToBluetooth
    } = await ConnectToHardwareModule.enableBluetooth();
    return connectedToBluetooth;
  } catch (e) {
    console.error(e);
  }
}

var styles = StyleSheet.create({
  errorText: {
    color: 'white',
    marginTop: 5,
  },
});
