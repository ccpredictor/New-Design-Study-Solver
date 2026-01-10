
import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { generateExamPaper } from '../services/geminiService';

const PaperDesignerScreen: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [grade, setGrade] = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [chapterContent, setChapterContent] = useState('');
  const [marks, setMarks] = useState('20');
  const [lang, setLang] = useState('English');
  const [includeAnswers, setIncludeAnswers] = useState(true);
  const [paper, setPaper] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pdfData, setPdfData] = useState<string | null>(null);
  const [pdfName, setPdfName] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('application/pdf');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf' && !file.type.startsWith('image/')) {
        alert("Please upload a PDF or Image file.");
        return;
      }
      setPdfName(file.name);
      setMimeType(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPdfData(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!grade || !subject || !topic) {
      alert("Please fill in Grade, Subject, and Topic.");
      return;
    }
    setLoading(true);
    try {
      const contextTopic = chapterContent
        ? `${topic}\n\nAdditional Text Context:\n${chapterContent}`
        : topic;

      const result = await generateExamPaper({
        grade,
        subject,
        topic: contextTopic,
        marks,
        language: lang,
        includeAnswers,
        pdfData: pdfData || undefined,
        mimeType: mimeType
      });
      setPaper(result);
    } catch (e) {
      console.error(e);
      alert("Failed to generate paper.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const clearPdf = () => {
    setPdfData(null);
    setPdfName(null);
    setMimeType('application/pdf');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (paper) {
    return (
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#fcfdfe] dark:bg-charcoal-900">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-8 print:hidden">
            <button
              onClick={() => setPaper(null)}
              className="flex items-center space-x-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-indigo-500 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Edit Settings</span>
            </button>
            <button
              onClick={handlePrint}
              className="bg-indigo-500 text-white px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-indigo-500/20"
            >
              Print / Save PDF
            </button>
          </div>
          <div className="bg-white dark:bg-charcoal-800 p-10 rounded-[40px] shadow-sm border border-slate-100 dark:border-white/5 prose prose-slate dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
              {paper}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#fcfdfe] dark:bg-charcoal-900">
      <div className="max-w-4xl mx-auto px-6 py-12 pb-24">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-indigo-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back</span>
          </button>
        </div>

        <header className="mb-10 text-center">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Exam Paper Generator</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Create custom exam papers using PDF, text, or topics</p>
        </header>

        <div className="bg-white dark:bg-charcoal-800 border border-slate-100 dark:border-white/5 rounded-[40px] p-8 md:p-12 shadow-sm mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Standard/Grade</label>
              <input
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="e.g. Class 10th"
                className="w-full bg-slate-50 dark:bg-charcoal-900 border border-slate-100 dark:border-white/5 rounded-2xl py-3 px-4 text-sm font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Mathematics"
                className="w-full bg-slate-50 dark:bg-charcoal-900 border border-slate-100 dark:border-white/5 rounded-2xl py-3 px-4 text-sm font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Marks</label>
              <select
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                className="w-full bg-slate-50 dark:bg-charcoal-900 border border-slate-100 dark:border-white/5 rounded-2xl py-3.5 px-4 text-sm font-bold text-slate-800 dark:text-white outline-none"
              >
                <option value="10">10 Marks</option>
                <option value="20">20 Marks</option>
                <option value="40">40 Marks</option>
                <option value="50">50 Marks</option>
                <option value="80">80 Marks</option>
                <option value="100">100 Marks</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Language</label>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="w-full bg-slate-50 dark:bg-charcoal-900 border border-slate-100 dark:border-white/5 rounded-2xl py-3.5 px-4 text-sm font-bold text-slate-800 dark:text-white outline-none"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Gujarati">Gujarati</option>
                <option value="Marathi">Marathi</option>
                <option value="Tamil">Tamil</option>
                <option value="Telugu">Telugu</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 mb-8">
            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Topic/Chapter Name</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Trigonometry Basics"
              className="w-full bg-slate-50 dark:bg-charcoal-900 border border-slate-100 dark:border-white/5 rounded-2xl py-3 px-4 text-sm font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="flex items-center space-x-3 mb-8 p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-800/20">
            <input
              type="checkbox"
              id="includeAnswers"
              checked={includeAnswers}
              onChange={(e) => setIncludeAnswers(e.target.checked)}
              className="w-5 h-5 rounded border-slate-300 text-indigo-500 focus:ring-indigo-500"
            />
            <label htmlFor="includeAnswers" className="text-sm font-bold text-slate-700 dark:text-indigo-300">Generate Answer Key & Marking Scheme</label>
          </div>

          <div className="space-y-2 mb-8">
            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Chapter Content / Notes (Optional)</label>
            <textarea
              value={chapterContent}
              onChange={(e) => setChapterContent(e.target.value)}
              placeholder="Paste relevant text or context here..."
              rows={4}
              className="w-full bg-slate-50 dark:bg-charcoal-900 border border-slate-100 dark:border-white/5 rounded-2xl py-3 px-4 text-sm font-medium text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none custom-scrollbar"
            />
          </div>

          <div className="mb-10">
            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Reference Document (PDF or Image)</label>
            {!pdfName ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-100 dark:border-white/5 rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-charcoal-900 transition-all"
              >
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-500 mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-sm font-bold text-slate-700 dark:text-white mb-1 uppercase tracking-widest">Upload Syllabus/Chapter PDF or Image</p>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">AI will generate questions directly from this file</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,image/*"
                />
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase truncate max-w-xs">{pdfName}</p>
                    <p className="text-[9px] text-indigo-400 font-medium">Ready for AI processing</p>
                  </div>
                </div>
                <button onClick={clearPdf} className="p-2 text-indigo-400 hover:text-red-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-3xl py-5 text-xs font-black uppercase tracking-[0.3em] shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center space-x-3 disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? (
              <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Generate Smart Paper</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaperDesignerScreen;
