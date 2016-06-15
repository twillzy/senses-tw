import { PropTypes } from 'react';
import { requireNativeComponent, View } from 'react-native';

var sensesVideoView = {
  name: 'VideoView',
  propTypes: {
    streamUrl: PropTypes.string,
    ...View.propTypes // include the default view properties
  },
};

module.exports = requireNativeComponent('SensesVideoView', sensesVideoView);
