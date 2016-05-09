import React, {
  Component,
  Text,
  View
} from 'react-native';

import MK, {
  MKButton,
} from 'react-native-material-kit';

import ConnectToHardwareModule from './../../App/Modules/ConnectToHardwareModule';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCurrentlySensing: false
    };
  }

  componentWillMount() {
    /*async function enableBluetooth() {
      try {
        let enableBluetooth = await ConnectToHardwareModule.enableBluetooth();
      } catch (e) {
        console.error(e);
      }
    }

    async function startDiscovery() {
      try {
        let prepareForDiscovery = await ConnectToHardwareModule.startDiscovery();
      } catch (e) {
        console.error(e);
      }
    }

    enableBluetooth();

    TODO: startDiscovery after enableBluetooth.
    startDiscovery();
    */
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
    /*async function getDevices() {
      try {
        let listOfDevices = await ConnectToHardwareModule.getDevices();
        console.warn(listOfDevices.length);
        console.warn(listOfDevices[0]);
      } catch (e) {
        console.error(e);
      }
    }

    getDevices();*/

    ConnectToHardwareModule.connectToShimmer();

    this.setState({isCurrentlySensing: !this.state.isCurrentlySensing});
  }
}
