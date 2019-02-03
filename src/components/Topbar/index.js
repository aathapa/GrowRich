import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Animated
} from 'react-native'

import LinearGradient from 'react-native-linear-gradient'

import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons'


function TopBar({
  onPress,
  rotate,
  activeMenu
}) {
  return (
    <LinearGradient
      style={{ height: 70, justifyContent: 'center', alignItems: 'center', }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      colors={['#8B4FCB', '#5B3BB4']}
    >
      <TouchableOpacity onPress={onPress} style={{ flexDirection: 'row', marginTop: 15, justifyContent: 'center', alignItems: 'center' }}>
        <View
          
        >
          <Text style={{ fontSize: 20, color: '#fff' }}>{activeMenu}</Text>
        </View>

        <Animated.View style={{ marginLeft: 10, transform: [{ rotate }] }}>
          <SimpleLineIcon name="arrow-down" size={15} color="#fff" />
        </Animated.View>
      </TouchableOpacity>

    </LinearGradient>
  )
}

export default TopBar