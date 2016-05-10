import React, {
  Component,
  Text,
  View,
  StyleSheet,
  Navigator,
  Image,
} from 'react-native';

import ConnectToHardwareModule from './../../App/Modules/ConnectToHardwareModule';
import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';

var splashMixin = {
  mixins: [TimerMixin],
};

export default class Splash extends Component {
	constructor(props) {
		super(props);
    this.state = {
      isBluetoothEnabled: false
    };
	}

  _navigate(property) {
    console.log(property);
    this.props.navigator.push({
      name: property,
      passProps: {
        name: property
      }
    })
  }

  componentDidMount() {
    var self = this;
    this.setTimeout(
      () => {
        var promise = enableBluetooth();

        promise.then(function(resultCode) {
           if (resultCode === "OK") {
            self.setState({isBluetoothEnabled: true});
            self._navigate('sense');
            // self._navigate(this.props.navigator.push({
            //   name: 'sense',
            // }));
           } else if (resultCode === "CANCEL") {
              //TODO message
           }
        }, function(error) {
          console.log(error);
        });

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
      resultCode
    } = await ConnectToHardwareModule.enableBluetooth();
    return resultCode;
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
