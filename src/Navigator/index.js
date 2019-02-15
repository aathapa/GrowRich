import React from 'react'
import { Navigation } from 'react-native-navigation'
import { Provider } from 'react-redux'

import { store } from '../redux/store'
import {
  SplashContainer,
  HomeContainer,
  CategoryContainer,
  AnalyticsContainer,
  SettingContainer,
  AddTransactionContainer
} from 'container'

import {
  SPLASH_SCREEN,
  HOME_SCREEN,
  ANALYTICS_SCREEN,
  CATEGORY_SCREEN,
  SETTING_CONTAINER,
  ADDTRANSACTION_CONTAINER
} from './routesConstant'

import hoistNonReactStatic from 'hoist-non-react-statics'

function reactNativeNavigationHOC(WrappedComponent) {
  function HOC({ ...props }) {
    return (
      <Provider store={store}>
        <WrappedComponent {...props} />
      </Provider>
      
    )
  }
  hoistNonReactStatic(HOC, WrappedComponent)
  return HOC
}

export default function registerScreens() {
  Navigation.registerComponent(SPLASH_SCREEN, () => reactNativeNavigationHOC(SplashContainer))
  Navigation.registerComponent(HOME_SCREEN, () => reactNativeNavigationHOC(HomeContainer))
  Navigation.registerComponent(CATEGORY_SCREEN, () => reactNativeNavigationHOC(CategoryContainer))
  Navigation.registerComponent(ANALYTICS_SCREEN, () => reactNativeNavigationHOC(AnalyticsContainer))
  Navigation.registerComponent(SETTING_CONTAINER, () => reactNativeNavigationHOC(SettingContainer))
  Navigation.registerComponent(ADDTRANSACTION_CONTAINER, () => reactNativeNavigationHOC(AddTransactionContainer))
  
}