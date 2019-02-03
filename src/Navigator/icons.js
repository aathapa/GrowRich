import IonIcons from 'react-native-vector-icons/Ionicons'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'

export const loadIcons = Promise.all([
  IonIcons.getImageSource('md-person', 25),
  IonIcons.getImageSource('md-list-box', 25),
  SimpleLineIcons.getImageSource('home', 25),
  SimpleLineIcons.getImageSource('grid', 25),
  SimpleLineIcons.getImageSource('pie-chart', 25),
  SimpleLineIcons.getImageSource('settings', 25),
  SimpleLineIcons.getImageSource('plus', 30)
  
]).then((sources) => {
  person = sources[0]
  list = sources[1]
  home = sources[2]
  category = sources[3]
  chart = sources[4]
  setting = sources[5]
  plus = sources[6]
  return true;
}).catch(error => error);
