import React, { useState, useEffect } from 'react';
import './TestCase.css';
import Step from './Step';

function TestCase({ id, krav, nummer, navn, pnummer, beskrivelse, steps, wnummer, team, onDelete, addNextTestCase, updateTestCase }) {
  const [clickCount, setClickCount] = useState(0);

  const handleKravChange = (e) => updateTestCase({ krav: e.target.value });
  const handleNummerChange = (e) => updateTestCase({ nummer: e.target.value });
  const handleNavnChange = (e) => updateTestCase({ navn: e.target.value });
  const handlePnummerChange = (e) => updateTestCase({ pnummer: e.target.value });
  const handleBeskrivelseChange = (e) => updateTestCase({ beskrivelse: e.target.value });

  const handleStepChange = (index, updatedStep) => {
    const newSteps = [...steps];
    newSteps[index] = updatedStep;
    updateTestCase({ steps: newSteps });
  };

  const addStep = (position) => {
    const newStep = { id: steps.length ? Math.max(...steps.map(s => s.id)) + 1 : 0, stepNummer: steps.length + 1, stepBeskrivelse: '', stepExpected: '' };
    const updatedSteps = [...steps];
    updatedSteps.splice(position, 0, newStep);
    updateTestCase({ steps: updatedSteps });
  };

  const removeStep = (id) => {
    if (steps.length > 1) {
      const updatedSteps = steps.filter(step => step.id !== id).map((step, index) => ({ ...step, stepNummer: index + 1 }));
      updateTestCase({ steps: updatedSteps });
    }
  };

  useEffect(() => {
    const textArea = document.getElementById(`beskrivelse-${wnummer}-${team}-${id}`);
    if (textArea) {
      textArea.rows = 7 + (steps.length - 1) * 8;
    }
  }, [steps, wnummer, team, id]);

  const handleDeleteClick = () => {
    setClickCount(prev => prev + 1);
    setTimeout(() => {
      if (clickCount >= 1) {
        onDelete();
      }
      setClickCount(0);
    }, 300);
  };

  return (
    <div className="testcase">
      <div className="input-row">
        <div className="input-group krav">
          <label htmlFor={`krav-${id}`}>Krav:</label>
          <input
            type="text"
            id={`krav-${id}`}
            name="krav"
            value={krav}
            onChange={handleKravChange}
          />
        </div>
        <div className="input-group nummer">
          <label htmlFor={`nummer-${id}`}>Nummer:</label>
          <input
            type="text"
            id={`nummer-${id}`}
            name="nummer"
            value={nummer}
            onChange={handleNummerChange}
          />
        </div>
        <div className="input-group navn">
          <label htmlFor={`navn-${id}`}>Navn:</label>
          <input
            type="text"
            id={`navn-${id}`}
            name="navn"
            value={navn}
            onChange={handleNavnChange}
          />
        </div>
        <div className="input-group">
          <label htmlFor={`pnummer-${id}`}>PNR:</label>
          <input
            type="text"
            id={`pnummer-${id}`}
            name="pnummer"
            value={pnummer}
            onChange={handlePnummerChange}
          />
        </div>
        <div className="input-group">
          <label>Designer:</label>
          <span>{wnummer}</span>
        </div>
        <div className="input-group">
          <label>Ansvarligt Team:</label>
          <span>{team}</span>
        </div>
      </div>
      <div className="content-row">
        <div className="beskrivelse-container">
          <label htmlFor={`beskrivelse-${wnummer}-${team}-${id}`}>Beskrivelse:</label>
          <textarea
            id={`beskrivelse-${wnummer}-${team}-${id}`}
            name="beskrivelse"
            rows="8"
            value={beskrivelse}
            onChange={handleBeskrivelseChange}
          ></textarea>
        </div>
        <div className="steps-container">
          {steps.map((step, index) => (
            <Step
              key={step.id}
              stepNumber={index + 1}
              step={step}
              onRemove={() => removeStep(step.id)}
              addStep={() => addStep(index + 1)}
              disableDelete={steps.length === 1}
              onStepChange={(updatedStep) => handleStepChange(index, updatedStep)}
            />
          ))}
        </div>
      </div>
      <div className="button-row">
        <button className="delete-button" onClick={handleDeleteClick}>Delete Test Case</button>
        <button className="next-button" onClick={() => addNextTestCase({ krav, nummer: nummer ? parseInt(nummer, 10) + 1 : 1 })}>Next Test Case</button>
      </div>
    </div>
  );
}

export default TestCase;
