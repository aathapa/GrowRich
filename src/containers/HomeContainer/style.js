import { moderateScale, verticalScale, scale } from 'react-native-size-matters'

export default styles = {
  homeContainerHeaderView: {
    height: verticalScale(280),
    position: 'absolute',
    left: 0,
    right: 0,
  },
  homeContainerHeaderCurrentBalanceText: {
    color: '#fff',
    padding: moderateScale(10),
    fontSize: moderateScale(35)
  },
  homeContainerTransactionList: {
    paddingTop: verticalScale(220),
    paddingBottom: verticalScale(80),
  },
  filterView: {
    position: 'absolute',
    bottom: moderateScale(130, 0.1),
    right: scale(20),
    height: moderateScale(50),
    width: moderateScale(50),
    borderRadius: moderateScale(25),
    backgroundColor: '#ff9f43',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      height: verticalScale(5),
    },
    shadowOpacity: 0.2,
    zIndex: 1,
    elevation: 6
  },
  modalMainView: {
    backgroundColor: '#fff',
    height: verticalScale(200),
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