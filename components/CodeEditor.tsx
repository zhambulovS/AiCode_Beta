import React from 'react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, readOnly = false }) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const value = target.value;
      
      // Insert 4 spaces
      const newValue = value.substring(0, start) + '    ' + value.substring(end);
      onChange(newValue);

      // Move cursor to end of indentation
      // We use setTimeout to ensure this runs after the render cycle updates the value
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      }, 0);
    }
  };

  const lineCount = code.split('\n').length;
  const lines = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="relative w-full h-full flex bg-gray-950 font-mono text-sm overflow-hidden rounded-b-xl z-0">
      {/* Line Numbers */}
      <div className="flex-none w-12 bg-gray-900 text-gray-500 text-right select-none py-4 pr-3 border-r border-gray-800 leading-6">
        {lines.map(line => (
          <div key={line}>{line}</div>
        ))}
      </div>
      
      {/* Text Area */}
      <textarea
        value={code}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        readOnly={readOnly}
        spellCheck="false"
        className="flex-1 bg-transparent text-gray-200 p-4 resize-none focus:outline-none leading-6 w-full h-full"
        style={{ tabSize: 4 }}
        placeholder="# Write your Python code here..."
      />
    </div>
  );
};

export default CodeEditor;