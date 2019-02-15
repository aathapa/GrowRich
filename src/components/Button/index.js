import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform
} from 'react-native'

export function Button({
  onPress,
  buttonTitle,
  subtitle,
  style,
  symbol
}) {
  const buttonContent = (
    <View style={style}>
      <View style={{ flex: 1 }}>
        <Text style={{ color: '#32335A' }}>{buttonTitle}</Text>
        {subtitle && <Text style={{ color: '#9EA0B2', fontSize: 12 }}>{subtitle}</Text>}
      </View>
      {symbol ? <View style={{ flex: 2 }}>
        <Text style={{ color: '#32335A', fontSize: 20 }}>({symbol})</Text>
      </View> :
        null}


    </View>
  )

  const nativeButton = Platform.OS === 'android' ?
    <TouchableNativeFeedback
      background={TouchableNativeFeedback.SelectableBackground()}
      onPress={onPress}
    >
      {buttonContent}
    </TouchableNativeFeedback > : <TouchableOpacity
      onPress={onPress}
    >
      {buttonContent}
    </TouchableOpacity>

  return nativeButton

}

Button.defaultProps = {
  style: {
    padding: 15,
    height: 60,
    flexDirection: 'row',
  }
}