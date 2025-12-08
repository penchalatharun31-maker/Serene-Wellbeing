import React, { useState } from 'react';
import { Upload, X, Check } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', className = '', children, ...props }) => {
  const baseStyle = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm focus:ring-emerald-500",
    secondary: "bg-emerald-100 hover:bg-emerald-200 text-emerald-800 focus:ring-emerald-500",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-emerald-500",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl border border-gray-100 shadow-sm ${className}`}>
    {children}
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = 'emerald' }) => {
    const colors: Record<string, string> = {
        emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
        blue: 'bg-blue-50 text-blue-700 ring-blue-600/20',
        gray: 'bg-gray-50 text-gray-600 ring-gray-500/10',
    }
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${colors[color] || colors.emerald}`}>
      {children}
    </span>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string }> = ({ label, className = '', ...props }) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <input
      className={`block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm py-2 px-3 border ${className}`}
      {...props}
    />
  </div>
);

// New Component for Simulated Image Upload
export const ImageUpload: React.FC<{ label?: string }> = ({ label }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setUploaded(false);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    setUploading(true);
    
    // Simulate API call to AWS S3 or Google Cloud Storage
    setTimeout(() => {
      setUploading(false);
      setUploaded(true);
    }, 2000);
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    setUploaded(false);
  };

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      
      {!preview ? (
        <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-emerald-400 transition-colors bg-gray-50">
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500">
                <span>Upload a file</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden border border-gray-200">
          <div className="aspect-w-16 aspect-h-9 bg-gray-100 flex items-center justify-center p-4">
             <img src={preview} alt="Preview" className="max-h-64 object-contain rounded-md" />
          </div>
          <button 
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md text-gray-500 hover:text-red-500"
          >
            <X size={16} />
          </button>
          
          <div className="p-4 bg-white border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-600 truncate max-w-[200px]">{file?.name}</span>
            {uploaded ? (
                <span className="flex items-center text-sm font-medium text-emerald-600">
                    <Check size={16} className="mr-1" /> Uploaded
                </span>
            ) : (
                <Button size="sm" onClick={handleUpload} disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Confirm Upload'}
                </Button>
            )}
          </div>
          {uploading && (
             <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-100">
                 <div className="h-full bg-emerald-500 animate-pulse w-full origin-left"></div>
             </div>
          )}
        </div>
      )}
    </div>
  );
};