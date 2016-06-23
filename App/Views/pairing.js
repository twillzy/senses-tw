import React, {
  Component,
  Text,
  View,
  Image,
  StyleSheet
} from 'react-native';

import MK, {
  MKButton,
  MKSpinner
} from 'react-native-material-kit';

import ConnectToHardwareModule from './../../App/Modules/ConnectToHardwareModule';
import ReactSplashScreen from '@remobile/react-native-splashscreen';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import EvilIcon from 'react-native-vector-icons/EvilIcons'

export default class Pairing extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showButton: true,
      buttonText: 'Pair Device',
      showConnectStatusMessage: false,
      connectStatusMessage: '',
      streamReady: false
    };
  }

  componentDidMount() {
    ReactSplashScreen.hide();
  }

  navigate(property){
    this.props.navigator.push({
      name: property,
    });
  }

  render() {
    const mkButton =  (
      <MKButton backgroundColor="white"
        borderRadius={4}
        style={styles.pairButton}
        onPress={this.handlePress.bind(this)}>
          <Text>{this.state.buttonText}</Text>
      </MKButton>);

    const mkSpinner = (
      <MKSpinner style={styles.spinner}
                 strokeColor="white" />);

    const mkSpinnerText = (
      <Text style={styles.spinnerText}>Pairing with Shimmer</Text>
    );

    const connectStatusMessage = (
      <Text style={styles.connectStatusMessage}>{this.state.connectStatusMessage}</Text>
    );

    return (
      <View style={styles.container}>
        <View style={styles.logo}>
          <FontAwesomeIcon name="snapchat-ghost"
                           size={150}
                           color="yellow">
          </FontAwesomeIcon>
        </View>
        <View style={styles.connectStatusMessageContainer}>
          {this.state.showConnectStatusMessage && connectStatusMessage}
        </View>
        <View style={styles.pairButtonContainer}>
          {this.state.showButton && mkButton}
        </View>
        <View style={styles.spinnerContainer}>
          {!this.state.showButton && mkSpinner}
          {!this.state.showButton && mkSpinnerText}
        </View>
      </View>
    );
  }

  handlePress() {
    if (this.state.streamReady) {
      this.navigate('camerasenses');
    } else {
      this.setState({showButton: false, showConnectStatusMessage: false});
      connectToShimmer().then((connectionStatus) => {
        if (connectionStatus === 'connected') {
          const connectStatusMessage = "Great, your devices have been paired\nsuccessfully!"
          this.setState({buttonText: 'Start Session', showButton: true, showConnectStatusMessage: true, connectStatusMessage: connectStatusMessage, streamReady: true});
        } else {
          const connectStatusMessage = "Unfortunately your connection attempt\nwas unsuccessful, please try again";
          this.setState({showButton: true, showConnectStatusMessage: true, connectStatusMessage: connectStatusMessage});
        }
      });
    }
  }
}

async function connectToShimmer() {
  try {
    var {
      connectionStatus
    } = await ConnectToHardwareModule.connectToShimmer();
    return connectionStatus;
  } catch (error) {
    console.error(error);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4DB9DF',
  },
  logo: {
    marginTop: 150,
    marginBottom: 50,
    justifyContent: 'center',
    flexDirection: 'row'
  },
  pairButtonContainer: {
    alignItems: 'center'
  },
  pairButton: {
    paddingVertical: 15,
    paddingHorizontal: 30
  },
  spinnerContainer: {
    marginTop: 120,
    justifyContent: 'center',
    alignItems: 'center'
  },
  spinner: {
    width: 40,
    height: 40,
    marginBottom: 10
  },
  spinnerText: {
    color: 'white'
  },
  connectStatusMessageContainer: {
    alignItems: 'center',
    marginTop: -20,
    marginBottom: 20
  },
  connectStatusMessage: {
    color: 'white',
    textAlign: 'center'
  }
});
