import React from 'react';
import PredictionForm from './components/PredictionForm';
import './App.css';

function App() {
    return (
        <div className="app-container">
            <header className="main-header">
                <div className="header-content">
                    <h1>Heart Disease Prediction System</h1>
                    <p className="header-subtitle">
                        Enter your health information to assess your risk of heart disease
                    </p>
                </div>
            </header>

            <main className="main-content">
                <div className="card-container">
                    <PredictionForm />
                </div>
            </main>

            <footer className="main-footer">
                <p className="disclaimer">
                    Note: This prediction is for educational purposes only and not a substitute 
                    for professional medical advice. Always consult with a healthcare provider 
                    for medical concerns.
                </p>
            </footer>
        </div>
    );
}

export default App;