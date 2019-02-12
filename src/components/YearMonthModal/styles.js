import { moderateScale, verticalScale, scale } from 'react-native-size-matters'

export default styles = {
  modalMainView: {
    backgroundColor: '#5B3BB4',
    height: verticalScale(180),
    padding: verticalScale(20)
  },
  modalTransactionTypeView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 30
  },
  dateModalView: {
    height: moderateScale(40),
    width: moderateScale(40),
    borderRadius: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center'
  },
  dateModalMonthview: {
    height: moderateScale(50),
    width: moderateScale(50)
  },
  selectedDateModalView: {
    backgroundColor: '#F25365',
  },
  selectedDateModalViewText: {
    color: '#fff',
    fontSize: moderateScale(17)
  },
  transactionDetailModalView: {
    backgroundColor: "white",
    borderRadius: moderateScale(4),
    height: verticalScale(250),
    padding: moderateScale(20)
  },
  transactionDetailModalViewHeader: {
    height: verticalScale(50),
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionDetailModalViewHeaderImageView: {
    height: moderateScale(32),
    width: moderateScale(32),
    borderRadius: moderateScale(16),
    justifyContent: 'center',
    alignItems: 'center'
  },
  transactionDetailModalViewHeaderText: {
    fontSize: moderateScale(17)
  },
  transactonDetailModalViewContent: {
    height: moderateScale(150),
    paddingTop: moderateScale(20)
  },
  transactonDetailModalViewContentTypeText: {
    flexDirection: 'row',
    height: verticalScale(30)
  },
  transactonDetailModalViewContentValueText: {
    fontSize: moderateScale(16)
  }

}