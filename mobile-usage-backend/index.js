const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/screenTimeApp', {
  //useNewUrlParser: true,
  //useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'));

// Schema and Model
const screenTimeSchema = new mongoose.Schema({
  userId: String,
  date: Date,
  duration: Number,  // in minutes
  activityType: String, // "study", "games", "social"
});

const ScreenTime = mongoose.model('ScreenTime', screenTimeSchema);

// API Endpoint: Post screen time data
app.post('/analyze', (req, res) => {
    const { user_id } = req.body;
  
    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }
  
    // Process the user_id here
    res.json({ message: `Analysis for user ${user_id} completed.` });
  });

const sendScreenTimeToServer = async () => {
  try {
    await axios.post('http://localhost:5000/api/screen-time', {
      userId: 'child1',  // example user ID
      date: new Date(),
      duration: screenTime,  // total screen time in seconds
      activityType: 'screen-time',  // categorize the activity
    });
  } catch (error) {
    console.error('Error sending screen time data:', error);
  }
};

// API Endpoint: Get screen time data for AI recommendations
app.get('/api/recommendations/:userId', async (req, res) => {
  const { userId } = req.params;
  // Retrieve last 7 days of screen time data
  const screenTimes = await ScreenTime.find({ userId }).sort({ date: -1 }).limit(7);
  
  // Here you can integrate a Python AI model for recommendations
  // For now, we provide a basic time suggestion without AI
  const dailyLimit = 120; // Set a daily limit of 2 hours
  const totalUsage = screenTimes.reduce((sum, record) => sum + record.duration, 0);
  
  let recommendation;
  if (totalUsage > dailyLimit) {
    recommendation = "Reduce screen time, try more outdoor activities.";
  } else {
    recommendation = "Great balance! Keep it up.";
  }

  res.json({ recommendation });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
