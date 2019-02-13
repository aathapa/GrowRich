import { Navigation } from 'react-native-navigation'
import registerScreen from 'navigator'

import { SPLASH_SCREEN } from 'navigator/routesConstant'
import { loadIcons } from 'navigator/icons'

loadIcons.then(() => {
  registerScreen()
})

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setDefaultOptions({
    bottomTab: {
      selectedIconColor: '#0043DA',
      selectedTextColor: '#0043DA',
      textColor: '#656D77',
      iconColor: '#656D77'
    },
    bottomTabs: {
      titleDisplayMode: 'alwaysShow'
    },
    statusBar: {
      backgroundColor: '#512DA8',
      style: 'light'
    }
  })
  
  Navigation.setRoot({
    root: {
      stack: {
        children: [{
          component: {
            name: SPLASH_SCREEN,
            options: {
              topBar: {
                visible: false,
                drawBehind: true
              },
            }
          }
        }],
        
      }
      
    }
  })
})
