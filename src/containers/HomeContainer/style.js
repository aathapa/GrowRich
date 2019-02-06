import { moderateScale, verticalScale, scale } from 'react-native-size-matters'

export default styles = {
  gradientHeight: {
    // height: verticalScale(250)
  },
  filterView: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: '#ff9f43',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      height: 5,
    },
    shadowOpacity: 0.2,
    zIndex: 1
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
  dateModalView: {
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  selectedDateModalView: {
    backgroundColor: '#F25365',
  },
  selectedDateModalViewText: {
    color: '#fff',
    fontSize: 17
  },
  transactionDetailModalView: {
    backgroundColor: "white",
    borderRadius: 4,
    height: 250,
    padding: 20
  },
  transactionDetailModalViewHeader: {
    height: 30,
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
  },
  transactionDetailModalViewHeaderImageView: {
    height: 32,
    width: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center'
  }

}