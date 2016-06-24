import React, {
  Component,
  Text,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';

import Camera from 'react-native-camera';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ConnectToHardwareModule from './../../App/Modules/ConnectToHardwareModule';

export default class CameraSenses extends Component {

  constructor(props) {
    super(props);
    this.state = {
      videoUri: null,
      startRecording: true,
      iconName: "fiber-manual-record"
    };
  }

  navigate(property){
    this.props.navigator.push({
      name: property,
      videoUri: this.state.videoUri
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Camera ref="camera"
                aspect={Camera.constants.Aspect.Fill}
                style={styles.preview}/>
        <Icon.Button name={this.state.iconName}
              size={100}
              color="red"
              backgroundColor="black"
              borderRadius={0}
              iconStyle={styles.recordButton}
              onPress={this.record.bind(this)}>
        </Icon.Button>
      </View>
    );
  }

  record() {
    if (this.state.startRecording) {
      startStreaming().then((streamingStatus) => {
        if (streamingStatus === 'streaming') {
          this.refs.camera.capture({
              mode: Camera.constants.CaptureMode.video,
              target: Camera.constants.CaptureTarget.disk
            })
            .then(data => {
              console.log(data);
              this.setState({...this.state, videoUri: data});
            })
            .catch(console.log);
          this.setState({startRecording: false, iconName: "stop"});
        }
      });
    } else {
      stopStreaming().then((streamingStatus) => {
        if (streamingStatus === 'stopped') {
          this.refs.camera.stopCapture({
            })
            .then(data => {
              console.log(data);
              this.navigate('results');
            })
            .catch(console.log);
        }
      });
    }
  }
}

async function startStreaming() {
  try {
    var {
      streamingStatus
    } = await ConnectToHardwareModule.startStreaming();
    return streamingStatus;
  } catch(e) {
    console.log(e);
  }
}

async function stopStreaming() {
  try {
    var {
      streamingStatus
    } = await ConnectToHardwareModule.stopShimmerStreaming();
    return streamingStatus;
  } catch (e) {
    console.log(e);
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
  recordButton: {
    marginLeft: Dimensions.get('window').width / 2 - 60,
    marginVertical: -15
  }
});
