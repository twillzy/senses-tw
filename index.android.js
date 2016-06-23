import React, {
  AppRegistry,
  Component,
  Navigator,
  BackAndroid,
} from 'react-native';

import Pairing from './App/Views/pairing';
import Connect from './App/Views/connect';
import Sense from './App/Views/sense';
import Results from './App/Views/results';
import CameraSenses from './App/Views/camerasenses';

var _navigator;

var RouteMapper = function(route, navigationOperations, onComponentRef) {
  _navigator = navigationOperations;

  if (route.name === 'pairing') {
    return <Pairing navigator={navigationOperations} />
  } else if (route.name === 'connecting') {
    return <Connect navigator={navigationOperations}/>
  } else if (route.name === 'sensing') {
    return <Sense navigator={navigationOperations}/>
  } else if (route.name === 'results') {
    return <Results navigator={navigationOperations}/>
  } else if (route.name == 'camerasenses') {
    return <CameraSenses navigator={navigationOperations}/>
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
