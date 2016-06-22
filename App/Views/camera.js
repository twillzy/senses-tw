import React, {
  Component,
  Text,
  View,
  Image,
} from 'react-native';

import GlobalStyles from './../../App/Styles/globalStyles';
import ReactSplashScreen from '@remobile/react-native-splashscreen';
import MK, {
  MKButton,
} from 'react-native-material-kit';
import VideoCaptureModule from './../../App/Modules/VideoCaptureModule';
import Video from 'react-native-video';

export default class Camera extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  _navigate(property){
    this.props.navigator.push({
      name: property,
    });
  }

  componentDidMount() {
    ReactSplashScreen.hide();
  }

  render() {
    let buttonText = "Start Session";

    return (
      <View style={GlobalStyles.container}>
        <MKButton
          backgroundColor="white"
          borderRadius={4}
          padding={15}
          onPress={this.handlePress.bind(this)}
          >
          <Text style={[GlobalStyles.blueText, GlobalStyles.boldText]}>
            {buttonText}
          </Text>
        </MKButton>
      </View>
    );
  }

  handlePress(event) {
    var promise = captureVideo();
    promise.then((streamUrl) => {
      console.log("Stream Url is " + streamUrl);
    }, (error) => {
      console.log(error);
    })
  }
}

async function captureVideo() {
  try {
    var {
      streamUrl
    } = await VideoCaptureModule.captureVideo();
    return streamUrl;
  } catch (error) {
    console.error(error);
  }
}
