import React from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native'

import styles from './styles'

import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'

export function Form({ placeholder, value, onChangeText, editable, keyboardType, iconName, label }) {
  return (
    <View style={styles.formView}>
      <View>
        <Text style={{ color: '#757575' }}>{label}</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <SimpleLineIcons name={iconName} size={20} color="#616161" />
        </View>
        <View style={{ flex: 10, justifyContent: 'center' }}>
          <TextInput
            style={styles.textInputText}
            placeholder={placeholder}
            placeholderTextColor="#424242"
            value={value}
            onChangeText={onChangeText}
            editable={editable}
            keyboardType={keyboardType}
          />
        </View>

      </View>

    </View>
  )
}
