import { verticalScale, moderateScale } from 'react-native-size-matters'

export default styles = {
  analyticsContainerView: {
    margin: moderateScale(15)
  },
  chartView: {
    // height: verticalScale(180),
    // flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#ccc',
    borderRadius: moderateScale(3),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(10)
  },
  categoryWiseListView: {
    // flex: 2,
    height: verticalScale(280),
    borderRadius: moderateScale(3),
    borderWidth: moderateScale(0.5),
    borderColor: '#ccc',
    backgroundColor: '#fff',
    marginTop: verticalScale(10),
    padding: moderateScale(20),
    // paddingBottom: ,
  },
  transactiontypeView: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#BDBDBD',
    shadowOpacity: 0.6,
    shadowOffset: {
      height: 10, width: 10
    },
    shadowRadius: 10,
    borderRadius: 10,
    elevation: 6
  },
  selectedTransactionTypeView: {
    backgroundColor: '#5B3BB4',
  },
  transactionTypeText: {
    color: '#000',
  },
  selectedTransactionTypeText: {
    color: '#fff',
    fontSize: moderateScale(17)
  }

}