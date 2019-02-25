import { Dimensions } from 'react-native'
import { moderateScale, verticalScale } from 'react-native-size-matters'

const { height } = Dimensions.get('window')

export default styles = {
  categoryHeaderView: {
    height: verticalScale(130),
    justifyContent: 'center',
  },
  categoryListView: {
    backgroundColor: '#FFFFFF',
    height: moderateScale(height - 180),
    paddingBottom: 30
  }
}