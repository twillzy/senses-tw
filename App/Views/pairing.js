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

import ReactSplashScreen from '@remobile/react-native-splashscreen';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import EvilIcon from 'react-native-vector-icons/EvilIcons'

export default class Pairing extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showButton: true
    };
  }

  componentDidMount() {
    ReactSplashScreen.hide();
  }

  render() {
    const mkButton =  (
      <MKButton backgroundColor="white"
        borderRadius={4}
        style={styles.pairButton}
        onPress={this.handlePress.bind(this)}>
          <Text>Pair Device</Text>
      </MKButton>);

    const mkSpinner = (
      <MKSpinner style={styles.spinner}
                 strokeColor="white" />);

    const mkSpinnerText = (
      <Text style={styles.spinnerText}>Pairing with Shimmer</Text>
    );

    return (
      <View style={styles.container}>
        <View style={styles.logo}>
          <FontAwesomeIcon name="snapchat-ghost"
                           size={150}
                           color="white">
          </FontAwesomeIcon>
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
    this.setState({showButton: false});
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
  }
});
