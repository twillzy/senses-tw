import React, {
  Component,
  Text,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';

import Camera from 'react-native-camera';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import ConnectToHardwareModule from './../../App/Modules/ConnectToHardwareModule';

export default class CameraSenses extends Component {

  constructor(props) {
    super(props);
    this.state = {
      videoUri: null,
      startRecording: true,
      iconName: "fiber-manual-record",
      cameraType: "back",
      timeLapse: 0,
      timerID: 0,
      timer: "00:00:00"
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
        <View style={styles.timerCameraContainer}>
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>{this.state.timer}</Text>
          </View>
          <FAIcon.Button name="camera"
                         size={30}
                         color="white"
                         backgroundColor="black"
                         borderRadius={0}
                         iconStyle={styles.cameraButton}
                         onPress={this.switchCamera.bind(this)}>
          </FAIcon.Button>
        </View>
        <Camera ref="camera"
                aspect={Camera.constants.Aspect.Fill}
                type={this.state.cameraType}
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

  convertTime(seconds) {
    let hr = 0;
    let min = 0;
    let sec = 0;

    hr = parseInt(seconds / 3600);
    min = parseInt((seconds % 3600) / 60);
    sec = (seconds % 3600) % 60;

    if (hr < 10) hr = "0" + hr.toString();
    if (min < 10) min = "0" + min.toString();
    if (sec < 10) sec = "0" + sec.toString();

    return hr.toString() + ":" + min.toString() + ":" + sec.toString();
  }

  startTimer() {
    let timerID = setInterval(() => {
      this.setState({timeLapse: this.state.timeLapse + 1});
      this.setState({timer: this.convertTime(this.state.timeLapse)});
    }, 1000);

    this.setState({timerID: timerID});
  }

  stopTimer() {
    clearInterval(this.state.timerID);
  }

  switchCamera() {
    switch (this.state.cameraType) {
      case "front":
        this.setState({cameraType: "back"});
        break;
      case "back":
        this.setState({cameraType: "front"});
        break;
      default:
        break;
    }
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
          this.startTimer();
          this.setState({startRecording: false, iconName: "stop"});
        }
      });
    } else {
      this.stopTimer();
      stopStreaming().then((streamingStatus) => {
        if (streamingStatus === 'stopped') {
          this.refs.camera.stopCapture({
            })
            .then(data => {
              console.log(data);
              this.stopTimer();
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
  },
  timerCameraContainer: {
    backgroundColor: 'black',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  timerText: {
    color: 'white',
    fontSize: 20,
    marginLeft: 10
  },
  timerContainer: {
    justifyContent: 'center'
  }
});
