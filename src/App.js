import React, { useState } from 'react';
import './App.css';
import TestCase from './TestCase';
import * as XLSX from 'xlsx';

function App() {
  const [designer, setDesigner] = useState('');
  const [team, setTeam] = useState('');
  const [testCases, setTestCases] = useState([]);

  const addTestCase = (initialValues = {}) => {
    setTestCases([
      ...testCases,
      {
        id: testCases.length ? Math.max(...testCases.map(tc => tc.id)) + 1 : 0,
        nummer: initialValues.nummer || '',
        krav: initialValues.krav || '',
        navn: '',
        pnr: '',
        beskrivelse: 'Formål:\nForudsætninger:',
        steps: [{ id: 0, stepNummer: 1, stepBeskrivelse: '', stepExpected: '' }]
      },
    ]);
  };

  const updateTestCase = (id, updatedValues) => {
    setTestCases(testCases.map(tc => tc.id === id ? { ...tc, ...updatedValues } : tc));
  };

  const deleteTestCase = (id) => {
    setTestCases(testCases.filter(tc => tc.id !== id));
  };

  const logDataset = () => {
    const dataset = [];
    testCases.forEach(tc => {
      tc.steps.forEach(step => {
        dataset.push({
          Subject: '',
          'Test Name': String(tc.krav) + "-" + String(Number(tc.nummer) + 10000).slice(1) + " " + String(tc.navn),
          Type: 'Manual',
          Eksekveringsform: 'Manuel',
          Prioritet: '1. Skal',
          'Del af regressionstest': 'Nej',
          Designer: designer,
          'Ansvarlig team': team,
          Status: 'Færdig, klar til brug',
          Comments: '',
          PNR: String(tc.pnr),
          Description: 'PNR: ' + String(tc.pnr) + "\n" + String(tc.beskrivelse),
          'Step Name (Design Steps)': step.stepNummer,
          'Description (Design Steps': "PNR: " + String(tc.pnr) + "\n\n" + String(step.stepBeskrivelse),
          'Expected Results (Design Steps)': step.stepExpected,
          'Faktisk Resultat': '',
          Gennemførelsesstatus: 'No Run',
          Tester: '',
          'testcasehjælperlinjerherefter': '||||',
          krav: tc.krav,
          nummer: String(Number(tc.nummer) + 10000).slice(1),
          navn: tc.navn,
          pnr: tc.pnr,
          designer,
          team,
          beskrivelse: tc.beskrivelse,
          stepNummer: step.stepNummer,
          stepBeskrivelse: step.stepBeskrivelse,
          stepExpected: step.stepExpected,
        });
      });
    });

    // Create a worksheet from the dataset
    const worksheet = XLSX.utils.json_to_sheet(dataset);
    // Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "TestCases");

    // Create a binary string from the workbook and trigger a download
    XLSX.writeFile(workbook, "TestCases.xlsx");

    console.log(dataset);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const importedTestCases = [];

      jsonData.forEach(row => {
        const { krav, nummer, navn, pnr, beskrivelse, stepNummer, stepBeskrivelse, stepExpected } = row;

        let testCase = importedTestCases.find(tc => tc.krav === krav && tc.nummer === nummer);
        if (!testCase) {
          testCase = {
            id: importedTestCases.length ? Math.max(...importedTestCases.map(tc => tc.id)) + 1 : 0,
            krav,
            nummer,
            navn,
            pnr,
            beskrivelse,
            steps: []
          };
          importedTestCases.push(testCase);
        }

        testCase.steps.push({
          id: testCase.steps.length ? Math.max(...testCase.steps.map(s => s.id)) + 1 : 0,
          stepNummer,
          stepBeskrivelse,
          stepExpected
        });
      });

      setTestCases(importedTestCases);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>TestCaseHelper</h1>
      </header>
      <div className="input-container">
        <div className="input-group">
          <label htmlFor="designer">Designer:</label>
          <input
            type="text"
            id="designer"
            name="designer"
            value={designer}
            onChange={(e) => setDesigner(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="ansvarligt-team">Ansvarligt Team:</label>
          <input
            type="text"
            id="ansvarligt-team"
            name="ansvarligt-team"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
          />
        </div>
      </div>
      <div className="testcase-container">
        {testCases.map((tc) => (
          <TestCase
            key={tc.id}
            {...tc}
            designer={designer}
            team={team}
            onDelete={() => deleteTestCase(tc.id)}
            addNextTestCase={(values) => addTestCase(values)}
            updateTestCase={(updatedValues) => updateTestCase(tc.id, updatedValues)}
          />
        ))}
      </div>
      <button className="add-button" onClick={() => addTestCase()}>Add Test Case</button>
      <button className="log-dataset-button" onClick={logDataset}>Log Dataset</button>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        style={{ marginTop: '20px' }}
      />
    </div>
  );
}

export default App;
