import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle, ArrowUpRight, BarChart3, Bell, BookOpen, CalendarDays, Check, ChevronDown, ChevronRight,
  ClipboardCheck, Clock3, Database, Download, FileStack, FileText, Filter, LayoutDashboard, Menu,
  MoreHorizontal, Pencil, Plus, Replace, Search, Settings2, Sparkles, TrendingUp, UploadCloud, WandSparkles,
  X, Zap
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'papers', label: 'Past papers intelligence', icon: FileStack },
  { id: 'generate', label: 'Generate question paper', icon: Sparkles },
  { id: 'review', label: 'Review & similarity', icon: ClipboardCheck },
  { id: 'bank', label: 'Question bank', icon: Database },
  { id: 'analytics', label: 'Analytics & reports', icon: BarChart3 },
];

const questionsSeed = [
  { id: 1, code: 'Q-1842', text: 'Explain the role of normalization in relational database design. Compare 2NF and 3NF with examples.', topic: 'Database Design', marks: 8, level: 'Analyze', source: 'Question bank', similarity: 18, status: 'Good fit' },
  { id: 2, code: 'Q-1907', text: 'Design an ER diagram for a university course registration system and justify your cardinality choices.', topic: 'ER Modeling', marks: 10, level: 'Create', source: 'AI generated', similarity: 71, status: 'Review' },
  { id: 3, code: 'Q-1744', text: 'Write SQL queries to identify students who have completed every prerequisite for a selected course.', topic: 'SQL Queries', marks: 8, level: 'Apply', source: 'Question bank', similarity: 23, status: 'Good fit' },
  { id: 4, code: 'Q-2011', text: 'Discuss transaction isolation levels and explain a scenario where phantom reads can occur.', topic: 'Transactions', marks: 6, level: 'Understand', source: 'AI generated', similarity: 34, status: 'Good fit' },
  { id: 5, code: 'Q-1638', text: 'Evaluate the advantages and limitations of B+ tree indexing for a large-scale academic records system.', topic: 'Indexing', marks: 8, level: 'Evaluate', source: 'Question bank', similarity: 12, status: 'Good fit' },
];

const bankSeed = [
  { id: 'Q-1842', text: 'Explain the role of normalization in relational database design.', topic: 'Database Design', type: 'Long answer', level: 'Analyze', marks: 8, used: 4, updated: '12 Jun 2024', quality: 'High' },
  { id: 'Q-1907', text: 'Design an ER diagram for a university course registration system.', topic: 'ER Modeling', type: 'Long answer', level: 'Create', marks: 10, used: 1, updated: '09 Jun 2024', quality: 'Review' },
  { id: 'Q-1744', text: 'Write SQL queries to identify students who completed every prerequisite.', topic: 'SQL Queries', type: 'Problem solving', level: 'Apply', marks: 8, used: 7, updated: '28 May 2024', quality: 'High' },
  { id: 'Q-2011', text: 'Discuss transaction isolation levels and phantom reads.', topic: 'Transactions', type: 'Short answer', level: 'Understand', marks: 6, used: 2, updated: '24 May 2024', quality: 'Good' },
  { id: 'Q-1638', text: 'Evaluate B+ tree indexing for a large-scale academic records system.', topic: 'Indexing', type: 'Long answer', level: 'Evaluate', marks: 8, used: 5, updated: '14 May 2024', quality: 'High' },
  { id: 'Q-1584', text: 'Differentiate between clustered and non-clustered indexes.', topic: 'Indexing', type: 'Short answer', level: 'Understand', marks: 4, used: 9, updated: '02 May 2024', quality: 'Good' },
];

