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
import SensesVideoView from './../../App/NativeViews/VideoView';
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
    let buttonText = "START RECORDING";

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
        <Video source={{uri: "content://media/external/video/media/22466"}}
               rate={1.0}
               volume={1.0}
               muted={false}
               paused={false}
               resizeMode="cover"
               repeat={true}
               playInBackground={false}
               playWhenInactive={false}
               onLoadStart={this.loadStart}
               onLoad={this.setDuration}
               onProgress={this.setTime}
               onEnd={this.onEnd}
               onError={this.videoError}
               style={GlobalStyles.backgroundVideo} />
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
