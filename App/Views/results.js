import React, {
  Component,
  Text,
  View,
} from 'react-native';

import GlobalStyles from './../../App/Styles/globalStyles';

export default class Results extends Component {
  render() {
    return (
      <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.whiteText}>Results Page</Text>
      </View>
    );
  }
}
