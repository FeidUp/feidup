#!/bin/bash
# Start FeidUp ML API Service

echo "==================================="
echo "Starting FeidUp ML API Service"
echo "==================================="

# Navigate to ML service directory
cd "$(dirname "$0")"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install/update dependencies
echo "Installing dependencies..."
pip install -q -r ../requirements.txt

# Check if model exists
if [ ! -f "models/gradient_boost_model.pkl" ]; then
    echo ""
    echo "⚠️  No trained model found!"
    echo "Training initial model..."
    python model.py --train
fi

# Start the API server
echo ""
echo "Starting ML API server..."
python api.py
