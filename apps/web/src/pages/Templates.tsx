import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Copy, Edit, Trash2, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Templates() {
  const navigate = useNavigate();
  const [templates] = useState([
    {
      id: 1,
      name: 'Business Travel',
      description: 'Complete business travel expense template',
      categories: ['Transportation', 'Accommodation', 'Meals'],
      usageCount: 24
    },
    {
      id: 2,
      name: 'Client Meeting',
      description: 'Template for client entertainment expenses',
      categories: ['Meals', 'Transportation'],
      usageCount: 18
    },
    {
      id: 3,
      name: 'Conference Attendance',
      description: 'Template for conference and seminar expenses',
      categories: ['Registration', 'Travel', 'Accommodation'],
      usageCount: 12
    },
    {
      id: 4,
      name: 'Office Supplies',
      description: 'Regular office supplies purchase template',
      categories: ['Equipment', 'Supplies'],
      usageCount: 35
    }
  ]);

  const handleUseTemplate = (templateId: number) => {
    toast.success('Template applied! Redirecting to create claim...');
    setTimeout(() => {
      navigate('/claims/new', { state: { templateId } });
    }, 1000);
  };

  const handleDuplicate = (templateName: string) => {
    toast.success(`Template "${templateName}" duplicated!`);
  };

  const handleDelete = (templateName: string) => {
    toast.success(`Template "${templateName}" deleted!`);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expense Templates</h1>
          <p className="text-gray-600 mt-1">Save time with pre-configured expense templates</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl">
          <Plus size={20} className="mr-2" />
          Create Template
        </button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <FileText size={24} className="text-indigo-600" />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDuplicate(template.name)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Duplicate"
                >
                  <Copy size={16} className="text-gray-600" />
                </button>
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit size={16} className="text-gray-600" />
                </button>
                <button
                  onClick={() => handleDelete(template.name)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} className="text-red-600" />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{template.description}</p>

            <div className="mb-4">
              <p className="text-xs font-medium text-gray-500 mb-2">Categories:</p>
              <div className="flex flex-wrap gap-2">
                {template.categories.map((category, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <span className="text-sm text-gray-500">Used {template.usageCount} times</span>
              <button
                onClick={() => handleUseTemplate(template.id)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
              >
                Use Template
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-8 text-white"
      >
        <h2 className="text-2xl font-bold mb-2">Create Custom Templates</h2>
        <p className="text-indigo-100 mb-4">
          Save your frequently used expense configurations as templates to speed up claim creation.
        </p>
        <button className="px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-semibold">
          Get Started
        </button>
      </motion.div>
    </div>
  );
}