function App() {
  const [view, setView] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState('');

  const notify = (message) => {
    setToast(message);
    window.clearTimeout(window.__smartPaperToast);
    window.__smartPaperToast = window.setTimeout(() => setToast(''), 2800);
  };
  const navigate = (next) => { setView(next); setMobileOpen(false); };

  return (
    <div className="app-shell">
      <Sidebar view={view} navigate={navigate} mobileOpen={mobileOpen} />
      <div className="workspace">
        <header className="topbar">
          <div className="breadcrumb">
            <button className="mobile-menu" data-testid="button-open-menu" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Open navigation"><Menu size={17} /></button>
            <span>Faculty workspace</span><ChevronRight size={13} /><strong>{navItems.find((item) => item.id === view)?.label}</strong>
          </div>
          <div className="top-actions">
            <button className="icon-btn top-hide" data-testid="button-help" onClick={() => notify('Help centre is ready for your next question.')} aria-label="Help"><BookOpen size={16} /></button>
            <button className="icon-btn" data-testid="button-notifications" onClick={() => notify('You have 2 review alerts to look at.')} aria-label="Notifications"><Bell size={16} /></button>
            <div className="avatar" title="Dr. Ananya Rao">AR</div>
          </div>
        </header>
        <main className="main-content">
          {view === 'dashboard' && <Dashboard navigate={navigate} notify={notify} />}
          {view === 'papers' && <PapersView notify={notify} />}
          {view === 'generate' && <GenerateView navigate={navigate} notify={notify} />}
          {view === 'review' && <ReviewView notify={notify} />}
          {view === 'bank' && <BankView notify={notify} />}
          {view === 'analytics' && <AnalyticsView notify={notify} />}
        </main>
      </div>
      {toast && <div className="toast" role="status" data-testid="status-toast"><Check size={15} />{toast}</div>}
    </div>
  );
}

function Sidebar({ view, navigate, mobileOpen }) {
  return (
    <aside className={`sidebar ${mobileOpen ? 'open' : ''}`} data-testid="navigation-sidebar">
      <div className="brand">
        <div className="brand-mark"><WandSparkles size={18} /></div>
        <div><div className="brand-name">Paperwise</div><span className="brand-sub">Academic intelligence</span></div>
      </div>
      <div className="nav-label">Workspace</div>
      <nav className="nav-group" aria-label="Main navigation">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button key={id} className={`nav-item ${view === id ? 'active' : ''}`} data-testid={`nav-${id}`} onClick={() => navigate(id)}>
            <Icon /><span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="nav-label">Settings</div>
        <button className="nav-item" data-testid="nav-settings" onClick={() => {}}><Settings2 /><span>Workspace settings</span></button>
        <div className="faculty-card">
          <div className="avatar">AR</div><div><div className="faculty-name">Dr. Ananya Rao</div><div className="faculty-role">Computer Science · Faculty</div></div>
        </div>
      </div>
    </aside>
  );
}

function PageHeading({ eyebrow, title, copy, action, children }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1 data-testid="text-page-title">{title}</h1>{copy && <p className="heading-copy">{copy}</p>}</div>{action || children}</div>;
}

function Dashboard({ navigate, notify }) {
  return <>
    <PageHeading eyebrow="Tuesday · 18 June 2024" title="Good morning, Ananya." copy="Your exam planning desk is clear. Here is what needs your attention before the next assessment cycle." action={<button className="btn btn-primary" data-testid="button-generate-paper" onClick={() => navigate('generate')}><Plus size={15} /> Generate paper</button>} />
    <div className="kpi-grid">
      <Kpi label="Papers generated" value="47" foot={<><span className="positive">+8.4%</span> from last term</>} icon={FileText} />
      <Kpi label="Question bank" value="1,284" foot={<><span className="positive">+76</span> reviewed this month</>} icon={Database} />
      <Kpi label="Avg. AI accuracy" value="91.6%" foot="Across 126 generated papers" icon={Sparkles} />
      <Kpi label="Manual effort saved" value="18.4h" foot="This assessment cycle" icon={Clock3} />
    </div>
    <div className="dashboard-grid">
      <section className="surface pad trend-card">
        <div className="section-title"><div><h2>Generation activity</h2><p>Paper creation across the last 6 months</p></div><div className="trend-legend"><span><i className="legend-dot" />Papers</span><span><i className="legend-dot navy" />Questions</span></div></div>
        <TrendChart />
      </section>
      <section className="surface pad insight-card">
        <div className="section-title"><div><h2>Historical insights</h2><p>Patterns found in your archive</p></div><ArrowUpRight size={16} color="#76909c" /></div>
        <div className="insight-row"><div className="insight-num">01</div><div><b>Database Design leads</b><p>Appeared in 78% of papers across 3 years.</p></div></div>
        <div className="insight-row"><div className="insight-num">02</div><div><b>Bloom balance is shifting</b><p>Evaluate-level questions are up 14% this term.</p></div></div>
        <div className="insight-row"><div className="insight-num">03</div><div><b>Topic gap detected</b><p>Distributed systems has not appeared since 2022.</p></div></div>
      </section>
    </div>
    <div className="bottom-grid">
      <section className="surface pad">
        <div className="section-title"><div><h2>AI recommendations</h2><p>Small signals worth acting on</p></div><button className="btn btn-quiet" data-testid="button-view-recommendations" onClick={() => navigate('analytics')}>View report <ArrowUpRight size={13} /></button></div>
        <div className="recommendation"><Sparkles size={17} /><div><b>Rebalance Unit III</b><p>Current blueprint gives 40% of marks to recall. Consider moving 8 marks toward application for a stronger spread.</p></div></div>
        <div className="recommendation"><TrendingUp size={17} /><div><b>Refresh your indexing set</b><p>Three high-performing questions have not been used in the last two assessment cycles.</p></div></div>
      </section>
      <section className="surface pad">
        <div className="section-title"><div><h2>Needs attention</h2><p>Before you publish</p></div><AlertTriangle size={16} color="#b17b54" /></div>
        <div className="alert-row"><i className="alert-dot" /><div><b>2 similarity checks pending</b><span>Midterm · Database Systems</span></div></div>
        <div className="alert-row"><i className="alert-dot teal" /><div><b>Past paper processing complete</b><span>6 files ready for insights</span></div></div>
      </section>
    </div>
  </>;
}

