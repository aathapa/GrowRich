import { Platform } from 'react-native'

export const Icons = {
  IonIcons: {
    ...Platform.select({
      ios: {
        filter: 'ios-funnel',
        arrowBack: 'ios-arrow-back',
        arrowForward: 'ios-arrow-forward'
      },
      android: {
        filter: 'md-funnel',
        arrowBack: 'md-arrow-back',
        arrowForward: 'md-arrow-forward'
      }
    })
  },
}