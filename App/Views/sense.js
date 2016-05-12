import React, {
  Component,
  Text,
  View,
  StyleSheet,
} from 'react-native';

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
      <View style={styles.container}>
        <Text>Hello!</Text>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#4E92DF"
  }
});
