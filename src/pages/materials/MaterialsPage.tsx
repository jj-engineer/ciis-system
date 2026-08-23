import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  FolderDown,
  Upload,
  Download,
  FileSpreadsheet,
  FileText,
  FileCode,
  Image,
  Search,
  Plus,
  Trash2,
  CheckCircle2
} from 'lucide-react';

interface MaterialItem {
  id: string;
  title: string;
  subject: string;
  className: string;
  fileName: string;
  fileType: 'docx' | 'xlsx' | 'pptx' | 'pdf' | 'zip' | 'image';
  fileSize: string;
  uploadedBy: string;
  uploadedDate: string;
}

export const MaterialsPage: React.FC = () => {
  const { isStaff, currentUser } = useAuth();
  const { classes } = useApp();

  const [materials, setMaterials] = useState<MaterialItem[]>([
    {
      id: 'm-1',
      title: 'Excel Exercise #03 Starter Workbook',
      subject: 'Microsoft Excel',
      className: 'Grade 10A',
      fileName: 'Excel_Exercise_03_COUNTIF.xlsx',
      fileType: 'xlsx',
      fileSize: '61 KB',
      uploadedBy: 'Nun Langdy',
      uploadedDate: '2026-08-18'
    },
    {
      id: 'm-2',
      title: 'Word Resume & CV Template',
      subject: 'Microsoft Word',
      className: 'Grade 10A',
      fileName: 'Professional_CV_Template.docx',
      fileType: 'docx',
      fileSize: '124 KB',
      uploadedBy: 'Nun Langdy',
      uploadedDate: '2026-08-19'
    },
    {
      id: 'm-3',
      title: 'Excel Formulas Reference Cheat-Sheet',
      subject: 'Microsoft Excel',
      className: 'All Classes',
      fileName: 'Excel_Formulas_Summary_Bilingual.pdf',
      fileType: 'pdf',
      fileSize: '420 KB',
      uploadedBy: 'Nun Langdy',
      uploadedDate: '2026-08-15'
    },
    {
      id: 'm-4',
      title: 'Computer Lab Rules & Shortcuts Wall Chart',
      subject: 'Computer Basics',
      className: 'All Classes',
      fileName: 'Lab_Keyboard_Shortcuts_Guide.pdf',
      fileType: 'pdf',
      fileSize: '310 KB',
      uploadedBy: 'Davy (Assistant)',
      uploadedDate: '2026-08-14'
    },
    {
      id: 'm-5',
      title: 'Typing Speed Practice Guide (Khmer & English)',
      subject: 'Typing',
      className: 'Grade 10A',
      fileName: 'Touch_Typing_Fingering_Chart.pdf',
      fileType: 'pdf',
      fileSize: '1.2 MB',
      uploadedBy: 'Davy (Assistant)',
      uploadedDate: '2026-08-12'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // New Upload Form State
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Microsoft Excel');
  const [newClass, setNewClass] = useState('Grade 10A');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const fileType = selectedFile?.name.endsWith('.xlsx')
      ? 'xlsx'
      : selectedFile?.name.endsWith('.docx')
      ? 'docx'
      : selectedFile?.name.endsWith('.pdf')
      ? 'pdf'
      : 'docx';

    const newMat: MaterialItem = {
      id: `m-${Date.now()}`,
      title: newTitle,
      subject: newSubject,
      className: newClass,
      fileName: selectedFile?.name || `${newTitle.replace(/\s+/g, '_')}.${fileType}`,
      fileType: fileType as any,
      fileSize: selectedFile ? `${Math.round(selectedFile.size / 1024)} KB` : '85 KB',
      uploadedBy: currentUser.fullName,
      uploadedDate: '2026-08-21'
    };

    setMaterials([newMat, ...materials]);
    setShowUploadModal(false);
    setNewTitle('');
    setSelectedFile(null);
  };

  const filteredMaterials = materials.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = subjectFilter === 'All' || m.subject === subjectFilter;
    return matchesSearch && matchesSubject;
  });

  const getIcon = (type: MaterialItem['fileType']) => {
    switch (type) {
      case 'xlsx': return FileSpreadsheet;
      case 'docx': return FileText;
      case 'pdf': return FileCode;
      case 'image': return Image;
      default: return FileText;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <FolderDown className="w-6 h-6 text-pink-700" />
            Teaching Materials & Resource Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Download exercise workbooks, reference guides, and document templates.
          </p>
        </div>

        {isStaff && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-pink-700 hover:bg-pink-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Teaching Material</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search material or file name..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-600 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['All', 'Microsoft Excel', 'Microsoft Word', 'Typing', 'Computer Basics'].map((sub) => (
            <button
              key={sub}
              onClick={() => setSubjectFilter(sub)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                subjectFilter === sub
                  ? 'bg-pink-700 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMaterials.map((mat) => {
          const Icon = getIcon(mat.fileType);
          return (
            <div
              key={mat.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-pink-300 shadow-sm hover:shadow-card-hover transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="w-11 h-11 rounded-xl bg-pink-50 text-pink-700 flex items-center justify-center font-bold text-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <Badge variant="pink" size="sm">{mat.className}</Badge>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-pink-700 uppercase tracking-wider block">
                    {mat.subject}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mt-0.5">{mat.title}</h3>
                  <p className="text-xs text-slate-500 font-mono mt-1 truncate">{mat.fileName}</p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] text-slate-400">
                  <span>{mat.fileSize}</span> • <span>{mat.uploadedDate}</span>
                </div>
                <button
                  onClick={() => alert(`Starting download for: ${mat.fileName}`)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-pink-700 hover:text-white text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload Material Modal */}
      {showUploadModal && (
        <Modal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          title="Upload Teaching Material"
          subtitle="Add downloadable templates and guides for students"
        >
          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Resource Title
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Excel Formula Practice Workbook #04"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-600 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subject
                </label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold"
                >
                  <option value="Microsoft Excel">Microsoft Excel</option>
                  <option value="Microsoft Word">Microsoft Word</option>
                  <option value="Typing">Typing</option>
                  <option value="Computer Basics">Computer Basics</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Class
                </label>
                <select
                  value={newClass}
                  onChange={(e) => setNewClass(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold"
                >
                  <option value="Grade 10A">Grade 10A</option>
                  <option value="Grade 10B">Grade 10B</option>
                  <option value="Grade 11A">Grade 11A</option>
                  <option value="All Classes">All Classes</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Choose Document / Template File
              </label>
              <input
                type="file"
                accept=".docx,.xlsx,.pptx,.pdf,.zip,.png,.jpg"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-600 file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-pink-100 file:text-pink-700 hover:file:bg-pink-200"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Supports: DOCX, XLSX, PPTX, PDF, ZIP, PNG, JPG (Max 25MB)
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-pink-700 hover:bg-pink-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
              >
                Upload File
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
