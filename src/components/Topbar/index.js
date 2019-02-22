import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Platform
} from 'react-native'

import LinearGradient from 'react-native-linear-gradient'
import IonIcons from 'react-native-vector-icons/Ionicons'
import { Icons } from 'globalData'

export function TopBar({
  onPress,
  iconName,
  title,
  backPress
}) {
  return (
    <LinearGradient
      style={{ height: Platform.OS === 'android' ? 60 : 70, justifyContent: 'center', paddingTop: 10, }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      colors={['#8B4FCB', '#5B3BB4']}
    >
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, alignItems: 'center', }}>
          {backPress && <TouchableOpacity onPress={backPress}>
            <IonIcons name={Icons.IonIcons.back} color="#fff" size={Platform.OS === 'ios' ? 40 : 30} />
          </TouchableOpacity>}
        </View>
        <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 20, color: '#fff' }}>{title}</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={onPress}
          >
            <IonIcons name={iconName} color="#fff" size={25} />
          </TouchableOpacity>
        </View>
      </View>



    </LinearGradient>
  )
}