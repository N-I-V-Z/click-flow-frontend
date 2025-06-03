// File: src/components/ui/RichTextEditor.tsx

import React, { useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Nhập nội dung...',
  height = 200,
  className = ''
}) => {
  // Custom toolbar với nhiều tính năng hơn
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ size: ['small', false, 'large', 'huge'] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        [{ script: 'sub' }, { script: 'super' }],
        ['clean']
      ],
      clipboard: {
        matchVisual: false
      }
    }),
    []
  );

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'list',
    'bullet',
    'indent',
    'align',
    'direction',
    'link',
    'image',
    'video',
    'blockquote',
    'code-block',
    'script'
  ];

  return (
    <div
      className={`overflow-hidden rounded-xl border border-gray-200 bg-white ${className}`}
    >
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{
          height: height
        }}
      />

      {/* Custom CSS để style lại cho đẹp hơn */}
      <style jsx global>{`
        .ql-editor {
          min-height: ${height}px;
          font-family: inherit;
          font-size: 14px;
          line-height: 1.6;
          padding: 16px;
        }

        .ql-toolbar {
          border-top: none;
          border-left: none;
          border-right: none;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
          padding: 12px;
        }

        .ql-toolbar .ql-formats {
          margin-right: 15px;
        }

        .ql-container {
          border: none;
          font-family: inherit;
        }

        .ql-toolbar .ql-stroke {
          stroke: #6b7280;
        }

        .ql-toolbar .ql-fill {
          fill: #6b7280;
        }

        .ql-toolbar button:hover .ql-stroke {
          stroke: #8b5cf6;
        }

        .ql-toolbar button:hover .ql-fill {
          fill: #8b5cf6;
        }

        .ql-toolbar button.ql-active .ql-stroke {
          stroke: #8b5cf6;
        }

        .ql-toolbar button.ql-active .ql-fill {
          fill: #8b5cf6;
        }

        .ql-toolbar .ql-picker {
          color: #6b7280;
        }

        .ql-toolbar .ql-picker:hover {
          color: #8b5cf6;
        }

        .ql-toolbar .ql-picker.ql-expanded .ql-picker-label {
          color: #8b5cf6;
          border-color: #8b5cf6;
        }

        .ql-toolbar .ql-picker-options {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }

        .ql-editor h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 1rem 0;
          line-height: 1.2;
        }

        .ql-editor h2 {
          font-size: 1.75rem;
          font-weight: 700;
          margin: 0.875rem 0;
          line-height: 1.3;
        }

        .ql-editor h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0.75rem 0;
          line-height: 1.3;
        }

        .ql-editor h4 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0.625rem 0;
          line-height: 1.4;
        }

        .ql-editor h5 {
          font-size: 1.125rem;
          font-weight: 600;
          margin: 0.5rem 0;
          line-height: 1.4;
        }

        .ql-editor h6 {
          font-size: 1rem;
          font-weight: 600;
          margin: 0.5rem 0;
          line-height: 1.5;
        }

        .ql-editor p {
          margin: 0.5rem 0;
          line-height: 1.6;
        }

        .ql-editor ul,
        .ql-editor ol {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
        }

        .ql-editor li {
          margin: 0.25rem 0;
          line-height: 1.5;
        }

        .ql-editor blockquote {
          border-left: 4px solid #8b5cf6;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #6b7280;
          background: #f8fafc;
          padding: 1rem;
          border-radius: 0 8px 8px 0;
        }

        .ql-editor pre {
          background: #1f2937;
          color: #f9fafb;
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1rem 0;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 13px;
          line-height: 1.4;
        }

        .ql-editor code {
          background: #f3f4f6;
          color: #dc2626;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.875em;
        }

        .ql-editor a {
          color: #8b5cf6;
          text-decoration: underline;
          transition: color 0.2s;
        }

        .ql-editor a:hover {
          color: #7c3aed;
        }

        .ql-editor img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 0.5rem 0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .ql-editor .ql-size-small {
          font-size: 0.75em;
        }

        .ql-editor .ql-size-large {
          font-size: 1.5em;
        }

        .ql-editor .ql-size-huge {
          font-size: 2.5em;
        }

        .ql-snow .ql-tooltip {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          padding: 8px 12px;
        }

        .ql-snow .ql-tooltip input[type='text'] {
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 8px 12px;
          font-size: 13px;
        }

        .ql-snow .ql-tooltip input[type='text']:focus {
          border-color: #8b5cf6;
          outline: none;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }

        .ql-snow .ql-tooltip a.ql-action::after {
          content: 'Lưu';
          color: #8b5cf6;
        }

        .ql-snow .ql-tooltip a.ql-remove::before {
          content: 'Xóa';
          color: #ef4444;
        }

        .ql-snow .ql-color-picker .ql-picker-options {
          width: 252px;
        }

        .ql-snow .ql-color-picker .ql-picker-item {
          border: 1px solid #e5e7eb;
          margin: 2px;
        }

        .ql-snow .ql-color-picker .ql-picker-item:hover {
          border-color: #8b5cf6;
        }

        /* Global styling for rendered HTML content */
        .prose h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 1rem 0;
          line-height: 1.2;
        }
        .prose h2 {
          font-size: 1.75rem;
          font-weight: 700;
          margin: 0.875rem 0;
          line-height: 1.3;
        }
        .prose h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0.75rem 0;
          line-height: 1.3;
        }
        .prose h4 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0.625rem 0;
          line-height: 1.4;
        }
        .prose h5 {
          font-size: 1.125rem;
          font-weight: 600;
          margin: 0.5rem 0;
          line-height: 1.4;
        }
        .prose h6 {
          font-size: 1rem;
          font-weight: 600;
          margin: 0.5rem 0;
          line-height: 1.5;
        }
        .prose p {
          margin: 0.5rem 0;
          line-height: 1.6;
        }
        .prose strong {
          font-weight: 700;
        }
        .prose em {
          font-style: italic;
        }
        .prose u {
          text-decoration: underline;
        }
        .prose s {
          text-decoration: line-through;
        }
        .prose code {
          background: #f3f4f6;
          color: #dc2626;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 0.875em;
        }
        .prose pre {
          background: #1f2937;
          color: #f9fafb;
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1rem 0;
        }
        .prose blockquote {
          border-left: 4px solid #8b5cf6;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #6b7280;
          background: #f8fafc;
          padding: 1rem;
          border-radius: 0 8px 8px 0;
        }
        .prose ul,
        .prose ol {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
        }
        .prose li {
          margin: 0.25rem 0;
          line-height: 1.5;
        }
        .prose a {
          color: #8b5cf6;
          text-decoration: underline;
        }
        .prose img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 0.5rem 0;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
