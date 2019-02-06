import { Navigation } from 'react-native-navigation'
import { HOME_SCREEN, CATEGORY_SCREEN, ANALYTICS_SCREEN, SETTING_CONTAINER, ADDTRANSACTION_CONTAINER } from 'navigator/routesConstant'

export function goToAuth() {
  Navigation.setRoot({
    root: {
      bottomTabs: {
        children: [{
          stack: {
            children: [{
              component: {
                name: HOME_SCREEN,
                options: {
                  topBar: {
                    visible: false,
                    drawBehind: true
                  },
                  bottomTab: {
                    text: 'Home',
                    icon: home,
                  }
                }
              }
            }]
          }

        },
        {
          stack: {
            children: [{
              component: {
                name: CATEGORY_SCREEN,
                options: {
                  topBar: {
                    visible: false,
                    drawBehind: true
                  },
                  bottomTab: {
                    text: 'Category',
                    icon: category,
                  }
                }
              }
            }]
          }

          }, {
          stack: {
              children: [{
                component: {
                  name: ADDTRANSACTION_CONTAINER,
                  options: {
                    topBar: {
                      visible: false,
                      drawBehind: true
                    },
                    bottomTab: {
                      icon: plus,
                      text: 'Add'
                    }
                  }
              }
            }]
          }
        },
        {
          stack: {
            children: [{
              component: {
                name: ANALYTICS_SCREEN,
                options: {
                  topBar: {
                    visible: false,
                    drawBehind: true
                  },
                  bottomTab: {
                    text: 'Analytics',
                    icon: chart
                  }
                }
              }
            }]
          }
        },
        {
          stack: {
            children: [{
              component: {
                name: SETTING_CONTAINER,
                options: {
                  bottomTab: {
                    text: 'Setting',
                    icon: setting
                  }
                }
              },

            }]
          }
          },
        ],
      }
    }
  })
}

