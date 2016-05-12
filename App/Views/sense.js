import React, {
  Component,
  Text,
  View,
} from 'react-native';

import MK, {
  MKButton,
  MKSpinner,
} from 'react-native-material-kit';

import GlobalStyles from './../../App/Styles/globalStyles';

export default class Sense extends Component {

  // var SingleColorSpinner = MKSpinner.singleColorSpinner()
  // .withStyle(GlobalStyles.spinner)
  // .build();

  constructor(props) {
    super(props);
  }

  _navigate(property){
    this.props.navigator.push({
      name: property,
    });
  }

  render() {
    return (
      <View style={GlobalStyles.container}>
        <MKSpinner
          style={GlobalStyles.spinner}
          strokeColor='white'/>

        <Text>Sensing...</Text>
      </View>
    );
  }
}
