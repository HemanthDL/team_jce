from flask import Flask, request, jsonify
import pandas as pd
from sklearn.linear_model import LinearRegression
from datetime import datetime, timedelta
import json

app = Flask(__name__)

# Sample data for training (mocked data in a real scenario, this would be replaced by a real database)
# Data columns: user_id, date, duration (minutes), activity_type
sample_data = [
    {"user_id": "user1", "date": "2023-11-01", "duration": 120, "activity_type": "study"},
    {"user_id": "user2", "date": "2023-11-02", "duration": 150, "activity_type": "games"},
    {"user_id": "user3", "date": "2023-11-03", "duration": 90, "activity_type": "social"},
    # Additional sample records...
]

# Mock data for converting sample data to a DataFrame
data = pd.DataFrame(sample_data)

@app.route('/analyze', methods=['POST'])
def analyze_screen_time():
    user_id = request.json.get('user_id')
    user_data = data[data["user_id"] == user_id]

    if user_data.empty:
        return jsonify({"message": "No data available for the user1."}), 404

    # Preprocess data
    user_data["date"] = pd.to_datetime(user_data["date"])
    user_data.sort_values(by="date", inplace=True)
    X = user_data.index.values.reshape(-1, 1)  # Day index as feature
    y = user_data["duration"].values  # Duration as target

    # Simple Linear Regression model
    model = LinearRegression()
    model.fit(X, y)

    # Prediction for the next day’s screen time usage
    next_day_index = X[-1] + 1
    predicted_duration = model.predict([[next_day_index]])[0]

    # Provide recommendation based on predicted duration
    daily_limit = 120  # Example daily limit in minutes
    recommendation = "Reduce screen time, focus on offline activities." if predicted_duration > daily_limit else "Good balance. Continue with current routine."

    return jsonify({
        "user_id": user_id,
        "predicted_duration": predicted_duration,
        "recommendation": recommendation
    })

if __name__ == '__main__':
    app.run(port=5001, debug=True)
