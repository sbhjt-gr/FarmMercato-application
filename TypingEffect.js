import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@rneui/themed';

const TypingEffect = ({ text, speed, type }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isCursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    let index = 0;

    const typingInterval = setInterval(() => {
      setDisplayedText((prev) => prev + text[index]);
      index += 1;

      if (index >= text.length) {
        clearInterval(typingInterval);
        setCursorVisible(false);
      }
    }, speed);

    const cursorInterval = setInterval(() => {
      if (index < text.length) {
        setCursorVisible((prev) => !prev); 
      }
    }, 500);

    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
    };
  }, [text, speed]);

  return (
    <>
      {type === 'nor' && (
        <View style={styles.typingContainer}>
          <Text style={StyleSheet.flatten([styles.descContent, { color: 'white' }])}>
            {displayedText}
          </Text>
          {isCursorVisible && (
            <Text style={StyleSheet.flatten([styles.cursor, { color: 'white' }])}>|</Text>
          )}
        </View>
      )}
      {type === 'h3' && (
        <View style={StyleSheet.flatten([styles.typingContainer, { color: 'grey', marginBottom: 20 }])}>
          <Text h3 style={StyleSheet.flatten([styles.descContent, { color: 'grey' }])}>
            {displayedText}
          </Text>
          {isCursorVisible && (
            <Text h3 style={StyleSheet.flatten([styles.cursor, { color: 'grey' }])}>|</Text>
          )}
        </View>
      )}
      {type === 'other' && (
        <View style={styles.typingContainer}>
          <Text style={StyleSheet.flatten([styles.descContent, { color: 'grey' }])}>
            {displayedText}
          </Text>
          {isCursorVisible && (
            <Text style={StyleSheet.flatten([styles.cursor, { color: 'white' }])}>|</Text>
          )}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  descContent: {
    textAlign: 'center',
    fontSize: 15,
    padding: 5,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cursor: {
    fontSize: 20,
    marginLeft: 2,
  },
});

export default TypingEffect;
