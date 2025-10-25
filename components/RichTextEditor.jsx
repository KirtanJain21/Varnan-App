import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';

const RichTextEditor = ({ editorRef, onChange, initialContentHTML = '' }) => {
  return (
    <View style={styles.container}>
      {/* Toolbar */}
      <RichToolbar
        editor={editorRef}
        actions={[
          actions.undo,
          actions.redo,
          actions.setBold,
          actions.setItalic,
          actions.setUnderline,
          actions.setStrikethrough,
          actions.insertOrderedList,
          actions.insertBulletsList,
          actions.blockquote,
          actions.alignLeft,
          actions.alignCenter,
          actions.alignRight,
          actions.code,
          actions.removeFormat,
          actions.heading1,
          actions.heading4,
        ]}
        iconMap={{
          [actions.heading1]: ({ tintColor }) => (
            <Text style={{ color: tintColor, fontWeight: 'bold' }}>H1</Text>
          ),
          [actions.heading4]: ({ tintColor }) => (
            <Text style={{ color: tintColor, fontWeight: 'bold' }}>H4</Text>
          ),
        }}
        style={styles.toolbar}
        flatContainerStyle={styles.listStyle}
        iconTint="#444"
        selectedIconTint="#8900ff"
      />

      {/* Editor */}
      <RichEditor
        ref={editorRef}
        onChange={onChange}
        initialContentHTML={initialContentHTML}
        placeholder="What's on your mind?"
        style={styles.editor}
        editorStyle={{
          backgroundColor: '#1e1e2f',
          color: '#ffffff',
          placeholderColor: '#888888',
          contentCSSText: `
            font-size: 16px;
            padding: 12px;
            line-height: 1.6;
            font-family: sans-serif;
          `,
        }}
      />
    </View>
  );
};

export default RichTextEditor;

const styles = StyleSheet.create({
  container: {
    minHeight: 285,
    backgroundColor: '#1e1e2f',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  editor: {
    flex: 1,
    minHeight: 200,
  },
  toolbar: {
    borderTopWidth: 1,
    borderColor: '#333',
    backgroundColor: '#fff',
  },
  listStyle: {
    paddingHorizontal: 6,
  },
});
