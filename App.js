/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React , { useRef } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    TouchableOpacity
} from 'react-native';

import RNrecorder from './lib'

const App: () => React$Node = () => {
    const videoRecorder = useRef(null)
    function startRecorder () {
      if (videoRecorder && videoRecorder.current) {
        videoRecorder.current.open({ maxLength: 30 }, (data) => {
          console.log('captured data', data);
        })
      }
    }
  
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <View style={styles.body}>
              <View style={styles.sectionContainer}>
                <TouchableOpacity onPress={startRecorder} style={styles.btnCapture}>
                  <Text style={styles.sectionTitle}>Launch</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
        <RNrecorder ref={videoRecorder} userPhoto={'https://avatars0.githubusercontent.com/u/22960469?s=460&v=4'}compressQuality={'medium'} />
      </>
    );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "white",
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: "white",
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: "black",
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: "black",
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: "black",
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;