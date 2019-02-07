import React from 'react';
import {
  View,
  Text,
  Button
} from 'react-native';

export function EmptyDataWithButton({
  title,
  buttonTitle,
  onPress
}) {
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', }}>
      <Text>{title}</Text>
      <Button
        title={buttonTitle}
        onPress={onPress}
      />
    </View>
  )

}