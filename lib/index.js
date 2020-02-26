import { RNCamera } from 'react-native-camera';
import React, { Component } from 'react';
import {
  Modal,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text,
  InteractionManager,
  Image,
  ImageBackground
} from 'react-native';

import PropTypes from 'prop-types'
import moment from 'moment';

import RecorderButton from './RecorderButton';
import styles, { buttonClose, durationText, renderClose, renderDone } from './style';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Video from 'react-native-video';

export default class RNrecorder extends Component {

  constructor(...props) {
    super(...props);
    this.state = {
      isOpen: this.props.isOpen,
      loading: true,
      time: 0,
      recorded: false,
      recordedData: null,
      cameraMode: false,
      saved: false
    };
  }

  static propTypes = {
    isOpen: PropTypes.bool,
    runAfterInteractions: PropTypes.bool,
    cameraOptions: PropTypes.shape({}),
    recordOptions: PropTypes.shape({}),
    buttonCloseStyle: PropTypes.shape({}),
    durationTextStyle: PropTypes.shape({}),
    renderClose: PropTypes.func,
    renderDone: PropTypes.func,
  }

  static defaultProps = {
    isOpen: false,
    runAfterInteractions: true,
    cameraOptions: {},
    recordOptions: {},
    buttonCloseStyle: buttonClose,
    durationTextStyle: durationText,
    renderClose,
    renderDone,
  }


  componentDidMount() {
    const doPostMount = () => this.setState({ loading: false });
    if (this.props.runAfterInteractions) {
      InteractionManager.runAfterInteractions(doPostMount);
    } else {
      doPostMount();
    }
  }

  onSave = () => {

    console.log(this.state.recordedData);
    
    if (this.callback) {
      this.callback(this.state.recordedData);
    }
    this.setState({saved:true},()=>
    {
      this.close();
    })
    
  }

  open = (options, callback) => {
    this.callback = callback;
    this.setState({
      maxLength: -1,
      ...options,
      isOpen: true,
      isRecording: false,
      time: 0,
      recorded: false,
      recordedData: null,
      converting: false,
      saved: false,
    });
  }

  close = () => {

    if (this.state.recordedData != null && !this.state.saved) {
      this.setState({ recorded: false, recordedData: null });
    }
    else {
      this.setState({ isOpen: false });
    }

  }

  startCapture = () => {

    const shouldStartCapture = () => {
      this.camera.recordAsync(this.props.recordOptions)
        .then((data) => {
          
          this.setState({
            recorded: true,
            recordedData: {type:1,...data},
          });

        }).catch(err => console.error(err));
      setTimeout(() => {
        this.startTimer();
        this.setState({
          isRecording: true,
          recorded: false,
          recordedData: null,
          videoMode: true,
          time: 0,
        });
      });
    };
    if ((this.state.maxLength > 0) || (this.state.maxLength < 0)) {
      if (this.props.runAfterInteractions) {
        InteractionManager.runAfterInteractions(shouldStartCapture);
      } else {
        shouldStartCapture();
      }
    }
  }

  stopCapture = () => {


    const shouldStopCapture = () => {
      this.stopTimer();
      this.camera.stopRecording();
      this.setState({
        isRecording: false,
      });
    };
    if (this.props.runAfterInteractions) {
      InteractionManager.runAfterInteractions(shouldStopCapture);
    } else {
      shouldStopCapture();
    }
  }

  takePicture = async () => {

    if (this.camera) {
      const options = { quality: 0.8, base64: true };
      const data = await this.camera.takePictureAsync(options);
      delete data['base64'];
      this.setState({ recordedData: {type:0,...data} });
    }
  };


  startTimer = () => {
    this.timer = setInterval(() => {
      const time = this.state.time + 1;
      this.setState({ time });
      if (this.state.maxLength > 0 && time >= this.state.maxLength) {
        this.stopCapture();
      }
    }, 1000);
  }

  stopTimer = () => {
    if (this.timer) clearInterval(this.timer);
  }

  convertTimeString = (time) => {
    return moment().startOf('day').seconds(time).format('mm:ss');
  }

  renderTimer() {
    const { isRecording, time, recorded } = this.state;
    return (
      <View>
        {
          (recorded || isRecording) &&
          <Text style={this.props.durationTextStyle}>
            <Text style={styles.dotText}>●</Text> {this.convertTimeString(time)}
          </Text>
        }
      </View>
    );
  }

