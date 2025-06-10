// File: src/components/ui/RichTextEditor.tsx

import React, { useMemo, useEffect } from 'react';
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

  // Inject styles dynamically
  useEffect(() => {
    const styleId = 'rich-text-editor-styles';

    // Remove existing styles
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) {
      existingStyle.remove();
    }

    // Create new style element
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .ql-editor {
        min-height: ${height}px !important;
        font-family: inherit !important;
        font-size: 14px !important;
        line-height: 1.6 !important;
        padding: 16px !important;
      }

      .ql-toolbar {
        border-top: none !important;
        border-left: none !important;
        border-right: none !important;
        border-bottom: 1px solid #e5e7eb !important;
        background: #f9fafb !important;
        padding: 12px !important;
      }

      .ql-toolbar .ql-formats {
        margin-right: 15px !important;
      }

      .ql-container {
        border: none !important;
        font-family: inherit !important;
      }

      .ql-toolbar .ql-stroke {
        stroke: #6b7280 !important;
      }

      .ql-toolbar .ql-fill {
        fill: #6b7280 !important;
      }

      .ql-toolbar button:hover .ql-stroke {
        stroke: #8b5cf6 !important;
      }

      .ql-toolbar button:hover .ql-fill {
        fill: #8b5cf6 !important;
      }

      .ql-toolbar button.ql-active .ql-stroke {
        stroke: #8b5cf6 !important;
      }

      .ql-toolbar button.ql-active .ql-fill {
        fill: #8b5cf6 !important;
      }

      .ql-toolbar .ql-picker {
        color: #6b7280 !important;
      }

      .ql-toolbar .ql-picker:hover {
        color: #8b5cf6 !important;
      }

      .ql-toolbar .ql-picker.ql-expanded .ql-picker-label {
        color: #8b5cf6 !important;
        border-color: #8b5cf6 !important;
      }

      .ql-toolbar .ql-picker-options {
        background: white !important;
        border: 1px solid #e5e7eb !important;
        border-radius: 8px !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
      }

      .ql-editor.ql-blank::before {
        color: #9ca3af !important;
        font-style: normal !important;
      }

      .ql-editor h1 {
        font-size: 2rem !important;
        font-weight: 700 !important;
        margin: 1rem 0 !important;
        line-height: 1.2 !important;
      }

      .ql-editor h2 {
        font-size: 1.75rem !important;
        font-weight: 700 !important;
        margin: 0.875rem 0 !important;
        line-height: 1.3 !important;
      }

      .ql-editor h3 {
        font-size: 1.5rem !important;
        font-weight: 600 !important;
        margin: 0.75rem 0 !important;
        line-height: 1.3 !important;
      }

      .ql-editor h4 {
        font-size: 1.25rem !important;
        font-weight: 600 !important;
        margin: 0.625rem 0 !important;
        line-height: 1.4 !important;
      }

      .ql-editor h5 {
        font-size: 1.125rem !important;
        font-weight: 600 !important;
        margin: 0.5rem 0 !important;
        line-height: 1.4 !important;
      }

      .ql-editor h6 {
        font-size: 1rem !important;
        font-weight: 600 !important;
        margin: 0.5rem 0 !important;
        line-height: 1.5 !important;
      }

      .ql-editor p {
        margin: 0.5rem 0 !important;
        line-height: 1.6 !important;
      }

      .ql-editor ul,
      .ql-editor ol {
        margin: 0.5rem 0 !important;
        padding-left: 1.5rem !important;
      }

      .ql-editor li {
        margin: 0.25rem 0 !important;
        line-height: 1.5 !important;
      }

      .ql-editor blockquote {
        border-left: 4px solid #8b5cf6 !important;
        padding-left: 1rem !important;
        margin: 1rem 0 !important;
        font-style: italic !important;
        color: #6b7280 !important;
        background: #f8fafc !important;
        padding: 1rem !important;
        border-radius: 0 8px 8px 0 !important;
      }

      .ql-editor pre {
        background: #1f2937 !important;
        color: #f9fafb !important;
        padding: 1rem !important;
        border-radius: 8px !important;
        overflow-x: auto !important;
        margin: 1rem 0 !important;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
        font-size: 13px !important;
        line-height: 1.4 !important;
      }

      .ql-editor code {
        background: #f3f4f6 !important;
        color: #dc2626 !important;
        padding: 2px 6px !important;
        border-radius: 4px !important;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
        font-size: 0.875em !important;
      }

      .ql-editor a {
        color: #8b5cf6 !important;
        text-decoration: underline !important;
        transition: color 0.2s !important;
      }

      .ql-editor a:hover {
        color: #7c3aed !important;
      }

      .ql-editor img {
        max-width: 100% !important;
        height: auto !important;
        border-radius: 8px !important;
        margin: 0.5rem 0 !important;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
      }

      .ql-editor .ql-size-small {
        font-size: 0.75em !important;
      }

      .ql-editor .ql-size-large {
        font-size: 1.5em !important;
      }

      .ql-editor .ql-size-huge {
        font-size: 2.5em !important;
      }

      .ql-snow .ql-tooltip {
        background: white !important;
        border: 1px solid #e5e7eb !important;
        border-radius: 8px !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
        padding: 8px 12px !important;
      }

      .ql-snow .ql-tooltip input[type='text'] {
        border: 1px solid #d1d5db !important;
        border-radius: 6px !important;
        padding: 8px 12px !important;
        font-size: 13px !important;
      }

      .ql-snow .ql-tooltip input[type='text']:focus {
        border-color: #8b5cf6 !important;
        outline: none !important;
        box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1) !important;
      }

      .ql-snow .ql-tooltip a.ql-action::after {
        content: 'Lưu' !important;
        color: #8b5cf6 !important;
      }

      .ql-snow .ql-tooltip a.ql-remove::before {
        content: 'Xóa' !important;
        color: #ef4444 !important;
      }

      .ql-snow .ql-color-picker .ql-picker-options {
        width: 252px !important;
      }

      .ql-snow .ql-color-picker .ql-picker-item {
        border: 1px solid #e5e7eb !important;
        margin: 2px !important;
      }

      .ql-snow .ql-color-picker .ql-picker-item:hover {
        border-color: #8b5cf6 !important;
      }

      /* Global styling for rendered HTML content */
      .prose h1 {
        font-size: 2rem !important;
        font-weight: 700 !important;
        margin: 1rem 0 !important;
        line-height: 1.2 !important;
      }
      .prose h2 {
        font-size: 1.75rem !important;
        font-weight: 700 !important;
        margin: 0.875rem 0 !important;
        line-height: 1.3 !important;
      }
      .prose h3 {
        font-size: 1.5rem !important;
        font-weight: 600 !important;
        margin: 0.75rem 0 !important;
        line-height: 1.3 !important;
      }
      .prose h4 {
        font-size: 1.25rem !important;
        font-weight: 600 !important;
        margin: 0.625rem 0 !important;
        line-height: 1.4 !important;
      }
      .prose h5 {
        font-size: 1.125rem !important;
        font-weight: 600 !important;
        margin: 0.5rem 0 !important;
        line-height: 1.4 !important;
      }
      .prose h6 {
        font-size: 1rem !important;
        font-weight: 600 !important;
        margin: 0.5rem 0 !important;
        line-height: 1.5 !important;
      }
      .prose p {
        margin: 0.5rem 0 !important;
        line-height: 1.6 !important;
      }
      .prose strong {
        font-weight: 700 !important;
      }
      .prose em {
        font-style: italic !important;
      }
      .prose u {
        text-decoration: underline !important;
      }
      .prose s {
        text-decoration: line-through !important;
      }
      .prose code {
        background: #f3f4f6 !important;
        color: #dc2626 !important;
        padding: 2px 6px !important;
        border-radius: 4px !important;
        font-family: monospace !important;
        font-size: 0.875em !important;
      }
      .prose pre {
        background: #1f2937 !important;
        color: #f9fafb !important;
        padding: 1rem !important;
        border-radius: 8px !important;
        overflow-x: auto !important;
        margin: 1rem 0 !important;
      }
      .prose blockquote {
        border-left: 4px solid #8b5cf6 !important;
        padding-left: 1rem !important;
        margin: 1rem 0 !important;
        font-style: italic !important;
        color: #6b7280 !important;
        background: #f8fafc !important;
        padding: 1rem !important;
        border-radius: 0 8px 8px 0 !important;
      }
      .prose ul,
      .prose ol {
        margin: 0.5rem 0 !important;
        padding-left: 1.5rem !important;
      }
      .prose li {
        margin: 0.25rem 0 !important;
        line-height: 1.5 !important;
      }
      .prose a {
        color: #8b5cf6 !important;
        text-decoration: underline !important;
      }
      .prose img {
        max-width: 100% !important;
        height: auto !important;
        border-radius: 8px !important;
        margin: 0.5rem 0 !important;
      }
    `;

    document.head.appendChild(style);

    // Cleanup function
    return () => {
      const styleToRemove = document.getElementById(styleId);
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, [height]);

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
      />
    </div>
  );
};

export default RichTextEditor;
