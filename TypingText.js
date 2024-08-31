import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';

const TypingText = ({ text, typingSpeed = 50, style }) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayText(prev => prev + text[index]);
      index += 1;
      if (index > text.length - 1) {
        clearInterval(interval);
      }
    }, typingSpeed);
    
    return () => clearInterval(interval);  // Cleanup interval on component unmount
  }, [text, typingSpeed]);

  return <Text style={style}>{displayText}</Text>;
};

export default TypingText;
