import React from 'react'
import {  
  View,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native'

import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'

export function Form({ placeholder, value, onChangeText, editable, keyboardType, iconName, label }) {
  return (
    <View style={{ borderBottomWidth: 0.7, borderBottomColor: '#5B3BB4', paddingTop: 20 }}>
      <View>
        <Text style={{ color: '#757575' }}>{label}</Text>
      </View>
      <View style={{ paddingTop: 10, height: 40 }}>
        <TouchableOpacity onPress={() => this.setState({ isDateTimePickerVisible: true })}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <SimpleLineIcons name={iconName} size={20} color="#616161" />
            </View>
            <View style={{ flex: 10 }}>
              <TextInput
                style={{ color: '#424242', fontSize: 17 }}
                placeholder={placeholder}
                placeholderTextColor="#424242"
                value={value}
                onChangeText={onChangeText}
                editable={editable}
                keyboardType={keyboardType}
              />
            </View>

          </View>
        </TouchableOpacity>
      </View>

    </View>
  )
}
