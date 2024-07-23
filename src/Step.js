import React, { useState } from 'react';
import './Step.css';

function Step({ stepNumber, step, onRemove, addStep, disableDelete, onStepChange }) {
  const [clickCount, setClickCount] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onStepChange({ ...step, [name]: value });
  };

  const handleDeleteClick = () => {
    setClickCount(prev => prev + 1);
    setTimeout(() => {
      if (clickCount >= 1) {
        onRemove();
      }
      setClickCount(0);
    }, 300);
  };

  return (
    <div className="step">
      <div className="input-row">
        <div className="input-groupnummer">
          <label>Nummer:</label>
          <span>{stepNumber}</span>
        </div>
        <div className="input-grouptext">
          <label htmlFor={`step-beskrivelse-${step.id}`}>Step Beskrivelse:</label>
          <textarea
            id={`step-beskrivelse-${step.id}`}
            name="stepBeskrivelse"
            rows="4"
            value={step.stepBeskrivelse}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <div className="input-grouptext">
          <label htmlFor={`step-expected-${step.id}`}>Step Expected:</label>
          <textarea
            id={`step-expected-${step.id}`}
            name="stepExpected"
            rows="4"
            value={step.stepExpected}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <div className="button-group">
          <button
            className="delete-step-button"
            onClick={handleDeleteClick}
            disabled={disableDelete}
          >
            Delete Step
          </button>
          <button className="add-step-button" onClick={addStep}>Add Step</button>
        </div>
      </div>
    </div>
  );
}

export default Step;
