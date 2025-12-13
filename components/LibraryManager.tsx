import React, { useState, useRef } from 'react';
import { 
  Search, 
  Filter, 
  Upload, 
  Music, 
  Video, 
  FileText, 
  AlignLeft, 
  MoreVertical, 
  Play, 
  X, 
  CloudUpload,
  Clock,
  Tag,
  Download,
  Trash2,
  Eye,
  CheckCircle,
  File,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Material, MaterialType } from '../types';
import { materialService } from '../services/materialService';
import { authService } from '../services/authService';

interface LibraryManagerProps {
  materials: Material[];
  setMaterials: React.Dispatch<React.SetStateAction<Material[]>>;
}

const PREDEFINED_CATEGORIES = [
  "Mindset",
  "Health & Wellness",
  "Career",
  "Finance",
  "Relationships",
  "Productivity",
  "Sleep",
  "Anxiety",
  "Depression",
  "General"
];

const LibraryManager: React.FC<LibraryManagerProps> = ({ materials, setMaterials }) => {
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  // Filters State
  const [filterType, setFilterType] = useState<MaterialType[]>([]);
  const [filterCategory, setFilterCategory] = useState<string[]>([]);
  const [filterSource, setFilterSource] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Upload Form State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadData, setUploadData] = useState<Partial<Material>>({
    title: '',
    description: '',
    type: 'Audio',
    category: [],
    tags: [],
    duration: ''
  });

  const toggleFilter = <T extends string>(state: T[], setState: React.Dispatch<React.SetStateAction<T[]>>, value: T) => {
    if (state.includes(value)) {
      setState(state.filter(item => item !== value));
    } else {
      setState([...state, value]);
    }
  };

  const filteredMaterials = materials.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType.length === 0 || filterType.includes(m.type);
    const matchesCategory = filterCategory.length === 0 || m.category.some(c => filterCategory.includes(c));
    const matchesSource = filterSource.length === 0 || filterSource.includes(m.source);
    return matchesSearch && matchesType && matchesCategory && matchesSource;
  });

  const getIconForType = (type: MaterialType) => {
    switch (type) {
      case 'Audio': return <Music size={20} className="text-blue-500" />;
      case 'Video': return <Video size={20} className="text-purple-500" />;
      case 'PDF': return <FileText size={20} className="text-red-500" />;
      case 'Text': return <AlignLeft size={20} className="text-gray-500" />;
    }
  };

  // --- Upload Handlers ---

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadError(null);

      // Validate Size (100MB)
      if (file.size > 100 * 1024 * 1024) {
        setUploadError("File size exceeds 100MB limit.");
        return;
      }

      // Validate Type
      const allowedTypes = [
        'audio/mpeg', 'audio/mp3', 'audio/wav', 
        'video/mp4', 'video/quicktime',
        'application/pdf', 
        'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];
      
      // Simple mime check - in production consider magic number checking
      if (!allowedTypes.some(type => file.type.includes(type.split('/')[1]) || file.type === type)) {
          // Broad check for audio/video if specific mime fails
          if (!file.type.startsWith('audio/') && !file.type.startsWith('video/') && file.type !== 'application/pdf' && !file.name.endsWith('.doc') && !file.name.endsWith('.docx') && !file.name.endsWith('.txt')) {
             setUploadError("Unsupported file format. Please upload Audio, Video, PDF, DOC, or TXT.");
             return;
          }
      }

      setSelectedFile(file);
      
      // Auto-populate title if empty
      if (!uploadData.title) {
        setUploadData(prev => ({ ...prev, title: file.name.split('.')[0] }));
      }
      
      // Infer type
      if (file.type.startsWith('audio')) setUploadData(prev => ({ ...prev, type: 'Audio' }));
      else if (file.type.startsWith('video')) setUploadData(prev => ({ ...prev, type: 'Video' }));
      else if (file.type === 'application/pdf') setUploadData(prev => ({ ...prev, type: 'PDF' }));
      else setUploadData(prev => ({ ...prev, type: 'Text' }));
    }
  };

  const parseDurationToSeconds = (durationStr?: string): number => {
      if (!durationStr) return 0;
      const parts = durationStr.split(':').map(Number);
      if (parts.length === 2) return parts[0] * 60 + parts[1];
      if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
      return 0;
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) {
        setUploadError("Please select a file to upload.");
        return;
    }
    if (!uploadData.title) {
        setUploadError("Title is required.");
        return;
    }

    setIsUploading(true);
    setUploadError(null);

    let uploadedPath = '';
    let materialUuid = '';

    try {
        const session = await authService.getSession();
        if (!session?.user) throw new Error("User not authenticated");

        // 1. Upload File
        const uploadResult = await materialService.uploadFile(session.user.id, selectedFile);
        uploadedPath = uploadResult.path;
        materialUuid = uploadResult.materialUuid;

        // 2. Insert DB Record
        const dbRecord = await materialService.createMaterial({
            practitioner_id: session.user.id,
            title: uploadData.title || 'Untitled',
            description: uploadData.description,
            material_type: uploadData.type?.toLowerCase() as any, // Map 'Audio' -> 'audio'
            category: uploadData.category,
            tags: uploadData.tags,
            duration_seconds: parseDurationToSeconds(uploadData.duration), // Map "MM:SS" -> seconds
            file_path: uploadedPath,
            file_type: selectedFile.type,
            source: 'my_files'
        });

        // 3. Update UI State (Map back DB record to UI Model if needed, or use local data)
        const newMaterial: Material = {
            id: dbRecord ? (dbRecord as any).id : materialUuid,
            title: uploadData.title || 'Untitled',
            description: uploadData.description,
            type: uploadData.type || 'Audio',
            category: uploadData.category || [],
            tags: uploadData.tags || [],
            duration: uploadData.duration, // Keep the string for UI
            source: 'My Files',
            usageCount: 0,
            dateAdded: new Date().toLocaleDateString(),
            url: '' // Will be generated when needed
        };

        setMaterials(prev => [newMaterial, ...prev]);
        setIsUploadModalOpen(false);
        setUploadData({ title: '', description: '', type: 'Audio', category: [], tags: [], duration: '' });
        setSelectedFile(null);

        // Show Success Toast (Mock)
        alert("Material uploaded successfully!");

    } catch (error: any) {
        console.error("Upload workflow failed:", error);
        setUploadError(error.message || "An error occurred during upload.");
        
        // Rollback storage if DB failed (and path exists)
        if (uploadedPath) {
             await materialService.deleteFile(uploadedPath);
        }
    } finally {
        setIsUploading(false);
    }
  };

  // --- Render ---

  const renderUploadModal = () => {
    if (!isUploadModalOpen) return null;

    return (
       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
           <div className="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col animate-scale-in">
               <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-stone-50">
                   <div>
                       <h3 className="text-xl font-bold text-gray-900">Upload New Material</h3>
                       <p className="text-xs text-gray-500">Add content to your personal library.</p>
                   </div>
                   <button onClick={() => setIsUploadModalOpen(false)} className="text-gray-400 hover:text-gray-900"><X size={24}/></button>
               </div>

               <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                   {/* File Drop Zone */}
                   <div 
                     onClick={() => fileInputRef.current?.click()}
                     className={`border-3 border-dashed rounded-[24px] h-40 flex flex-col items-center justify-center cursor-pointer transition-colors group ${
                        selectedFile ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-stone-50 hover:bg-stone-100 hover:border-gray-300'
                     }`}
                   >
                       <input 
                         type="file" 
                         ref={fileInputRef} 
                         className="hidden" 
                         onChange={handleFileSelect}
                       />
                       {selectedFile ? (
                           <div className="text-center">
                               <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                                   <CheckCircle size={24}/>
                               </div>
                               <p className="font-bold text-green-800">{selectedFile.name}</p>
                               <p className="text-xs text-green-600">{(selectedFile.size / (1024*1024)).toFixed(2)} MB</p>
                           </div>
                       ) : (
                           <div className="text-center text-gray-400 group-hover:text-gray-600">
                               <CloudUpload size={40} className="mx-auto mb-2"/>
                               <p className="font-bold">Click to Upload File</p>
                               <p className="text-xs mt-1">MP3, MP4, PDF, DOC, TXT (Max 100MB)</p>
                           </div>
                       )}
                   </div>

                   {uploadError && (
                       <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                           <AlertCircle className="text-red-500 mt-0.5" size={18}/>
                           <p className="text-sm text-red-600 font-medium">{uploadError}</p>
                       </div>
                   )}

                   {/* Metadata Form */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="col-span-2">
                           <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Title*</label>
                           <input 
                             value={uploadData.title}
                             onChange={e => setUploadData({...uploadData, title: e.target.value})}
                             className="w-full px-4 py-3 rounded-xl bg-stone-50 border-none focus:ring-2 focus:ring-yellow-400 outline-none"
                             placeholder="e.g., Morning Meditation"
                           />
                       </div>

                       <div>
                           <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Type</label>
                           <select 
                             value={uploadData.type}
                             onChange={e => setUploadData({...uploadData, type: e.target.value as MaterialType})}
                             className="w-full px-4 py-3 rounded-xl bg-stone-50 border-none focus:ring-2 focus:ring-yellow-400 outline-none"
                           >
                               <option value="Audio">Audio</option>
                               <option value="Video">Video</option>
                               <option value="PDF">PDF</option>
                               <option value="Text">Text</option>
                           </select>
                       </div>

                       <div>
                           <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                           <select
                               value={uploadData.category?.[0] || ''}
                               onChange={e => setUploadData({...uploadData, category: [e.target.value]})}
                               className="w-full px-4 py-3 rounded-xl bg-stone-50 border-none focus:ring-2 focus:ring-yellow-400 outline-none"
                           >
                               <option value="">Select Category</option>
                               {PREDEFINED_CATEGORIES.map(cat => (
                                   <option key={cat} value={cat}>{cat}</option>
                               ))}
                           </select>
                       </div>

                       <div>
                           <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Duration (MM:SS)</label>
                           <input 
                             value={uploadData.duration}
                             onChange={e => setUploadData({...uploadData, duration: e.target.value})}
                             className="w-full px-4 py-3 rounded-xl bg-stone-50 border-none focus:ring-2 focus:ring-yellow-400 outline-none"
                             placeholder="10:00"
                           />
                       </div>

                       <div>
                           <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tags (Comma separated)</label>
                           <input 
                               value={uploadData.tags?.join(', ')}
                               onChange={e => setUploadData({...uploadData, tags: e.target.value.split(',').map(s => s.trim())})}
                               className="w-full px-4 py-3 rounded-xl bg-stone-50 border-none focus:ring-2 focus:ring-yellow-400 outline-none"
                               placeholder="e.g. morning, routine"
                           />
                       </div>
                       
                       <div className="col-span-2">
                           <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                           <textarea 
                             value={uploadData.description}
                             onChange={e => setUploadData({...uploadData, description: e.target.value})}
                             className="w-full px-4 py-3 rounded-xl bg-stone-50 border-none focus:ring-2 focus:ring-yellow-400 outline-none h-24 resize-none"
                             placeholder="Brief description of the content..."
                           />
                       </div>
                   </div>
               </div>

               <div className="p-6 border-t border-gray-100 bg-stone-50 flex justify-end gap-3">
                   <button 
                     onClick={() => setIsUploadModalOpen(false)}
                     disabled={isUploading}
                     className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-white transition-colors"
                   >
                       Cancel
                   </button>
                   <button 
                     onClick={handleUploadSubmit}
                     disabled={!selectedFile || !uploadData.title || isUploading}
                     className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                   >
                       {isUploading ? <Loader2 className="animate-spin" /> : <CloudUpload size={20}/>}
                       {isUploading ? 'Uploading...' : 'Upload & Save'}
                   </button>
               </div>
           </div>
       </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {renderUploadModal()}
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold text-gray-900">Materials Library</h1>
           <p className="text-gray-500 mt-1">Manage your content, worksheets, and media files.</p>
        </div>
        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="bg-gray-900 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-black transition-colors flex items-center gap-2"
        >
           <Upload size={18} /> Upload New
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col xl:flex-row gap-4">
          <div className="flex-1 relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
             <input 
               type="text" 
               value={searchQuery}
               onChange={e => setSearchQuery(e.target.value)}
               placeholder="Search title, tags..." 
               className="w-full pl-12 pr-4 py-4 rounded-[24px] bg-white border border-stone-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" 
             />
          </div>
          
          <div className="flex flex-wrap gap-2">
             {/* Type Filters */}
             {['Audio', 'Video', 'PDF', 'Text'].map(type => (
                 <button 
                   key={type}
                   onClick={() => toggleFilter(filterType, setFilterType, type as MaterialType)}
                   className={`px-4 py-3 rounded-full text-sm font-bold border transition-all flex items-center gap-2 ${
                       filterType.includes(type as MaterialType) 
                       ? 'bg-gray-900 text-white border-gray-900' 
                       : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                   }`}
                 >
                    {type === 'Audio' && <Music size={14}/>}
                    {type === 'Video' && <Video size={14}/>}
                    {type === 'PDF' && <FileText size={14}/>}
                    {type === 'Text' && <AlignLeft size={14}/>}
                    {type}
                 </button>
             ))}
             
             {/* Source Filter */}
             <button 
                onClick={() => toggleFilter(filterSource, setFilterSource, 'My Files')}
                className={`px-4 py-3 rounded-full text-sm font-bold border transition-all ${
                   filterSource.includes('My Files') 
                   ? 'bg-yellow-400 text-gray-900 border-yellow-400' 
                   : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
             >
                My Files
             </button>
             <button 
                onClick={() => toggleFilter(filterSource, setFilterSource, 'Global')}
                className={`px-4 py-3 rounded-full text-sm font-bold border transition-all ${
                   filterSource.includes('Global') 
                   ? 'bg-yellow-400 text-gray-900 border-yellow-400' 
                   : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
             >
                Global Library
             </button>
          </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMaterials.map(material => (
             <div key={material.id} className="bg-white p-5 rounded-[32px] border border-stone-100 shadow-sm hover:shadow-lg transition-all relative group">
                 <div className="flex justify-between items-start mb-4">
                     <div className="flex items-center gap-3">
                         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                             material.type === 'Audio' ? 'bg-blue-50' : 
                             material.type === 'Video' ? 'bg-purple-50' : 
                             material.type === 'PDF' ? 'bg-red-50' : 'bg-gray-100'
                         }`}>
                             {getIconForType(material.type)}
                         </div>
                         <div>
                             <h3 className="font-bold text-gray-900 line-clamp-1" title={material.title}>{material.title}</h3>
                             <p className="text-xs text-gray-500">{material.duration || 'No duration'} • {material.source}</p>
                         </div>
                     </div>
                     <button className="p-2 text-gray-400 hover:bg-stone-50 rounded-full transition-colors"><MoreVertical size={18}/></button>
                 </div>
                 
                 <div className="flex flex-wrap gap-2 mb-6 h-6 overflow-hidden">
                     {material.category.map(cat => (
                         <span key={cat} className="px-2 py-1 bg-stone-50 text-gray-500 rounded-lg text-[10px] font-bold uppercase tracking-wider">{cat}</span>
                     ))}
                 </div>

                 <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                     <span className="text-xs font-bold text-gray-400">Used {material.usageCount} times</span>
                     <div className="flex gap-2">
                         <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-stone-50 rounded-full transition-colors" title="Preview">
                             <Eye size={18}/>
                         </button>
                         {material.source === 'My Files' && (
                             <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors" title="Delete">
                                 <Trash2 size={18}/>
                             </button>
                         )}
                     </div>
                 </div>
             </div>
          ))}
      </div>
    </div>
  );
};

export default LibraryManager;