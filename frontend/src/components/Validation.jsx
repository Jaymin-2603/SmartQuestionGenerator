import { useEffect, useState } from 'react';
import apiClient from '../services/api';

function Validation({ paper }) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!paper) {
      return undefined;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    apiClient
      .post('/validate', paper)
      .then((response) => {
        if (!cancelled) setResult(response.data);
      })
      .catch(() => {
        if (!cancelled) setError('Unable to validate question paper. Is the backend running?');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [paper]);

  if (loading) {
    return <section className="validation">Validating...</section>;
  }

  if (error) {
    return <section className="validation validation-error">{error}</section>;
  }

  if (!result) {
    return null;
  }

  const marksOk = result.total_marks.valid;
  const duplicatesOk = result.duplicate_questions === 0;
  const fieldsOk = result.missing_fields.length === 0;
  const marksAllValid = result.invalid_marks.length === 0;
  const difficultyOk = result.invalid_difficulty.length === 0;
  const mark = (ok) => (ok ? '✓' : '✗');

  return (
    <section className="validation">
      <h2>PAPER VALIDATION</h2>
      <ul>
        <li className={marksOk ? 'pass' : 'fail'}>
          {mark(marksOk)} Total Marks: {result.total_marks.actual} / {result.total_marks.expected}
        </li>
        <li className="pass">{mark(true)} Questions: {result.question_count}</li>
        <li className={duplicatesOk ? 'pass' : 'fail'}>
          {mark(duplicatesOk)} Duplicate Questions: {result.duplicate_questions}
        </li>
        <li className={fieldsOk ? 'pass' : 'fail'}>
          {mark(fieldsOk)} Required Fields: {fieldsOk ? 'Valid' : 'Missing fields found'}
        </li>
        <li className={marksAllValid ? 'pass' : 'fail'}>
          {mark(marksAllValid)} Marks: {marksAllValid ? 'Valid' : 'Invalid marks found'}
        </li>
        <li className={difficultyOk ? 'pass' : 'fail'}>
          {mark(difficultyOk)} Difficulty: {difficultyOk ? 'Valid' : 'Invalid difficulty found'}
        </li>
        <li className="pass">
          {mark(true)} Topic Distribution: {Object.keys(result.topics).length > 0 ? 'Available' : 'Unavailable'}
        </li>
      </ul>
      <p className={result.valid ? 'verdict pass' : 'verdict fail'}>
        {result.valid ? 'PAPER VALID' : 'PAPER INVALID'}
      </p>
    </section>
  );
}

export default Validation;
