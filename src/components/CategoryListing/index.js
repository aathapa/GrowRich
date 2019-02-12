import React from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image
} from 'react-native'

const { width } = Dimensions.get('window')
import { randomColor } from '../../helper'

let color = {}

export function CategoryListing({
  data,
  onPress,
  images
}) {
  return (
    <ScrollView
      style={{ marginLeft: 10 }}
      contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', }}
    >
      {data.map(({ name, id }, i) => {
        const exactColor = color[id] || randomColor()
        color[id] = exactColor
        return (
          <TouchableOpacity
            onPress={() => onPress(name)}
            key={id} style={{ height: 80, width: (width / 4) - 5, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: exactColor, justifyContent: 'center', alignItems: 'center', height: 44, width: 44, borderRadius: 22 }}>
              <Image
                source={images[name]}
                style={{ height: 25, width: 25 }}
              />
            </View>
            <Text style={{ fontSize: 12 }}>{name}</Text>
          </TouchableOpacity>
        )
      })}
    </ScrollView>
  )
}
