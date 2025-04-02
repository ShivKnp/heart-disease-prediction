import React, { useState } from 'react';
import axios from 'axios';
import './PredictionForm.css';

function PredictionForm() {
    const [formData, setFormData] = useState({
        age: 30,
        sex: '0',
        cp: '0',
        trestbps: 120,
        chol: 200,
        fbs: '0',
        restecg: '0',
        thalach: 150,
        exang: '0',
        oldpeak: 0.0,
        slope: '0',
        ca: '0',
        thal: '1'
    });
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTooltip, setActiveTooltip] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});

    const medicalInfo = {
        age: "Your current age in years. Age is an important risk factor for heart disease, with higher risk as age increases.",
        
        sex: "Biological sex assigned at birth (0 = Female, 1 = Male). Men typically have a higher risk of heart disease at an earlier age compared to women.",
        
        cp: "Chest pain type:\n" +
            "0: Typical angina – Chest pain related to heart disease, often triggered by exertion and relieved by rest or nitroglycerin.\n" +
            "1: Atypical angina – Chest pain that doesn’t follow the usual pattern, may feel like discomfort rather than pain.\n" +
            "2: Non-anginal pain – Chest pain that is not related to heart disease, often due to other conditions like acid reflux or muscle strain.\n" +
            "3: Asymptomatic – No chest pain, but other risk factors may still indicate heart disease.",
        
        trestbps: "Resting blood pressure measured in mm Hg at hospital admission.\n" +
                  "Normal range: 90-120 mmHg (systolic) / 60-80 mmHg (diastolic).\n" +
                  "Higher values may indicate hypertension, increasing heart disease risk.",
        
        chol: "Serum cholesterol level measured in mg/dL.\n" +
              "Normal: Less than 200 mg/dL.\n" +
              "High cholesterol can lead to plaque buildup in arteries, increasing heart disease risk.",
        
        fbs: "Fasting blood sugar level greater than 120 mg/dL (measured after 8+ hours of fasting).\n" +
             "0 = Normal (below 120 mg/dL), 1 = High (above 120 mg/dL).\n" +
             "High fasting blood sugar may indicate diabetes, which is a risk factor for heart disease.",
        
        restecg: "Resting electrocardiographic (ECG) results:\n" +
                 "0: Normal – No significant abnormalities detected in heart activity.\n" +
                 "1: ST-T wave abnormality – May indicate heart strain or ischemia (reduced blood supply to the heart).\n" +
                 "2: Left ventricular hypertrophy – Thickening of the heart’s left ventricle, often due to high blood pressure or heart disease.",
        
        thalach: "Maximum heart rate achieved during a stress test.\n" +
                 "Normal resting heart rate: 60-100 bpm.\n" +
                 "Lower peak heart rates during exercise may indicate underlying heart conditions.",
        
        exang: "Exercise-induced angina (chest pain triggered by physical exertion).\n" +
               "0 = No angina during exercise.\n" +
               "1 = Angina present during exercise, which may suggest coronary artery disease.",
        
        oldpeak: "ST depression induced by exercise, measured in mm.\n" +
                 "Normal: 0-1 mm.\n" +
                 "Higher values may indicate insufficient blood supply to the heart during exertion.",
        
        slope: "Slope of the ST segment during peak exercise (ECG finding):\n" +
               "0: Upsloping – Generally considered normal or less concerning.\n" +
               "1: Flat – May indicate possible heart disease or reduced blood flow to the heart.\n" +
               "2: Downsloping – Strongly associated with heart disease and ischemia.",
        
        ca: "Number of major coronary arteries (0-3) with detectable blockages, assessed by fluoroscopy:\n" +
            "0: No major blockages detected – Indicates healthy arteries with normal blood flow.\n" +
            "1: One major vessel is affected – Mild coronary artery disease.\n" +
            "2: Two major vessels are affected – Moderate coronary artery disease, requiring monitoring or treatment.\n" +
            "3: Three major vessels are affected – Severe coronary artery disease, significantly increasing heart attack risk.",
        
        thal: "Thalassemia: A genetic blood disorder affecting hemoglobin production, leading to reduced oxygen transport and anemia:\n" +
              "1: Normal – No blood disorder, hemoglobin functions properly.\n" +
              "2: Fixed defect – A permanent abnormality in red blood cells, leading to chronic anemia that does not improve with treatment.\n" +
              "3: Reversible defect – A temporary or treatable issue affecting red blood cells, which may improve with treatment or medication."
    };
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        
        // Clear error when user starts typing
        if (fieldErrors[name]) {
            setFieldErrors({
                ...fieldErrors,
                [name]: null
            });
        }
    };

    const validateForm = () => {
        const errors = {};
        const requiredFields = ['age', 'trestbps', 'chol', 'thalach', 'oldpeak'];
        
        requiredFields.forEach(field => {
            if (!formData[field] && formData[field] !== 0) {
                errors[field] = 'This field is required';
            }
        });

        // Validate numerical ranges
        if (formData.age && (formData.age < 0 || formData.age > 120)) {
            errors.age = 'Age must be between 0-120';
        }
        
        if (formData.trestbps && (formData.trestbps < 50 || formData.trestbps > 300)) {
            errors.trestbps = 'Blood pressure must be between 50-300 mmHg';
        }
        
        if (formData.chol && (formData.chol < 100 || formData.chol > 600)) {
            errors.chol = 'Cholesterol must be between 100-600 mg/dl';
        }
        
        if (formData.thalach && (formData.thalach < 60 || formData.thalach > 250)) {
            errors.thalach = 'Heart rate must be between 60-250 bpm';
        }
        
        if (formData.oldpeak && (formData.oldpeak < 0 || formData.oldpeak > 10)) {
            errors.oldpeak = 'ST depression must be between 0-10';
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            // Convert data to proper types for the API
            const apiData = {
                ...formData,
                age: parseFloat(formData.age),
                trestbps: parseFloat(formData.trestbps),
                chol: parseFloat(formData.chol),
                thalach: parseFloat(formData.thalach),
                oldpeak: parseFloat(formData.oldpeak)
            };

            const response = await axios.post('http://localhost:3001/api/predict', apiData);
            if (response.data.status === 'success') {
                setPrediction(response.data);
            } else {
                setError(response.data.message || 'Prediction failed');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Error making prediction');
            console.error('Prediction error:', err);
        } finally {
            setLoading(false);
        }
    };

    const renderInputField = (name, label, type = 'number', extraProps = {}) => (
        <div className="form-group">
            <div className="label-container">
                <label>{label}</label>
                <span 
                    className="info-icon"
                    onMouseEnter={() => setActiveTooltip(name)}
                    onMouseLeave={() => setActiveTooltip(null)}
                >i</span>
            </div>
            {activeTooltip === name && <div className="tooltip">{medicalInfo[name]}</div>}
            <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className={fieldErrors[name] ? 'error' : ''}
                {...extraProps}
            />
            {fieldErrors[name] && <span className="validation-error">{fieldErrors[name]}</span>}
        </div>
    );

    const renderSelectField = (name, label, options) => (
        <div className="form-group">
            <div className="label-container">
                <label>{label}</label>
                <span 
                    className="info-icon"
                    onMouseEnter={() => setActiveTooltip(name)}
                    onMouseLeave={() => setActiveTooltip(null)}
                >i</span>
            </div>
            {activeTooltip === name && <div className="tooltip">{medicalInfo[name]}</div>}
            <select
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className={fieldErrors[name] ? 'error' : ''}
            >
                {options.map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                ))}
            </select>
            {fieldErrors[name] && <span className="validation-error">{fieldErrors[name]}</span>}
        </div>
    );

    return (
        <div className="prediction-form animated fadeIn">
            <div className="form-header">
                <h2>Heart Disease Risk Assessment</h2>
                <p className="form-subtitle">Please fill in your health information below</p>
            </div>
            
            <form onSubmit={handleSubmit} className="animated slideInUp">
                {renderInputField('age', 'Age', 'number', {
                    required: true,
                    min: 0,
                    max: 120,
                    step: 1,
                    placeholder: 'e.g. 45'
                })}
                
                {renderSelectField('sex', 'Sex', [
                    ['0', 'Female'],
                    ['1', 'Male']
                ])}
                
                {renderSelectField('cp', 'Chest Pain Type', [
                    ['0', 'Typical angina'],
                    ['1', 'Atypical angina'],
                    ['2', 'Non-anginal pain'],
                    ['3', 'Asymptomatic']
                ])}
                
                {renderInputField('trestbps', 'Resting Blood Pressure (mm Hg)', 'number', {
                    required: true,
                    min: 50,
                    max: 300,
                    step: 1,
                    placeholder: 'e.g. 120'
                })}
                
                {renderInputField('chol', 'Cholesterol Level (mg/dl)', 'number', {
                    required: true,
                    min: 100,
                    max: 600,
                    step: 1,
                    placeholder: 'e.g. 200'
                })}
                
                {renderSelectField('fbs', 'Fasting Blood Sugar > 120 mg/dl', [
                    ['0', 'False'],
                    ['1', 'True']
                ])}
                
                {renderSelectField('restecg', 'Resting ECG Results', [
                    ['0', 'Normal'],
                    ['1', 'ST-T wave abnormality'],
                    ['2', 'Left ventricular hypertrophy']
                ])}
                
                {renderInputField('thalach', 'Maximum Heart Rate Achieved', 'number', {
                    required: true,
                    min: 60,
                    max: 250,
                    step: 1,
                    placeholder: 'e.g. 150'
                })}
                
                {renderSelectField('exang', 'Exercise Induced Angina', [
                    ['0', 'No'],
                    ['1', 'Yes']
                ])}
                
                {renderInputField('oldpeak', 'ST Depression Induced by Exercise', 'number', {
                    required: true,
                    min: 0,
                    max: 10,
                    step: 0.1,
                    placeholder: 'e.g. 0.0'
                })}
                
                {renderSelectField('slope', 'Peak Exercise ECG', [
                    ['0', 'Upsloping'],
                    ['1', 'Flat'],
                    ['2', 'Downsloping']
                ])}
                
                {renderSelectField('ca', 'Number of Major Vessels (0-3)', [
                    ['0', '0'],
                    ['1', '1'],
                    ['2', '2'],
                    ['3', '3']
                ])}
                
                {renderSelectField('thal', 'Thalassemia Type', [
                    ['1', 'Normal'],
                    ['2', 'Fixed defect'],
                    ['3', 'Reversible defect']
                ])}
                
                <button 
                    type="submit" 
                    disabled={loading}
                    className={`submit-btn ${loading ? 'loading' : ''}`}
                >
                    {loading ? (
                        <>
                            <span className="spinner"></span>
                            Analyzing...
                        </>
                    ) : (
                        'Assess My Heart Disease Risk'
                    )}
                </button>
            </form>
            
            {error && (
                <div className="error-message animated shake">
                    <p>⚠️ {error}</p>
                </div>
            )}
            
            {prediction && (
                <div className={`result animated fadeIn ${prediction.prediction ? 'high-risk' : 'low-risk'}`}>
                    <h3>Your Heart Health Assessment</h3>
                    <div className="result-content">
                        <p className="risk-level">
                            {prediction.prediction ? 'Higher Risk Detected' : 'Lower Risk Detected'}
                        </p>
                        <p className="probability">
                            Probability: <strong>{(prediction.probability * 100).toFixed(2)}%</strong>
                        </p>
                        <div className="recommendation">
                            {prediction.prediction ? (
                                <>
                                    <p>We recommend consulting with a healthcare professional for further evaluation.</p>
                                    <p>Consider lifestyle changes like improved diet and regular exercise.</p>
                                </>
                            ) : (
                                <p>Your results suggest lower risk, but maintain healthy habits for continued heart health.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
            
            <div className="disclaimer">
                <p>Note: This assessment is for informational purposes only and not a substitute for professional medical advice.</p>
            </div>
        </div>
    );
}

export default PredictionForm;