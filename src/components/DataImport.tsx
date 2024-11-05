import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Upload, AlertCircle, Check } from 'lucide-react';
import { parse } from 'papaparse';
import { db } from '../lib/db';
import { validateMarketData } from '../lib/validators';

interface ImportForm {
  datasetName: string;
  description: string;
}

export default function DataImport() {
  const [fileData, setFileData] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ImportForm>();

  const handleFileDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'text/csv' || file.type === 'application/json')) {
      setFileData(file);
      setError(null);
    } else {
      setError('Please upload a CSV or JSON file');
    }
  }, []);

  const processFile = async (formData: ImportForm) => {
    if (!fileData) return;
    setImporting(true);
    setError(null);
    setSuccess(false);

    try {
      const data = await new Promise((resolve, reject) => {
        if (fileData.type === 'text/csv') {
          parse(fileData, {
            header: true,
            dynamicTyping: true,
            complete: (results) => resolve(results.data),
            error: (error) => reject(error)
          });
        } else {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              resolve(JSON.parse(e.target?.result as string));
            } catch (err) {
              reject(err);
            }
          };
          reader.readAsText(fileData);
        }
      });

      const validationResult = validateMarketData(data);
      if (!validationResult.isValid) {
        throw new Error(validationResult.error);
      }

      await db.marketData.bulkAdd(validationResult.data);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import data');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Import Market Data</h1>
        <p className="text-gray-600">Upload your historical forex data for backtesting</p>
      </div>

      <form onSubmit={handleSubmit(processFile)} className="max-w-2xl">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dataset Name
          </label>
          <input
            {...register('datasetName', { required: 'Dataset name is required' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., EUR/USD 2023 H1"
          />
          {errors.datasetName && (
            <p className="mt-1 text-sm text-red-600">{errors.datasetName.message}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            {...register('description')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Add details about this dataset..."
          />
        </div>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          className="mb-6 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors"
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">
            Drag and drop your CSV or JSON file here, or{' '}
            <button type="button" className="text-blue-500 hover:text-blue-600">
              browse
            </button>
          </p>
          <p className="text-sm text-gray-500">Supported formats: CSV, JSON</p>
          {fileData && (
            <p className="mt-2 text-sm text-green-600">
              Selected file: {fileData.name}
            </p>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 rounded-lg flex items-center gap-2 text-green-700">
            <Check className="w-5 h-5" />
            <p>Data imported successfully!</p>
          </div>
        )}

        <button
          type="submit"
          disabled={!fileData || importing}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {importing ? 'Importing...' : 'Import Data'}
        </button>
      </form>
    </div>
  );
}