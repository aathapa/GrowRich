import { Platform } from 'react-native'

export const Icons = {
  IonIcons: {
    ...Platform.select({
      ios: {
        filter: 'ios-funnel',
        arrowBack: 'ios-arrow-back',
        arrowForward: 'ios-arrow-forward',
        grid: 'ios-grid',
        calender: 'ios-calendar',
        check: 'ios-checkmark',
        back: 'ios-arrow-round-back'
      },
      android: {
        filter: 'md-funnel',
        arrowBack: 'md-arrow-back',
        arrowForward: 'md-arrow-forward',
        grid: 'md-grid',
        calender: 'md-calendar',
        check: 'md-checkmark',
        back: 'md-arrow-back'
      }
    })
  },
}