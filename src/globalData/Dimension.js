import { Platform } from 'react-native'

export const Dimension = {
  TABBAR_HEIGHT: Platform.OS === 'android' ? 60 : 70
}

