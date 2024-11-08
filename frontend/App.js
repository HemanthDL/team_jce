import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import CameraScreen from './CameraScreen';
import { ViewPropTypes } from 'deprecated-react-native-prop-types';


export default function App() {
  const [userId, setUserId] = useState('user1');
  const [duration, setDuration] = useState('');
  const [activityType, setActivityType] = useState('');
  const [recommendation, setRecommendation] = useState('');

  const submitScreenTime = async () => {
    try {
      await axios.post('http://localhost:5000/api/screen-time', {
        userId,
        date: new Date(),
        duration: parseInt(duration),
        activityType,
      });
      alert('Screen time submitted!');
    } catch (error) {
      console.error(error);
    }
  };

  const getRecommendation = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/recommendations/${userId}`);
      setRecommendation(response.data.recommendation);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <CameraScreen />
      {/* <Text>User ID:</Text>
      <TextInput value={userId} onChangeText={setUserId} style={styles.input} />

      <Text>Duration (minutes):</Text>
      <TextInput value={duration} onChangeText={setDuration} style={styles.input} keyboardType="numeric" />

      <Text>Activity Type:</Text>
      <TextInput value={activityType} onChangeText={setActivityType} style={styles.input} />

      <Button title="Submit Screen Time" onPress={submitScreenTime} />

      <Button title="Get Recommendation" onPress={getRecommendation} />

      {recommendation ? <Text>Recommendation: {recommendation}</Text> : null} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 50 },
  input: { borderWidth: 1, padding: 8, marginVertical: 10, width: '100%' },
});
