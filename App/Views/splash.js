import React, {
  Component,
  Text,
  View,
  StyleSheet,
  Image,
} from 'react-native';

import ConnectToHardwareModule from './../../App/Modules/ConnectToHardwareModule';

export default class Splash extends Component {
	constructor(props) {
		super(props);
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

async function enableBluetooth() {
  try {
    let enableBluetooth = await ConnectToHardwareModule.enableBluetooth();
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