function Kpi({ label, value, foot, icon: Icon }) {
  return <section className="surface pad kpi" data-testid={`card-kpi-${label.toLowerCase().replaceAll(' ', '-')}`}><div className="kpi-top"><span>{label}</span><span className="kpi-icon"><Icon /></span></div><div className="kpi-value">{value}</div><div className="kpi-foot">{foot}</div></section>;
}

function TrendChart() {
  return <div className="chart" data-testid="chart-generation-trend"><div className="chart-y"><span>30</span><span>20</span><span>10</span><span>0</span></div><div className="chart-grid"><i className="chart-line" /><i className="chart-line" /><i className="chart-line" /><i className="chart-line" /></div><svg viewBox="0 0 600 150" preserveAspectRatio="none" aria-label="Generation trend line chart"><path d="M0 116 C42 108 70 111 102 91 S159 104 202 78 S257 68 298 86 S352 48 399 63 S447 36 499 43 S554 31 600 18" fill="none" stroke="#4d94a7" strokeWidth="3" strokeLinecap="round" /><path d="M0 133 C47 127 67 121 104 122 S164 114 202 114 S254 96 298 106 S349 90 399 93 S455 73 500 79 S558 61 600 56" fill="none" stroke="#314561" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="5 5" /><circle cx="600" cy="18" r="4.5" fill="#4d94a7" /></svg><div className="chart-labels"><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span></div></div>;
}

