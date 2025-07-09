import React from 'react';
import { useState, useEffect } from 'react';

export default function App() {
  const [input, setInput] = useState('0');
  const [expression, setExpression] = useState('');
  const [message, setMessage] = useState('Calculator');

  // Handle button clicks
  const handleButtonClick = (value) => {
    if (value === 'C') {
      setInput('0');
      setExpression('');
      setMessage('Calculator');
    } else if (value === '%') {
      const match = expression.match(/(\d+\.?\d*)$/);
      if (match) {
        const number = parseFloat(match[1]);
        const percent = (number / 100).toString();
        const newExpression = expression.replace(/(\d+\.?\d*)$/, percent);
        setExpression(newExpression);
        setInput(percent);
        setMessage('Percent calculated');
      }
    } else if (value === '=') {
      try {
        const result = eval(expression.replace(/÷/g, '/').replace(/×/g, '*'));
        setInput(result.toString());
        setExpression(result.toString());
        setMessage('Result');
      } catch (error) {
        setInput('Error');
        setExpression('');
        setMessage('Invalid expression');
      }
    } else if (value === '←') {
      if (expression.length > 1) {
        setExpression(expression.slice(0, -1));
        setInput(expression.slice(0, -1) || '0');
        setMessage('Backspace');
      } else {
        setExpression('');
        setInput('0');
        setMessage('Calculator');
      }
    } else {
      if (input === '0' && value !== '.') {
        setInput(value);
        setExpression(value);
      } else {
        if (["+", "-", "×", "÷"].includes(value)) {
          setInput(value);
        } else {
          setInput((prev) => (/[+\-×÷]/.test(prev) ? value : prev + value));
        }
        setExpression((prev) => prev + value);
      }
      setMessage('Calculator');
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;
      if (/\d/.test(key)) {
        handleButtonClick(key);
      } else if (["+", "-", "*", "/", "."].includes(key)) {
        handleButtonClick(key === '*' ? '×' : key === '/' ? '÷' : key);
      } else if (key === 'Enter') {
        handleButtonClick('=');
      } else if (key === 'Backspace') {
        handleButtonClick('←');
      } else if (key.toLowerCase() === 'c') {
        handleButtonClick('C');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const buttons = [
    ['C', '←', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '', '='],
  ];

  // Black background, beige & brown calculator
  const palette = {
    background: '#000', // Black background for the app
    container: 'linear-gradient(135deg, #f5f5dc 0%, #d7ccc8 100%)', // Beige gradient
    border: '#8d6748', // Brown border
    displayBg: 'linear-gradient(90deg, #f5f5dc 0%, #d7ccc8 100%)', // Beige
    displayText: '#4e342e', // Dark brown
    button: 'linear-gradient(135deg, #f5f5dc, #d7ccc8)', // Beige
    buttonText: '#4e342e', // Dark brown
    operator: 'linear-gradient(135deg, #bcaaa4, #8d6748)', // Brown
    operatorText: '#fff',
    equals: 'linear-gradient(135deg, #8d6748, #bcaaa4)', // Deep brown
    equalsText: '#fff',
    clear: 'linear-gradient(135deg, #d7ccc8, #bcaaa4)', // Light brown
    clearText: '#4e342e',
    shadow: '0 4px 16px rgba(77, 56, 36, 0.12)',
    font: 'serif',
  };

  return (
    <div className="app" style={{ minHeight: '100vh', minWidth: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', background: palette.background, fontFamily: palette.font }}>
      <div className="calculator-container" style={{ boxShadow: palette.shadow, borderRadius: 24, background: palette.container, border: `2px solid ${palette.border}`, padding: 32, maxWidth: 350, width: '100%' }}>
        <h1 className="title" style={{ textAlign: 'center', fontSize: '2.2rem', marginBottom: 8, color: palette.displayText, fontWeight: 700, letterSpacing: 1 }}>Calculator</h1>
        <div className="display" style={{ background: palette.displayBg, color: palette.displayText, fontSize: '2rem', fontFamily: 'monospace', textAlign: 'right', padding: 20, borderRadius: 16, minHeight: 60, marginBottom: 12, boxShadow: palette.shadow }}>
          <span>{input}</span>
        </div>
        <div style={{ textAlign: 'center', marginBottom: 16, color: palette.displayText, fontWeight: 500, fontSize: '1rem', minHeight: 24 }}>{message}</div>
        <div className="buttons" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {buttons.flat().map((btn, index) =>
            btn ? (
              <button
                key={index}
                onClick={() => handleButtonClick(btn)}
                className={`btn ${
                  /\d/.test(btn)
                    ? 'digit'
                    : btn === '='
                    ? 'equals'
                    : btn === 'C' || btn === '←'
                    ? 'clear'
                    : 'operator'
                }`}
                style={{
                  padding: 18,
                  fontSize: '1.2rem',
                  border: 'none',
                  borderRadius: 12,
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  background:
                    btn === '='
                      ? palette.equals
                      : btn === 'C' || btn === '←'
                      ? palette.clear
                      : /\d/.test(btn)
                      ? palette.button
                      : palette.operator,
                  color:
                    btn === '='
                      ? palette.equalsText
                      : btn === 'C' || btn === '←'
                      ? palette.clearText
                      : /\d/.test(btn)
                      ? palette.buttonText
                      : palette.operatorText,
                  boxShadow: palette.shadow,
                  transition: 'transform 0.1s',
                }}
                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                {btn}
              </button>
            ) : (
              <div key={index} />
            )
          )}
        </div>
      </div>
    </div>
  );
}
