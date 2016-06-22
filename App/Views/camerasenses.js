import React, {
  Component,
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from 'react-native';

import ReactSplashScreen from '@remobile/react-native-splashscreen';
import MK, { MKButton } from 'react-native-material-kit';
import Video from 'react-native-video';
import Camera from 'react-native-camera';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class CameraSenses extends Component {

  constructor(props) {
    super(props);
    this.state = {
      image: null,
      startRecording: true
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
    return (
      <View style={styles.container}>
        <Camera ref="camera"
                aspect={Camera.constants.Aspect.Fill}
                style={styles.preview}/>
        <TouchableOpacity style={styles.captureContainer} onPress={this.record.bind(this)}>
          <Text style={styles.capture}>[START RECORD]</Text>
        </TouchableOpacity>
      </View>
    );
  }

  record() {
    if (this.state.startRecording) {
      this.refs.camera.capture({
          mode: Camera.constants.CaptureMode.video,
          target: Camera.constants.CaptureTarget.disk
        })
        .then(data => {
          console.log(data);
          this.setState({...this.state, image: data});
        })
        .catch(console.log);
      this.setState({startRecording: false});
    } else {
      this.refs.camera.stopCapture({
        })
        .then(data => {
          console.log(data);
        })
        .catch(console.log);
      this.setState({startRecording: true});
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  captureContainer: {
    position: 'absolute',
    top: 100
  },
  capture: {
    alignSelf: 'center',
    marginVertical: 16
  },
});
