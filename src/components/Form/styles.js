import { moderateScale, verticalScale } from 'react-native-size-matters'

export default styles = {
  formView: {
    height: verticalScale(90),
    borderBottomWidth: 0.7,
    borderBottomColor: '#5B3BB4',
    paddingTop: verticalScale(20)
  },
  formIconAndTextInputView: {
    flexDirection: 'row',
  },
  textInputText: {
    color: '#424242',
    fontSize: moderateScale(17)
  }
}