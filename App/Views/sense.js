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
        <Text style={GlobalStyles.whiteText}>Sensing...</Text>
        <MKButton
          backgroundColor="white"
          borderRadius={4}
          padding={15}
          >
          <Text pointerEvents="none"
                style={{color: '#66E5C8', fontWeight: 'bold',}}>
            STOP SENSING
          </Text>
        </MKButton>
      </View>
    );
  }
}
