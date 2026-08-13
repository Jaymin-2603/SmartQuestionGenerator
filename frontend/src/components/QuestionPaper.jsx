import { useState } from 'react';
import apiClient from '../services/api';

function QuestionPaper({ paper }) {
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);

  if (!paper) {
    return null;
  }

  const handleDownload = async () => {
    setDownloading(true);
    setDownloadError(null);
    try {
      const response = await apiClient.post('/generate-pdf', paper, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'question-paper.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setDownloadError('Unable to generate PDF. Is the backend running?');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section className="question-paper">
      <h2>SMART QUESTION PAPER</h2>
      <h3>{paper.subject}</h3>
      <p>{paper.exam}</p>
      <p>
        Duration: {paper.duration} &nbsp;|&nbsp; Maximum Marks: {paper.total_marks}
      </p>

      <hr />

      {paper.questions.map((q) => (
        <div className="question-row" key={q.number}>
          <p className="question-text">
            Q{q.number}. {q.question}
          </p>
          <p className="question-meta">
            [{q.marks} Marks] &middot; {q.difficulty} &middot; {q.topic}
          </p>
        </div>
      ))}

      <button type="button" onClick={handleDownload} disabled={downloading}>
        {downloading ? 'Generating PDF...' : 'Download PDF'}
      </button>
      {downloadError && <p className="error-text">{downloadError}</p>}
    </section>
  );
}

export default QuestionPaper;
