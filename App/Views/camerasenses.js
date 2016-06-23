import React, {
  Component,
  Text,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';

import Camera from 'react-native-camera';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class CameraSenses extends Component {

  constructor(props) {
    super(props);
    this.state = {
      image: null,
      startRecording: true,
      iconName: "fiber-manual-record"
    };
  }

  _navigate(property){
    this.props.navigator.push({
      name: property,
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
      this.refs.camera.capture({
          mode: Camera.constants.CaptureMode.video,
          target: Camera.constants.CaptureTarget.disk
        })
        .then(data => {
          console.log(data);
          this.setState({...this.state, image: data});
        })
        .catch(console.log);
      this.setState({startRecording: false, iconName: "stop"});
    } else {
      this.refs.camera.stopCapture({
        })
        .then(data => {
          console.log(data);
        })
        .catch(console.log);
      this.setState({startRecording: true, iconName: "fiber-manual-record"});
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
  recordButton: {
    marginLeft: Dimensions.get('window').width / 2 - 60,
    marginVertical: -15
  }
});
