import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Animated
} from 'react-native'

import LinearGradient from 'react-native-linear-gradient'

import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons'


export function TopBar({
  onPress,
  rotate,
  activeMenu,
  children
}) {
  return (
    <LinearGradient
      style={{ height: 70, justifyContent: 'center', alignItems: 'center', }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      colors={['#8B4FCB', '#5B3BB4']}
    >
      <View style={{flex: 1}}/>
      <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity onPress={onPress} style={{ flexDirection: 'row', marginTop: 15, }}>
          <View

          >
            <Text style={{ fontSize: 20, color: '#fff' }}>{activeMenu}</Text>
          </View>

          <Animated.View style={{ marginLeft: 10, transform: [{ rotate }] }}>
            <SimpleLineIcon name="arrow-down" size={15} color="#fff" />
          </Animated.View>
        </TouchableOpacity>
      </View>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity>
          {children}
        </TouchableOpacity>
      </View>
      

    </LinearGradient>
  )
}