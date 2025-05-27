import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { oneDark } from '@codemirror/theme-one-dark';
import './Playground.css';

const Playground = () => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('// Start coding...');
  const [output, setOutput] = useState('');
  const [theme, setTheme] = useState('dark');

  const handleRun = () => {
    if (language === 'javascript') {
      try {
        // Unsafe for real-world use, use sandbox/server
        const result = eval(code);
        setOutput(String(result));
      } catch (err) {
        setOutput('Error: ' + err.message);
      }
    } else {
      setOutput('⚠️ Only JavaScript runs locally. Python/C++ coming via server.');
    }
  };

  const getLanguageExtension = () => {
    switch (language) {
      case 'javascript': return javascript();
      case 'python': return python();
      case 'cpp': return cpp();
      default: return javascript();
    }
  };

  return (
    <div className={`playground-container ${theme}`}>
      <div className="playground-header">
        <h2>👨‍💻 Zylo Tech Code Playground</h2>
        <div className="playground-controls">
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="cpp">C++</option>
        <option value="c">C</option>
        <option value="java">Java</option>
          </select>
          <button onClick={handleRun}>▶️ Run</button>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? '🌞 Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      </div>

      <div className="editor-output-wrapper">
        <div className="code-editor">
          <CodeMirror
            value={code}
            height="400px"
            theme={theme === 'dark' ? oneDark : 'light'}
            extensions={[getLanguageExtension()]}
            onChange={(value) => setCode(value)}
          />
        </div>

        <div className="output-terminal">
          <h4>💡 Output</h4>
          <pre>{output}</pre>
        </div>
      </div>
    </div>
  );
};

export default Playground;
