import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Upload, FileText, X, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import toast from 'react-hot-toast';

interface ClaimItem {
  date: string;
  category: string;
  description: string;
  amount: number;
  vendor: string;
  receiptFile?: File | null;
  receiptPreview?: string;
  ocrProcessing?: boolean;
  ocrConfidence?: number;
}

export default function CreateClaim() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [claimType, setClaimType] = useState('MEAL');
  const [items, setItems] = useState<ClaimItem[]>([
    { date: new Date().toISOString().split('T')[0], category: 'MEAL', description: '', amount: 0, vendor: '', receiptFile: null },
  ]);

  const addItem = () => {
    setItems([
      ...items,
      { date: new Date().toISOString().split('T')[0], category: 'MEAL', description: '', amount: 0, vendor: '', receiptFile: null },
    ]);
  };

  const simulateOCR = (_file: File, index: number) => {
    // Simulate OCR processing with mock data
    const mockOCRResults = [
      { description: 'Lunch at restaurant', amount: 150000, vendor: 'Restoran Sederhana', category: 'MEAL', confidence: 0.92 },
      { description: 'Taxi fare', amount: 75000, vendor: 'Blue Bird Taxi', category: 'TRANSPORTATION', confidence: 0.88 },
      { description: 'Hotel stay', amount: 500000, vendor: 'Hotel Santika', category: 'ACCOMMODATION', confidence: 0.95 },
      { description: 'Office supplies', amount: 250000, vendor: 'Gramedia Store', category: 'EQUIPMENT', confidence: 0.85 },
      { description: 'Client dinner', amount: 350000, vendor: 'Ritz Restaurant', category: 'ENTERTAINMENT', confidence: 0.90 },
    ];
    
    const randomResult = mockOCRResults[Math.floor(Math.random() * mockOCRResults.length)];
    
    setTimeout(() => {
      updateItem(index, 'description', randomResult.description);
      updateItem(index, 'amount', randomResult.amount);
      updateItem(index, 'vendor', randomResult.vendor);
      updateItem(index, 'category', randomResult.category);
      updateItem(index, 'ocrConfidence', randomResult.confidence);
      updateItem(index, 'ocrProcessing', false);
      
      toast.success(`Receipt processed! Confidence: ${(randomResult.confidence * 100).toFixed(0)}%`, {
        duration: 4000,
        icon: '✨',
      });
    }, 2000);
  };

  const handleFileUpload = (index: number, file: File) => {
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload an image (JPEG, PNG, WEBP) or PDF file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateItem(index, 'receiptPreview', e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }

    updateItem(index, 'receiptFile', file);
    updateItem(index, 'ocrProcessing', true);
    
    toast.loading('Processing receipt with OCR...', { duration: 1500 });
    
    // Simulate OCR processing
    simulateOCR(file, index);
  };

  const removeReceipt = (index: number) => {
    updateItem(index, 'receiptFile', null);
    updateItem(index, 'receiptPreview', undefined);
    updateItem(index, 'ocrConfidence', undefined);
    toast.success('Receipt removed');
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof ClaimItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/claims', {
        title,
        description,
        claimType,
        items,
      });

      toast.success('Claim created successfully!');
      navigate(`/claims/${response.data.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create claim');
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = items.reduce((sum, item) => sum + Number(item.amount), 0);

  const categories = ['MEAL', 'TRANSPORTATION', 'ACCOMMODATION', 'ENTERTAINMENT', 'EQUIPMENT', 'OTHER'];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-gray-900"
      >
        Create New Claim
      </motion.h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-lg p-6 space-y-4"
        >
          <h2 className="text-xl font-semibold">Claim Details</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Claim Type</label>
            <select
              value={claimType}
              onChange={(e) => setClaimType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg shadow p-6 border border-indigo-100"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <Upload className="w-5 h-5 text-indigo-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Quick OCR Upload</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Upload multiple receipts at once. AI will automatically extract data from each receipt.
              </p>
              <input
                type="file"
                id="bulk-upload"
                accept="image/*,.pdf"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  if (files.length > 0) {
                    files.forEach((file) => {
                      const newIndex = items.length;
                      addItem();
                      setTimeout(() => handleFileUpload(newIndex, file), 100 * newIndex);
                    });
                    toast.success(`Processing ${files.length} receipt${files.length > 1 ? 's' : ''}...`);
                  }
                }}
                className="hidden"
              />
              <label
                htmlFor="bulk-upload"
                className="inline-flex items-center px-4 py-2 bg-white border border-indigo-300 text-indigo-700 rounded-lg hover:bg-indigo-50 cursor-pointer transition-colors shadow-sm hover:shadow"
              >
                <FileText size={18} className="mr-2" />
                Upload Multiple Receipts
              </label>
            </div>
            <div className="hidden sm:block">
              <div className="text-6xl">📸</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Claim Items</h2>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <Plus size={16} className="mr-2" />
              Add Item
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="p-4 border border-gray-200 rounded-lg space-y-3 hover:shadow-md transition-shadow"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={item.date}
                      onChange={(e) => updateItem(index, 'date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={item.category}
                      onChange={(e) => updateItem(index, 'category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (IDR)</label>
                    <input
                      type="number"
                      value={item.amount}
                      onChange={(e) => updateItem(index, 'amount', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
                    <input
                      type="text"
                      value={item.vendor}
                      onChange={(e) => updateItem(index, 'vendor', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Receipt Upload Section */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText size={16} className="inline mr-2" />
                    Receipt / Invoice (Optional - OCR Enabled)
                  </label>
                  
                  {!item.receiptFile ? (
                    <div className="relative">
                      <input
                        type="file"
                        id={`receipt-${index}`}
                        accept="image/*,.pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(index, file);
                        }}
                        className="hidden"
                      />
                      <label
                        htmlFor={`receipt-${index}`}
                        className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 hover:border-indigo-400"
                      >
                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG, WEBP or PDF (max 5MB)
                        </p>
                        <p className="text-xs text-indigo-600 mt-1 font-medium">
                          ✨ Auto-extract data with AI OCR
                        </p>
                      </label>
                    </div>
                  ) : (
                    <div className="relative">
                      <AnimatePresence>
                        {item.ocrProcessing && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 rounded-lg"
                          >
                            <div className="text-center">
                              <Loader className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-2" />
                              <p className="text-sm text-gray-600">Processing with OCR...</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        {item.receiptPreview && (
                          <img
                            src={item.receiptPreview}
                            alt="Receipt preview"
                            className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{item.receiptFile.name}</p>
                              <p className="text-sm text-gray-500">
                                {(item.receiptFile.size / 1024).toFixed(1)} KB
                              </p>
                              {item.ocrConfidence && (
                                <div className="mt-1">
                                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                    ✓ OCR: {(item.ocrConfidence * 100).toFixed(0)}% confidence
                                  </span>
                                </div>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeReceipt(index)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove receipt"
                            >
                              <X size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {items.length > 1 && (
                  <div className="flex justify-end mt-3">
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Remove Item
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-3xl font-bold text-gray-900">
                IDR {totalAmount.toLocaleString('id-ID')}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => navigate('/claims')}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-lg hover:shadow-xl"
              >
                {loading ? 'Creating...' : 'Create Claim'}
              </button>
            </div>
          </div>
        </motion.div>
      </form>
    </div>
  );
}
