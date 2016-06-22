import React, {
  Component,
  Text,
  View,
} from 'react-native';

import MK, {
  MKButton,
} from 'react-native-material-kit';

import blueToothIsToggledOn from '../../featureToggle';

import ConnectToHardwareModule from './../../App/Modules/ConnectToHardwareModule';
import ReactSplashScreen from '@remobile/react-native-splashscreen';
import GlobalStyles from './../../App/Styles/globalStyles';

export default class Connect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCurrentlySensing: false,
      isBluetoothEnabled: false,
      buttonHasBeenPressed: false,
    };
  }

  componentDidMount() {
    var self = this;
    var promise = enableBluetooth();

    promise.then((connectedToBluetooth) => {
      if (connectedToBluetooth === "OK") {
        console.log("Connected to Bluetooth - OK");
        self.setState({isBlueToothEnabled: true});
        ReactSplashScreen.hide();
      } else if (connectedToBluetooth === "CANCEL") {
        // TODO could not connect, display view here
      }
    }, (error) => {
      console.log(error);
    });
  }


  _navigate(property){
    this.props.navigator.push({
      name: property,
    });
  }

  render() {
    let buttonText = "START SENSING";

    return (
      <View style={GlobalStyles.container}>
      <MKButton
      backgroundColor="white"
      borderRadius={4}
      padding={15}
      disabled={this.state.buttonHasBeenPressed}
      onPress={this.handlePress.bind(this)}
      >
      <Text pointerEvents="none"
      style={[GlobalStyles.blueText, GlobalStyles.boldText]}>
      {buttonText}
      </Text>
      </MKButton>
      </View>
    );
  }

  handlePress(event) {
    var self = this;
    var promise = connectToShimmer();
    self.setState({buttonHasBeenPressed: true})
    promise.then(function(streamingOn) {
      console.log("streamingOn: " + streamingOn);
      if (streamingOn === "OK") {
        self.setState({isCurrentlySensing: true});
        self._navigate('sensing');
      }
    }, function(error) {
      console.error(error);
    });
  }

}

async function connectToShimmer() {
  try {
    var {
      streamingOn
    } = await ConnectToHardwareModule.connectToShimmer();
    return streamingOn;
  } catch (error) {
    console.error(error);
  }
}

async function enableBluetooth() {
  console.log("Bluetooth feature toggle: ", blueToothIsToggledOn);
  if (blueToothIsToggledOn) {
    try {
      var {
        androidDeviceBluetoothEnabled 
      } = await ConnectToHardwareModule.enableBluetooth();
      return connectedToBluetooth;
    } catch (e) {
      console.error(e);
    }
  }
  return "OK";
}
