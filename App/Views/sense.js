import React, {
  Component,
  Text,
  View,
  Image,
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
      <Image source={require('./../Assets/images/loading.gif')}/>
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

  //handlePress(event) {
    //var self = this;
    //self.setState({buttonHasBeenPressed: true});
    //disconnectShimmerFromAndroid().then(() => {
                                        //console.log("Disconnected Shimmer from Android");
    //});
  //}

  handlePress(event) {
    var self = this;
    console.log(self.state.buttonHasBeenPressed);
    //self.setState({buttonHasBeenPressed: true});
    stopStreaming().then((streamingStatus) => {
      console.log(streamingStatus);
      //disconnectShimmerFromAndroid();
      if (streamingStatus === "STOPPED") {
        self._navigate('results');
      }
    });
  }
}

async function disconnectShimmerFromAndroid() {
  console.log("Disconnecting shimmer from Android");
  try {
    var {
      connectionStatus
    } = await ConnectToHardwareModule.disconnectShimmerFromAndroidDevice();
  } catch (error) {
    console.log(error);
  } 
}

async function stopStreaming() {
  console.log("Stopping streaming service");
  try {
    var {
      streamingStatus
    } = await ConnectToHardwareModule.stopShimmerStreaming();
  } catch (error) {
    console.error(error);
  }
}
