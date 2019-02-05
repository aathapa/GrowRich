import { moderateScale, verticalScale, scale } from 'react-native-size-matters'

export default styles = {
  gradientHeight: {
    // height: verticalScale(250)
  },
  modalMainView: {
    backgroundColor: '#fff',
    height: 200,
    padding: 20
  },
  modalTransactionTypeView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 30
  },
  selectedmodalTransactionTypeView: {
    backgroundColor: '#F25365',
    height: 40,
    borderRadius: 15,
  },
  selectedmodalTransactionTypeText: {
    color: '#fff',
    fontSize: 16
  }
}