function PapersView({ notify }) {
  const [processing, setProcessing] = useState(false);
  const [complete, setComplete] = useState(false);
  const [fileName, setFileName] = useState('');
  const onFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name); setProcessing(true); setComplete(false);
    window.setTimeout(() => { setProcessing(false); setComplete(true); notify('Past paper processed and added to your archive.'); }, 1800);
  };
  return <>
    <PageHeading eyebrow="Archive intelligence" title="Past papers, made legible." copy="Bring your assessment history into one calm view. Paperwise finds recurring topics, difficulty shifts, and the gaps worth planning for." action={<button className="btn btn-primary" data-testid="button-upload-paper" onClick={() => document.getElementById('paper-upload').click()}><UploadCloud size={15} /> Upload papers</button>} />
    <div className="surface pad">
      <div className="section-title"><div><h2>Paper archive</h2><p>{complete ? 'Your latest file is ready for analysis.' : 'PDF, DOCX or image · up to 20 MB per file'}</p></div>{complete && <span className="status-pill"><Check size={12} /> Analysis ready</span>}</div>
      <div className="dropzone" data-testid="dropzone-past-papers">
        <div><div className="drop-icon"><UploadCloud size={20} /></div><h3>{processing ? 'Reading your paper...' : fileName || 'Drop past papers here'}</h3><p>{processing ? 'Extracting topics, marks and question patterns' : 'or choose files from your computer'}</p>{processing ? <div className="progress-track" style={{ width: 230 }}><div className="progress-fill" style={{ width: '68%' }} /></div> : <label className="btn btn-soft" htmlFor="paper-upload" data-testid="button-choose-file">Choose files <ChevronRight size={13} /></label>}<input id="paper-upload" type="file" accept=".pdf,.docx,.png,.jpg" onChange={onFile} hidden /></div>
      </div>
    </div>
    <div className="topic-grid">
      <section className="surface pad"><div className="section-title"><div><h2>Topic frequency</h2><p>Across 42 indexed papers</p></div><button className="icon-btn" data-testid="button-topic-filter" onClick={() => notify('Topic filters are showing all subjects.')}><Filter size={15} /></button></div>
        {[['Database Design',78,'#4d94a7'],['SQL & Querying',64,'#6da6ae'],['Transactions',49,'#829dab'],['Indexing',36,'#9bb6be'],['Distributed Systems',22,'#b7cacf']].map(([name, value, color]) => <div className="topic-item" key={name}><div className="topic-line"><span>{name}</span><b>{value}%</b></div><div className="progress-track"><div className="progress-fill" style={{ width: `${value}%`, background: color }} /></div></div>)}
      </section>
      <section className="surface pad"><div className="section-title"><div><h2>Trend notes</h2><p>Evidence from your archive</p></div><Sparkles size={16} color="#568ea0" /></div>
        <div className="recommendation"><TrendingUp size={17} /><div><b>Application is gaining ground</b><p>Scenario-led questions increased from 29% to 43% since Spring 2023.</p></div></div>
        <div className="recommendation"><AlertTriangle size={17} /><div><b>Distributed systems is underrepresented</b><p>Only 4 questions map to this topic. Add a few before the next blueprint.</p></div></div>
      </section>
    </div>
  </>;
}

