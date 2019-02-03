import React from 'react'
import { View, Text, Animated } from 'react-native'
import Feather from 'react-native-vector-icons/Feather'

function Info({
  iconName,
  type,
  typeAmount,
  iconColor,
  opacity
}) {
  return (
    <Animated.View style={{flex: 1, opacity,}}>
      <View style={{ flex: 1, flexDirection: 'row', }}>
        <View style={{ flex: 1 }}>
          <View style={{ backgroundColor: '#fff', elevation: 1, height: 20, width: 20, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
            <Feather name={iconName} color={iconColor} size={15} />
          </View>
        </View>
        <View style={{ flex: 4 }}>
          <Animated.Text style={{ color: '#fff'}}>{type}</Animated.Text>
          <Animated.Text style={{ color: '#fff', fontWeight: '600', fontSize: 20}}>{typeAmount}</Animated.Text>
        </View>
      </View>

    </Animated.View>
  )
}

export default Info