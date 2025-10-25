import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { wp } from '@/helpers/common';

const ExpandableText = ({
  text,
  numberOfLines = 2,
  containerStyle,
  textStyle,
  toggleStyle,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      <Text
        style={[styles.text, textStyle]}
        numberOfLines={expanded ? undefined : numberOfLines}
        ellipsizeMode="tail"
      >
        {text}
      </Text>

      {text.length > 80 && (
        <Pressable onPress={() => setExpanded((prev) => !prev)}>
          <Text style={[styles.toggleText, toggleStyle]}>
            {expanded ? ' less' : ' more'}
          </Text>
        </Pressable>
      )}
    </View>
  );
};

export default ExpandableText;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  text: {
    color: '#ccc',
    fontSize: wp(3.5),
    fontFamily: 'poppins',
  },
  toggleText: {
    color: '#8900ff',
    fontSize: wp(3.5),
    fontFamily: 'poppins',
    marginLeft: 4,
  },
});
