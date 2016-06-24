import React, {
  AppRegistry,
  Component,
  Navigator,
  BackAndroid,
} from 'react-native';

import Pairing from './App/Views/pairing';
import Results from './App/Views/results';
import CameraSenses from './App/Views/camerasenses';

let RouteMapper = (route, navigationOperations, onComponentRef) => {
  let _navigator = navigationOperations;

  if (route.name === 'pairing') {
    return <Pairing navigator={navigationOperations}/>
  } else if (route.name == 'camerasenses') {
    return <CameraSenses navigator={navigationOperations}/>
  } else if (route.name === 'results') {
    return <Results navigator={navigationOperations} videoUri={route.videoUri} {...route.passProps}/>
  }
};

class senses extends Component {
  render() {
    var initialRoute = {name: 'pairing'};

    return (
	  <Navigator
	    initialRoute={initialRoute}
	    configureScene={() => Navigator.SceneConfigs.FadeAndroid}
	    renderScene={RouteMapper}
	    />
	);
  }
}

AppRegistry.registerComponent('senseS', () => senses);
