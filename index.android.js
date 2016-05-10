import React, {
  AppRegistry,
  Component,
  Navigator,
  BackAndroid,
} from 'react-native';

import Splash from './App/Views/splash';
import Sense from './App/Views/sense';

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
  } 
};

class senses extends Component {
  render() {
    var initialRoute = {name: 'sense'};

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
