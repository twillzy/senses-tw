import React, {
  AppRegistry,
  Component,
  Navigator,
  BackAndroid,
} from 'react-native';

import Sense from './App/Views/sense';
import Playback from './App/Views/playback';

var _navigator;
BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator && _navigator.getCurrentRoutes().length > 1) {
    _navigator.pop();
    return true;
  }
  return false;
});


var RouteMapper = function(route, navigationOperations, onComponentRef) {
  _navigator = navigationOperations;

  if (route.name === 'sense') {
    return (
      <Sense/>
    );
  } else if (route.name === 'playback') {
    return (
      <Playback/>
    );
  }
};

class senses extends Component {
  render() {
    var initialRoute = {name: 'playback'};

    return (
	  <Navigator
	    initialRoute={initialRoute}
	    configureScene={() => Navigator.SceneConfigs.FadeAndroid}
	    renderScene={RouteMapper}
	    />
	);
  }
}

AppRegistry.registerComponent('senses', () => senses);
