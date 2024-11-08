import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Camera ready callback to ensure it has initialized
  const handleCameraReady = () => {
    setCameraReady(true);
  };

  // Conditional rendering based on permission and camera ready state
  if (hasPermission === null) {
    return <Text>Requesting for camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {hasPermission && (
        <Camera
          style={styles.camera}
          type={cameraType}
          onCameraReady={handleCameraReady}
        >
          {cameraReady && (
            <View style={styles.buttonContainer}>
              <Button
                title="Flip Camera"
                onPress={() => {
                  setCameraType(
                    cameraType === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back
                  );
                }}
              />
            </View>
          )}
        </Camera>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end', // Align button to the bottom of the camera view
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30, // Adjust button positioning from the bottom
    alignSelf: 'center',
    zIndex: 1, // Ensure the button is on top of the camera view
  },
});