function GenerateView({ navigate, notify }) {
  const [step, setStep] = useState(1);
  const [details, setDetails] = useState({ course: 'Database Management Systems', code: 'CS-402', exam: 'Midterm examination', date: '2024-07-12', duration: '180', total: '60' });
  const [blueprint, setBlueprint] = useState({ understand: 12, apply: 20, analyze: 16, evaluate: 12 });
  const total = Object.values(blueprint).reduce((a, b) => a + b, 0);
  const update = (key, value) => setDetails((old) => ({ ...old, [key]: value }));
  const adjust = (key, amount) => setBlueprint((old) => ({ ...old, [key]: Math.max(0, old[key] + amount) }));
  const next = () => { if (step < 3) setStep(step + 1); else { notify('Blueprint saved. Your paper is ready for review.'); navigate('review'); } };
  return <>
    <PageHeading eyebrow="Guided generation" title="Build a paper with a point of view." copy="Set the academic intent first. The generator will keep every recommendation tied to your blueprint and the evidence in your archive." />
    <section className="surface pad">
      <div className="stepper">{['Exam details','Blueprint','Generate'].map((label, index) => <div className="step-wrap" style={{ display:'contents' }} key={label}><div className={`step ${step === index + 1 ? 'current' : step > index + 1 ? 'done' : ''}`}><span className="step-num">{step > index + 1 ? <Check size={12} /> : index + 1}</span>{label}</div>{index < 2 && <div className="step-connector" />}</div>)}</div>
      {step === 1 && <><div className="section-title"><div><h2>Tell us about this exam</h2><p>These details appear on the generated cover sheet.</p></div><span className="status-pill navy">Step 1 of 3</span></div><div className="form-grid">
        <Field label="Course name" value={details.course} onChange={(e) => update('course', e.target.value)} test="input-course-name" /><Field label="Course code" value={details.code} onChange={(e) => update('code', e.target.value)} test="input-course-code" />
        <Field label="Assessment name" value={details.exam} onChange={(e) => update('exam', e.target.value)} test="input-assessment-name" /><Field label="Exam date" type="date" value={details.date} onChange={(e) => update('date', e.target.value)} test="input-exam-date" />
        <Field label="Duration (minutes)" type="number" value={details.duration} onChange={(e) => update('duration', e.target.value)} test="input-duration" /><Field label="Total marks" type="number" value={details.total} onChange={(e) => update('total', e.target.value)} test="input-total-marks" />
        <Field label="Instructions for students" textarea value="Answer all questions. Show your assumptions and working where relevant." onChange={() => {}} test="textarea-instructions" />
      </div></>}
      {step === 2 && <><div className="section-title"><div><h2>Shape the blueprint</h2><p>Balance cognitive demand before selecting individual questions.</p></div><span className={`status-pill ${total === Number(details.total) ? '' : 'warn'}`}>{total} / {details.total} marks</span></div><div>{Object.entries(blueprint).map(([key, value]) => <div className="blueprint-row" key={key}><div className="blueprint-label">{key[0].toUpperCase() + key.slice(1)} <span className="meta">{key === 'understand' ? '· recall & explain' : key === 'apply' ? '· use concepts' : key === 'analyze' ? '· break down' : '· judge & defend'}</span></div><div className="step-control"><button data-testid={`button-decrease-${key}`} onClick={() => adjust(key, -2)} aria-label={`Decrease ${key}`}>−</button><span>{value}</span><button data-testid={`button-increase-${key}`} onClick={() => adjust(key, 2)} aria-label={`Increase ${key}`}>+</button></div><div style={{ flex:1 }}><div className="progress-track"><div className="progress-fill" style={{ width: `${(value / Number(details.total)) * 100}%` }} /></div></div></div>)}</div><div className="recommendation"><Sparkles size={17} /><div><b>Evidence-led suggestion</b><p>For Database Management Systems, a 1:1:1.3:0.8 spread mirrors your strongest historical papers.</p></div></div></>}
      {step === 3 && <><div className="section-title"><div><h2>Ready to generate</h2><p>We will select questions that satisfy the blueprint and avoid repeated phrasing.</p></div><span className="status-pill"><Check size={12} /> Blueprint valid</span></div><div className="recommendation"><WandSparkles size={17} /><div><b>{details.exam} · {details.course}</b><p>{details.total} marks · {details.duration} minutes · 5 questions · Evidence sources: 42 past papers and 1,284 bank questions.</p></div></div><div className="form-grid" style={{ marginTop: 15 }}><div className="field"><label>Source mix</label><select className="select" defaultValue="balanced" data-testid="select-source-mix"><option value="balanced">Balanced: bank + AI suggestions</option><option value="bank">Question bank only</option></select></div><div className="field"><label>Similarity threshold</label><select className="select" defaultValue="35" data-testid="select-similarity-threshold"><option value="35">Conservative · below 35%</option><option value="50">Balanced · below 50%</option></select></div></div></>}
      <div style={{ display:'flex', justifyContent:'space-between', marginTop:25 }}><button className="btn btn-quiet" data-testid="button-back-step" onClick={() => step > 1 && setStep(step - 1)}>{step > 1 ? 'Back' : 'Save as draft'}</button><button className="btn btn-primary" data-testid="button-next-step" onClick={next}>{step === 3 ? <><Sparkles size={14} /> Generate paper</> : <>Continue <ChevronRight size={14} /></>}</button></div>
    </section>
  </>;
}

function Field({ label, value, onChange, type = 'text', textarea = false, test }) {
  return <div className={`field ${textarea ? 'full' : ''}`}><label htmlFor={test}>{label}</label>{textarea ? <textarea id={test} value={value} onChange={onChange} data-testid={test} /> : <input id={test} type={type} value={value} onChange={onChange} data-testid={test} />}</div>;
}

