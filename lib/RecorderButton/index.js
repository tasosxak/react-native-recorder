import React, { Component } from 'react';
import {
  TouchableOpacity,
  View,
  LayoutAnimation,
} from 'react-native';
import PropTypes from 'prop-types'
import styles from './style';


export default class RecorderButton extends Component {

 

  static propTypes = {
    isRecording: PropTypes.bool,
    onStartPress: PropTypes.func,
    onStopPress: PropTypes.func,
    style: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
  }


  
  renderWaiting() {
    return (
      <TouchableOpacity onPress={ this.props.onTakePicture } onLongPress={this.props.onStartPress} onPressOut={this.props.onStopPress} style={[styles.buttonContainer, this.props.style]}>
        <View style={styles.circleInside}></View>
      </TouchableOpacity>
    );
  }

  render() {
 
      return this.renderWaiting();
   
 }
}