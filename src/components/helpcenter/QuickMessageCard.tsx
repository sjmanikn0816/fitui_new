import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';


interface QuickMessageCardProps {
  onSendMessage: (message: string) => void;
}

const QuickMessageCard: React.FC<QuickMessageCardProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="chat" size={20} color={Colors.textSecondary} />
        <Text style={styles.title}>Quick Message</Text>
      </View>
      <Text style={styles.subtitle}>Send us a message</Text>
      <TextInput
        style={styles.input}
        placeholder="Describe your issue or Question"
        placeholderTextColor={Colors.textLight}
        value={message}
        onChangeText={setMessage}
        multiline
        numberOfLines={3}
        textAlignVertical="top"
      />
      <TouchableOpacity
        style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
        onPress={handleSend}
        disabled={!message.trim()}
        activeOpacity={0.7}
      >
        <MaterialIcons name="send" size={16} color={Colors.white} />
        <Text style={styles.sendButtonText}>Send Message</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgCard,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    shadowColor: Colors.emerald,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.textPrimary,
    backgroundColor: Colors.bgCardHover,
    minHeight: 80,
    marginBottom: 16,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.gray300,
  },
  sendButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default QuickMessageCard;