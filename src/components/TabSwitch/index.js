import React from 'react';
import { 
  View,
  Text,
  Button
} from 'react-native';
import { Navigation } from 'react-native-navigation'

export function TabSwitch({
  title,
  routeIndex,
  componentId,
  buttonTitle
}) {
  function switchToTab() {
    Navigation.mergeOptions(componentId, {
      bottomTabs: {
        currentTabIndex: routeIndex
      }
    })
  }
  return (
    <View style={{justifyContent: 'center', alignItems: 'center',}}>
      <Text>{title}</Text>
      <Button
        title={buttonTitle}
        onPress={()=> switchToTab()}
      />
    </View>
  )

}