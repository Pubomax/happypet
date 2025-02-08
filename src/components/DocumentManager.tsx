import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Shield, 
  Syringe, 
  Clipboard, 
  Search,
  Download,
  Trash2,
  Plus,
  Filter
} from 'lucide-react';

interface Document {
  id: string;
  title: string;
  type: 'veterinary' | 'insurance' | 'vaccination' | 'registration' | 'other';
  date: string;
  fileUrl: string;
  fileSize: string;
  tags: string[];
}

interface DocumentManagerProps {
  documents: Document[];
  onUpload: (file: File, type: Document['type'], title: string, tags: string[]) => Promise<void>;
  onDelete: (documentId: string) => Promise<void>;
}

export const DocumentManager: React.FC<DocumentManagerProps> = ({
  documents,
  onUpload,
  onDelete
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<Document['type'] | 'all'>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    type: 'veterinary' as Document['type'],
    tags: [] as string[],
    file: null as File | null
  });
  const [tagInput, setTagInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const documentTypes = [
    { value: 'all', label: 'All Documents', icon: FileText },
    { value: 'veterinary', label: 'Vet Records', icon: Clipboard },
    { value: 'insurance', label: 'Insurance', icon: Shield },
    { value: 'vaccination', label: 'Vaccinations', icon: Syringe },
    { value: 'registration', label: 'Registration', icon: FileText },
    { value: 'other', label: 'Other', icon: FileText }
  ];

  const getDocumentIcon = (type: Document['type']) => {
    switch (type) {
      case 'veterinary':
        return <Clipboard className="w-5 h-5 text-blue-500" />;
      case 'insurance':
        return <Shield className="w-5 h-5 text-green-500" />;
      case 'vaccination':
        return <Syringe className="w-5 h-5 text-purple-500" />;
      case 'registration':
        return <FileText className="w-5 h-5 text-orange-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || doc.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadForm(prev => ({ ...prev, file }));
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !uploadForm.tags.includes(tagInput.trim())) {
      setUploadForm(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setUploadForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.file || !uploadForm.title) return;

    setIsUploading(true);
    try {
      await onUpload(uploadForm.file, uploadForm.type, uploadForm.title, uploadForm.tags);
      setShowUploadModal(false);
      setUploadForm({
        title: '',
        type: 'veterinary',
        tags: [],
        file: null
      });
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-900">Documents</h2>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search documents..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Upload
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6 flex flex-wrap gap-2">
          {documentTypes.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setSelectedType(value as Document['type'] | 'all')}
              className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium ${
                selectedType === value
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-start space-x-4">
                {getDocumentIcon(doc.type)}
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{doc.title}</h3>
                  <p className="text-sm text-gray-500">
                    Added {new Date(doc.date).toLocaleDateString()} • {doc.fileSize}
                  </p>
                  {doc.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {doc.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <a
                  href={doc.fileUrl}
                  download
                  className="p-2 text-gray-400 hover:text-gray-500"
                >
                  <Download className="w-5 h-5" />
                </a>
                <button
                  onClick={() => onDelete(doc.id)}
                  className="p-2 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}

          {filteredDocuments.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No documents found</p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-xl shadow-lg rounded-lg bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Upload Document</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  required
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter document title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Document Type
                </label>
                <select
                  value={uploadForm.type}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, type: e.target.value as Document['type'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="veterinary">Vet Records</option>
                  <option value="insurance">Insurance</option>
                  <option value="vaccination">Vaccination</option>
                  <option value="registration">Registration</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add tags"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    Add
                  </button>
                </div>
                {uploadForm.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {uploadForm.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  File
                </label>
                <input
                  type="file"
                  required
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 flex justify-center items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};