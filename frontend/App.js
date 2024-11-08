import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { useKeepAwake } from 'expo-keep-awake';

const App = () => {
  const [isUserPresent, setIsUserPresent] = useState(false);
  const [screenTime, setScreenTime] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  let timer; // To hold the interval timer

  // Keep the screen awake when the component mounts
  useKeepAwake();

  useEffect(() => {
    if (isTracking) {
      // Start the timer with setInterval
      timer = setInterval(() => {
        setScreenTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      // Clear the timer when tracking ends
      if (timer) {
        clearInterval(timer);
      }
    }

    // Cleanup on unmount
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isTracking]);

  const startTracking = () => {
    setIsTracking(true);
    setScreenTime(0);
  };

  const stopTracking = () => {
    setIsTracking(false);
  };

  const handleFaceDetected = (faces) => {
    setIsUserPresent(faces.faces.length > 0);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {isTracking ? (
        <RNCamera
          style={{ flex: 1, width: '100%' }}
          type={RNCamera.Constants.Type.front}
          onFacesDetected={handleFaceDetected}
          faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.accurate}
        />
      ) : (
        <Text style={{ fontSize: 20, marginBottom: 20 }}>Press "Start" to monitor screen time.</Text>
      )}
      <Text>Screen Time: {screenTime} seconds</Text>
      <Button title={isTracking ? "Stop" : "Start"} onPress={isTracking ? stopTracking : startTracking} />
    </View>
  );
};

export default App;
