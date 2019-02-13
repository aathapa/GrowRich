import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native'

import { Colors } from '../../globalData/'

import styles from './style'

export function Card({
  category,
  amount,
  type,
  date,
  memo,
  onPress,
  color,
  image
}) {
  const textColor = type.toUpperCase() === 'EXPENSE' ? Colors.expenseColor : Colors.incomeColor
  const symbol = type.toUpperCase() === 'EXPENSE' ? '-' : '+'
  return (

    <TouchableOpacity onPress={onPress} style={{ paddingBottom: 10 }}>
      <View style={styles.cardView}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={[styles.cardImageView, { backgroundColor: color, }]}>
            <Image
              source={image[category]}
              style={styles.image}
            />
          </View>
        </View>
        <View style={{ flex: 2, justifyContent: 'center', }}>
          <Text style={[styles.cardFont, { color: Colors.cardHeadingColor }]}>{memo ? memo : category}</Text>
          <Text style={{ color: Colors.dateColorOnWhitebackground, marginTop: 5 }}>{date}</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={[styles.cardFont, { color: textColor }]}>{symbol}{amount}</Text>
        </View>
      </View>
    </TouchableOpacity>

  )
}