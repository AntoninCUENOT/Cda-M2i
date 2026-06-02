import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import Colors from '../utils/colors';
import { Spacing, FontSize } from '../utils/constants';

interface LoadingProps {
  fullScreen?: boolean;
  text?: string;
}

export const Loading: React.FC<LoadingProps> = ({ fullScreen = false, text }) => {
  if (fullScreen) {
    return (
      <View style={styles.fullScreen}>
        <ActivityIndicator size="large" color={Colors.primary[500]} />
        {text && <Text style={styles.text}>{text}</Text>}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary[500]} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: Spacing.xl, alignItems: 'center', justifyContent: 'center' },
  fullScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background.primary },
  text: { marginTop: Spacing.md, fontSize: FontSize.md, color: Colors.text.secondary },
});

export default Loading;
