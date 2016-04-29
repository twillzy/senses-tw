import React, {
  AppRegistry,
  Component,
} from 'react-native';

import Home from './App/Views/home';

class senses extends Component {
  render() {
    return (
      <Home/>
    );
  }
}

AppRegistry.registerComponent('senses', () => senses);