function ReviewView({ notify }) {
  const [items, setItems] = useState(questionsSeed);
  const replaceQuestion = (id) => { setItems((old) => old.map((item) => item.id === id ? { ...item, text: 'Compare centralized and distributed database architectures for a multi-campus university.', topic: 'Architecture', similarity: 16, status: 'Replaced' } : item)); notify('Question replaced with a lower-similarity alternative.'); };
  const editQuestion = (id) => { setItems((old) => old.map((item) => item.id === id ? { ...item, text: `${item.text} Include one practical example from an academic system.` } : item)); notify('Question updated in this draft.'); };
  return <>
    <PageHeading eyebrow="Midterm · Database Management Systems" title="Review before it leaves the desk." copy="A clear audit trail makes the generated paper yours. Check wording, evidence, and balance before you publish." action={<button className="btn btn-primary" data-testid="button-export-review" onClick={() => notify('Review summary exported as PDF.')}><Download size={14} /> Export review</button>} />
    <div className="metric-grid"><Kpi label="Questions selected" value={`${items.length}/5`} foot="All blueprint slots filled" icon={ClipboardCheck} /><Kpi label="Similarity risk" value="1" foot="Question needs your eye" icon={AlertTriangle} /><Kpi label="Evidence coverage" value="96%" foot="Mapped to archive patterns" icon={Sparkles} /></div>
    <section className="surface pad view-card"><div className="section-title"><div><h2>Generated question paper</h2><p>Midterm examination · Generated a moment ago</p></div><span className="status-pill">Draft · not published</span></div>
      {items.map((item, index) => <div className="review-item" key={item.id} data-testid={`row-review-question-${item.id}`}><div className="review-index">{String(index + 1).padStart(2, '0')}</div><div><h3>{item.text}</h3><p>{item.topic} · {item.marks} marks · {item.level} · <span className="meta">{item.source}</span></p>{item.similarity > 50 && <div className="warning"><AlertTriangle size={12} /> {item.similarity}% similarity to “{item.id === 2 ? 'ER modeling fundamentals' : 'an archive question'}” · review recommended</div>}</div><div className="review-actions"><button data-testid={`button-edit-question-${item.id}`} onClick={() => editQuestion(item.id)} title="Edit question"><Pencil size={14} /></button><button data-testid={`button-replace-question-${item.id}`} onClick={() => replaceQuestion(item.id)} title="Replace question"><Replace size={14} /></button><button data-testid={`button-question-menu-${item.id}`} onClick={() => notify(`Evidence opened for ${item.code}.`)} title="View evidence"><MoreHorizontal size={15} /></button></div></div>)}
      <div style={{ display:'flex', justifyContent:'flex-end', gap:9, marginTop:17 }}><button className="btn btn-soft" data-testid="button-save-draft" onClick={() => notify('Draft saved to your workspace.')}><Check size={14} /> Save draft</button><button className="btn btn-primary" data-testid="button-publish-paper" onClick={() => notify('Paper marked ready for publishing.')}><ClipboardCheck size={14} /> Mark ready</button></div>
    </section>
  </>;
}

function BankView({ notify }) {
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('all');
  const [level, setLevel] = useState('all');
  const filtered = useMemo(() => bankSeed.filter((item) => (item.text.toLowerCase().includes(query.toLowerCase()) || item.topic.toLowerCase().includes(query.toLowerCase())) && (topic === 'all' || item.topic === topic) && (level === 'all' || item.level === level)), [query, topic, level]);
  return <>
    <PageHeading eyebrow="1,284 questions · searchable inventory" title="Find the right question." copy="Search by concept, cognitive level, or evidence quality. Your bank stays useful when the context stays visible." action={<button className="btn btn-primary" data-testid="button-add-question" onClick={() => notify('New question entry opened in a local draft.')}><Plus size={15} /> Add question</button>} />
    <section className="surface pad view-card"><div className="toolbar"><div className="searchbox"><Search size={15} /><input type="search" placeholder="Search questions or topics" value={query} onChange={(e) => setQuery(e.target.value)} data-testid="input-search-question-bank" /></div><div className="filter-row"><select className="select" value={topic} onChange={(e) => setTopic(e.target.value)} data-testid="select-topic-filter"><option value="all">All topics</option><option>Database Design</option><option>ER Modeling</option><option>SQL Queries</option><option>Transactions</option><option>Indexing</option></select><select className="select" value={level} onChange={(e) => setLevel(e.target.value)} data-testid="select-level-filter"><option value="all">All levels</option><option>Understand</option><option>Apply</option><option>Analyze</option><option>Create</option><option>Evaluate</option></select><button className="icon-btn" data-testid="button-more-filters" onClick={() => notify('Advanced filters are available in the full workspace.')}><SlidersIcon /></button></div></div>
      <div className="table-wrap"><table><thead><tr><th>Question</th><th>Topic</th><th>Level</th><th>Marks</th><th>Usage</th><th>Quality</th><th /></tr></thead><tbody>{filtered.map((item) => <tr key={item.id} data-testid={`row-bank-question-${item.id}`}><td><strong>{item.text}</strong><div className="meta">{item.id} · Updated {item.updated}</div></td><td>{item.topic}</td><td>{item.level}</td><td>{item.marks}</td><td>{item.used} uses</td><td><span className={`status-pill ${item.quality === 'Review' ? 'warn' : ''}`}>{item.quality}</span></td><td><button className="icon-btn" data-testid={`button-bank-menu-${item.id}`} onClick={() => notify(`${item.id} added to your next draft.`)}><Plus size={14} /></button></td></tr>)}{!filtered.length && <tr><td colSpan="7"><div style={{ padding:35, textAlign:'center', color:'#7d909a' }}>No questions match these filters. Try a broader concept.</div></td></tr>}</tbody></table></div><div style={{ display:'flex', justifyContent:'space-between', marginTop:13, color:'#8798a1', fontSize:10 }}><span>Showing {filtered.length} of 1,284 questions</span><button className="btn btn-quiet" data-testid="button-reset-filters" onClick={() => { setQuery(''); setTopic('all'); setLevel('all'); }}>Reset filters <X size={13} /></button></div>
    </section>
  </>;
}