  renderContent() {
    const { isRecording, recorded } = this.state;
    return (

      <View style={{ flex: 1, alignContent: 'space-between' }}>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start' }}>

          {this.renderTimer()}

        </View>
        <View style={{ flex: 0.4, flexDirection: 'column', justifyContent: 'flex-end' }}>


          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

            <View style={{ flex: 0.3, height: 40, width: 40, justifyContent: 'center', alignItems: 'center' }}>

            </View>
            <RecorderButton style={[styles.recodingButton]} isRecording={isRecording} onTakePicture={this.takePicture} onStartPress={this.startCapture}
              onStopPress={this.stopCapture} />
            {
              recorded &&
              <TouchableOpacity onPress={this.onSave} style={styles.btnUse}>
                {this.props.renderDone()}
              </TouchableOpacity>
            }
            <View style={{ flex: 0.3, height: 40, width: 40, justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => this.setState({ cameraMode: !this.state.cameraMode })}>
                <Icon style={{
                  backgroundColor: 'transparent',
                }} name="switch-camera" size={42} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </View>
    );
  }


  renderVideoContent() {

    return (

      <View style={{ flex: 1, alignContent: 'space-between' }}>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start' }}>

         

        </View>
        <View style={{ flex: 0.4, flexDirection: 'column', justifyContent: 'flex-end' }}>


          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',paddingLeft:25, paddingRight: 25 }}>

          <View style={{borderRadius:40,padding:2,backgroundColor:'white'}}>
          <Image style={{height:40,width:40,borderRadius:40}} source={{uri:this.props.userPhoto}} />
</View>

            <View style={{}}>
             <TouchableOpacity onPress={this.onSave}>
                <View style={{ flexDirection:'row',alignItems:'center',paddingLeft:20,justifyContent:'center', backgroundColor: 'white', borderRadius: 25, padding: 10 }}>
                  <Text style={{ color: 'black' }}>Αποθήκευση</Text>
                  <Icon name="keyboard-arrow-right" size={22} color="black" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </View>
    );

  }


  renderPhotoContent() {

    return (

      <View style={{ flex: 1, alignContent: 'space-between' }}>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start' }}>

          

        </View>
        <View style={{ flex: 0.4, flexDirection: 'column', justifyContent: 'flex-end' }}>


           <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',paddingLeft:25, paddingRight: 25 }}>

          <View style={{borderRadius:40,padding:2,backgroundColor:'white'}}>
          <Image style={{height:40,width:40,borderRadius:40}} source={{uri:this.props.userPhoto}} />
</View>
            <View style={{}}>
              <TouchableOpacity onPress={this.onSave}>
                <View style={{ flexDirection:'row',alignItems:'center',paddingLeft:20,justifyContent:'center', backgroundColor: 'white', borderRadius: 25, padding: 10 }}>
                  <Text style={{ color: 'black' }}>Αποθήκευση</Text>
                  <Icon name="keyboard-arrow-right" size={22} color="black" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </View>
    );
  }

  renderCamera() {

    if (this.state.recordedData != null && this.state.recordedData.type  == 0) {
      return (
        <View style={styles.preview}>
          <ImageBackground style={{ width: '100%', height: '100%'}} imageStyle={{resizeMode: 'contain'}} source={{ uri: this.state.recordedData.uri }}>
            {this.renderPhotoContent()}
          </ImageBackground>
        </View>
      )

    }
    else if (this.state.recorded) {

      return (
        <View style={styles.preview}>

          <Video source={{ uri: this.state.recordedData.uri }}   // Can be a URL or a local file.
            ref={(ref) => {
              this.player = ref
            }}                                      // Store reference
            repeat={true}
            
            resizeMode={"cover"}
            style={styles.backgroundVideo} />
          {this.renderVideoContent()}
        </View>
      )
    }
    return (

      <RNCamera
        ref={(cam) => { this.camera = cam; }}
        type={this.state.cameraMode ? RNCamera.Constants.Type.back : RNCamera.Constants.Type.front}
        style={styles.preview}
        {...this.props.cameraOptions}
        captureAudio
      >
        {this.renderContent()}
      </RNCamera>

    );
  }


  render() {
    const { loading, isOpen } = this.state;
    if (loading) return <View />;
    return (
      <Modal visible={isOpen} transparent animationType="fade"
        onRequestClose={this.close}>
        <View style={styles.modal}>
          <TouchableWithoutFeedback onPress={this.close}>
            <View style={styles.backdrop} />
          </TouchableWithoutFeedback>
          <View style={styles.container}>
            <View style={styles.content}>
              {this.renderCamera()}
            </View>

            <TouchableOpacity onPress={this.close} style={this.props.buttonCloseStyle}>
              {this.props.renderClose()}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

}
