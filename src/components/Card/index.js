import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native'

import FontAwesome from 'react-native-vector-icons/FontAwesome'

function Card({
  category,
  amount,
  type,
  date,
  memo,
  onPress,
  color,
  image
}) {
  const textColor = type.toUpperCase() === 'EXPENSE' ? '#EA114B' : '#00C7A0'
  const symbol = type.toUpperCase() === 'EXPENSE' ? '-' : '+'
  return (
    <TouchableOpacity onPress={onPress} style={{ paddingBottom: 15 }}>
      <View style={{
        backgroundColor: '#fff',
        height: 60,
        borderColor: '#eeee',
        marginHorizontal: 15,
        borderWidth: 1,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
          height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        flexDirection: 'row'
      }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: color, height: 40, width: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
            <Image
              source={image[category]}
              style={{width: 20, height: 20}}
            />
          </View>
        </View>
        <View style={{ flex: 2, justifyContent: 'center', }}>
          <Text style={{ fontSize: 17, color: '#32335A' }}>{memo ? memo : category}</Text>
          <Text style={{ color: '#9EA0B2', marginTop: 5 }}>{date}</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
          <Text style={{ color: textColor, fontSize: 17 }}>{symbol}{amount}</Text>
        </View>
      </View>
    </TouchableOpacity>

  )
}

export default Card