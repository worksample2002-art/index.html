import React, { useRef } from 'react';
import { Image as ImageIcon, Upload } from 'lucide-react';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  maxKB?: number;
  label?: string;
  recommendedSize?: string;
}

export default function ImageUploader({ value, onChange, maxKB = 500, label = "Image", recommendedSize = "" }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxKB * 1024) {
      alert(`File size exceeds ${maxKB}KB. Please choose a smaller image.`);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {recommendedSize && <span className="text-gray-400 text-xs font-normal">({recommendedSize}, Max: {maxKB}KB)</span>}
      </label>
      <div className="flex items-center gap-3">
        <input 
          type="url" 
          value={value} 
          onChange={e => onChange(e.target.value)} 
          placeholder="https://..."
          className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" 
        />
        <div className="text-gray-400 text-sm font-bold">OR</div>
        <button 
          type="button" 
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg font-medium transition-colors whitespace-nowrap"
        >
          <Upload className="w-4 h-4" /> Upload
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          accept="image/*" 
          onChange={handleFileChange} 
          className="hidden" 
        />
      </div>
      {value && (
        <div className="mt-2">
          <img src={value} alt="Preview" className="h-24 w-24 object-cover rounded-lg border border-gray-200" />
        </div>
      )}
    </div>
  );
}
