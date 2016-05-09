import React, {
  Component,
  Text,
  View,
  StyleSheet,
  Image,
} from 'react-native';

import ConnectToHardwareModule from './../../App/Modules/ConnectToHardwareModule';
import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';

var splashMixin = {
  mixins: [TimerMixin],

  getInitialState: function() {
    return {
      isBluetoothEnabled: false,
    }
  }
};

export default class Splash extends Component {
	constructor(props) {
		super(props);
	}

  static initialState;

  componentDidMount() {
    this.setTimeout(
      () => {
        enableBluetooth();
      }, 2000
    );
  }

	render() {
		return (
			<View style={styles.container}>
				<Image style={styles.centered} source={{uri: 'http://mcdaniel.hu/wp-content/uploads/2015/01/6784063-cute-cats-hd.jpg'}} />
        <Text style={styles.whiteText}>SenseS</Text>
	    </View>
    );
	}
}

reactMixin.onClass(Splash, splashMixin);

async function enableBluetooth() {
  try {
    var {
      RESULT_CODE
    } = await ConnectToHardwareModule.enableBluetooth();
    console.log(RESULT_CODE);
  } catch (e) {
    console.error(e);
  }
}

async function isBluetoothEnabled() {
  try {
    let isBluetoothEnabled = await ConnectToHardwareModule.isBluetoothEnabled();
  } catch (e) {
    console.error(e);
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4E92DF",
    flexDirection: 'column',
  },
  whiteText: {
  	color: 'white',
    fontSize: 40,
  	alignSelf: 'center',
  },
  centered: {
  	marginTop: 100,
  	alignSelf: 'center',
  	width: 200,
  	height: 200,
  },
});