function SlidersIcon() { return <Filter size={15} />; }

function AnalyticsView({ notify }) {
  const bars = [{ label:'Jan', paper:35, questions:42 }, { label:'Feb', paper:48, questions:58 }, { label:'Mar', paper:40, questions:63 }, { label:'Apr', paper:66, questions:72 }, { label:'May', paper:54, questions:81 }, { label:'Jun', paper:78, questions:94 }];
  return <>
    <PageHeading eyebrow="Evidence & outcomes" title="See what is improving." copy="A working paper system should leave more room for academic judgment. Track where the intelligence is helping, and where it needs a closer look." action={<button className="btn btn-soft" data-testid="button-export-analytics" onClick={() => notify('Analytics report exported to your downloads.')}><Download size={14} /> Export report</button>} />
    <div className="metric-grid"><Kpi label="AI accuracy" value="91.6%" foot={<><span className="positive">+3.2%</span> since March</>} icon={Sparkles} /><Kpi label="Avg. response time" value="1.8s" foot="Across 126 generation runs" icon={Zap} /><Kpi label="Faculty feedback" value="4.7/5" foot="From 38 reviewed papers" icon={ClipboardCheck} /></div>
    <div className="dashboard-grid"><section className="surface pad trend-card"><div className="section-title"><div><h2>Output over time</h2><p>Generated papers and questions indexed</p></div><select className="select" defaultValue="6" data-testid="select-analytics-period"><option value="6">Last 6 months</option><option value="12">Last 12 months</option></select></div><div className="bar-chart">{bars.map((bar, index) => <div className="bar-col" key={bar.label}><div className="bar" style={{ height:`${bar.questions}%` }} title={`${bar.questions} questions`} /><div className="bar alt" style={{ height:`${bar.paper}%` }} title={`${bar.paper} papers`} /><span className="bar-label">{bar.label}</span></div>)}</div><div className="trend-legend" style={{ marginTop:12 }}><span><i className="legend-dot" />Questions indexed</span><span><i className="legend-dot navy" />Papers generated</span></div></section><section className="surface pad insight-card"><div className="section-title"><div><h2>Manual effort reduction</h2><p>Compared with your previous workflow</p></div><TrendingUp size={16} color="#508f8f" /></div><div className="kpi-value" style={{ marginTop:22 }}>42%</div><div className="kpi-foot">Estimated time saved per paper</div><div className="progress-track" style={{ marginTop:22 }}><div className="progress-fill" style={{ width:'42%' }} /></div><div className="recommendation"><Clock3 size={16} /><div><b>18.4 hours returned</b><p>Mostly from paper comparison and first-pass question selection.</p></div></div></section></div>
    <section className="surface pad"><div className="section-title"><div><h2>Signals from faculty feedback</h2><p>What reviewers consistently notice</p></div><button className="btn btn-quiet" data-testid="button-refresh-analytics" onClick={() => notify('Analytics refreshed just now.')}><TrendingUp size={14} /> Refresh</button></div><div className="bottom-grid" style={{ gap: 12 }}><div className="recommendation"><Check size={17} /><div><b>Blueprint fidelity · 94%</b><p>Generated papers stay within the requested mark and topic distribution.</p></div></div><div className="recommendation"><Sparkles size={17} /><div><b>Evidence usefulness · 4.6/5</b><p>Reviewers find historical explanations helpful when editing.</p></div></div></div></section>
  </>;
}

export default App;