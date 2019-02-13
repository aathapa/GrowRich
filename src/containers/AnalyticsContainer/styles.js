import { verticalScale, moderateScale } from 'react-native-size-matters'

export default styles = {
  analyticsContainerView: {
    margin: moderateScale(15)
  },
  chartView: {
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
    borderRadius: moderateScale(3),
    borderWidth: moderateScale(0.5),
    borderColor: '#ccc',
    backgroundColor: '#fff',
    marginTop: verticalScale(10),
    padding: moderateScale(15),
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
  },
  imageView: {
    height: moderateScale(26),
    width: moderateScale(26),
    borderRadius: moderateScale(13),
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    height: moderateScale(15),
    width: moderateScale(15)
  },
  listItemText: {
    fontSize: moderateScale(12)
  },
  transactionTypeButtonView: {
    marginTop: moderateScale(15),
    height: moderateScale(40)
  },
  transactionTypeButtons: {
    flexDirection: 'row',
    height: moderateScale(35),
    paddingHorizontal: moderateScale(20),
  }
}