import QuestionForm from '../components/QuestionForm';
import QuestionPaper from '../components/QuestionPaper';
import Validation from '../components/Validation';
import mockQuestionPaper from '../data/mockQuestionPaper.json';

// Phase 2 (AI generation) is not implemented yet, so this page previews
// Phase 3 (validation + PDF) against the shared mock question paper.
function GeneratorPage() {
  const questionPaper = mockQuestionPaper;

  return (
    <div className="generator-page">
      <h1>Smart Question Paper Generator</h1>

      <QuestionForm />
      <QuestionPaper paper={questionPaper} />
      <Validation paper={questionPaper} />
    </div>
  );
}

export default GeneratorPage;
