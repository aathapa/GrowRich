import React, { Component } from 'react'
import {
  View,
  Text,
  Animated,
  Dimensions,
  TouchableOpacity,
  BackHandler
} from 'react-native'
import { Navigation } from 'react-native-navigation'
import { Button } from 'react-native-elements'
import DateTimePicker from 'react-native-modal-datetime-picker';
import IonIcons from 'react-native-vector-icons/Ionicons'

import { openDatabase } from 'react-native-sqlite-storage'
import uuid from 'uuid/v4'
import Modal from 'react-native-modal'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { connect } from 'react-redux'

import { CategoryListing, Form, TopBar } from 'component'
import { formatDate } from 'helper'
import { editTransaction } from '../../redux/actions'
import { insertDataInTransaction, fetchCategoryData, updateTransactionData } from '../../database'
import { Images, Icons, Dimension } from 'globalData'
import styles from './styles'


const { height, width } = Dimensions.get('window')
const db = openDatabase({ name: 'Expense.db' })

const colors = ['#F25365', '#FFCE6A', '#FF6C58', '#43C1E4', '#AD94E5', '#569EE6']


class AddTransactionContainer extends Component {

  initialState = {
    amount: '',
    memo: '',
    selectedCategoryItem: null,
    open: false
  }
  state = {
    ...this.initialState,
    isCategoryModalOpen: false,
    currentActiveMenu: 'Expense',
    currentActiveMenuData: [],
    isDateTimePickerVisible: false,
    currentDate: formatDate(),
  }

  categoryHeightValue = new Animated.Value(0)

  componentDidMount() {
    Navigation.events().bindComponent(this)

  }

  componentDidAppear() {
    const { currentActiveMenu } = this.state
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (this.state.open) {
        this.animatedCategoryHeight()
        return true
      }
      BackHandler.exitApp()
    })
    this.fetchData(type = currentActiveMenu)
    if (this.checkEditData()) {
      this.animatedCategoryHeight()
      this.setState({
        amount: this.props.selectedTransactionItemData.amount.toString(),
        memo: this.props.selectedTransactionItemData.memo,
        selectedCategoryItem: this.props.selectedTransactionItemData.category,
        currentActiveMenu: this.props.selectedTransactionItemData.transaction_type

      })
    }

  }

  componentDidDisappear() {
    this.backHandler.remove()
    this.props.editTransaction({})
    this.setState({ ...this.initialState })
    this.categoryHeightValue.setValue(0)
  }

  async fetchData(type) {
    try {
      const currentActiveMenuData = await fetchCategoryData(db, vars = [type])
      this.setState({ currentActiveMenuData })
    }
    catch (e) {

    }
  }

  insertData = async () => {
    const { amount, memo, currentDate, currentActiveMenu, selectedCategoryItem } = this.state

    if (amount.length === 0) {
      alert('Enter amount')
      return
    }

    const insertVars = [uuid(), currentActiveMenu, selectedCategoryItem, currentDate, amount, memo, colors[Math.floor(Math.random() * colors.length)], Date.now()]
    const updateVars = [currentActiveMenu, selectedCategoryItem, currentDate, amount, memo, this.props.selectedTransactionItemData.id]
    if (this.checkEditData()) {
      updateTransactionData(db, updateVars)
    }
    else {
      try {
        await insertDataInTransaction(db, insertVars)
      }
      catch (e) {
        alert(e)
      }
    }

    this.setState({ amount: '', memo: '' })
    setTimeout(() => {
      this.switchToTab(0)
    }, 200);

  }

  switchToTab(tabIndex) {
    Navigation.mergeOptions(this.props.componentId, {
      bottomTabs: {
        currentTabIndex: tabIndex
      }
    })
  }

  onTopbarHeadingPressed = () => {
    this.setState(prevstate => ({
      isCategoryModalOpen: !prevstate.isCategoryModalOpen
    }))

  }

  onClickMenu(type) {
    this.setState({ currentActiveMenu: type, isCategoryModalOpen: false, open: false }, () => {
      this.fetchData(this.state.currentActiveMenu)
      this.categoryHeightValue.setValue(0)
    })
  }

  onPressCategory = () => {
    this.categoryHeightValue.setValue(0)
    this.setState({ open: false })
  }

  onChangeText = (type, value) => {
    this.setState({ [type]: value })
  }

  animatedCategoryHeight = () => {
    const toValue = this.state.open ? 0 : 1
    Animated.timing(this.categoryHeightValue, {
      toValue,
      duration: 200,
      useNativeDriver: true
    }).start(finished => {
      if (finished) this.setState(prevSate => ({ open: !prevSate.open }))

    })
  }

  checkEditData() {
    return Object.keys(this.props.selectedTransactionItemData).length > 0
  }

  render() {
    const { amount, memo, currentDate, selectedCategoryItem, open,
      currentActiveMenu, currentActiveMenuData, isCategoryModalOpen, isDateTimePickerVisible } = this.state;
    const translateX = this.categoryHeightValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -height]
    })

    const formTranslateX = this.categoryHeightValue.interpolate({
      inputRange: [0, 1],
      outputRange: [width, 0]
    })

    const isActive = (value) => currentActiveMenu === value

    return (

      <View style={{ height }} >
        <TopBar
          onPress={this.onTopbarHeadingPressed}
          iconName={Icons.IonIcons.filter}
          title={currentActiveMenu}
          renderBackButton={open}
          backPress={this.animatedCategoryHeight}
        />
        <CategoryForm
          formTranslateX={formTranslateX}
          memo={memo}
          amount={amount}
          selectedCategoryItem={selectedCategoryItem}
          dateTimePickerVisible={() => this.setState({ isDateTimePickerVisible: true })}
          currentDate={currentDate}
          onChangeText={this.onChangeText}
          onButtonPress={this.insertData}
          onPress={this.onPressCategory}
          checkEditData={this.checkEditData.bind(this)}
        />

        <Animated.View style={{ transform: [{ translateX }], position: 'absolute', top: Dimension.TABBAR_HEIGHT, right: 0, left: 0 }}>
          <CategoryListing
            onPress={(item) => {
              this.setState({ selectedCategoryItem: item })
              this.animatedCategoryHeight()
            }}
            data={currentActiveMenuData}
            images={Images}
          />
        </Animated.View>


        <CategoryModal
          isCategoryModalOpen={isCategoryModalOpen}
          onExpensePressed={this.onClickMenu.bind(this, 'Expense')}
          onIncomePressed={this.onClickMenu.bind(this, 'Income')}
          onBackdropPress={() => this.setState({ isCategoryModalOpen: false })}
          isActive={isActive}
          currentActiveMenu={currentActiveMenu}
        />

        <DateTimePicker
          isVisible={isDateTimePickerVisible}
          onConfirm={(date) => this.setState({ isDateTimePickerVisible: false, currentDate: formatDate(date.getFullYear(), date.getMonth() + 1, date.getDate()) })
          }
          onCancel={() => this.setState({ isDateTimePickerVisible: false })}
        />
      </View >

    )
  }

}

/**
  ---------------------------

        Category Form
        
  ---------------------------
 */

function CategoryForm({
  selectedCategoryItem,
  onChangeText,
  memo,
  amount,
  currentDate,
  dateTimePickerVisible,
  onButtonPress,
  onPress,
  formTranslateX,
  checkEditData
}) {
  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      keyboardShouldPersistTaps="always"
      extraScrollHeight={50}
    >
      <Animated.View style={{ marginHorizontal: 15, marginTop: 15, transform: [{ translateX: formTranslateX }] }}>
        <View style={{ borderBottomWidth: 0.7, borderBottomColor: '#5B3BB4' }}>
          <View>
            <Text style={{ color: '#757575' }}>Category</Text>
          </View>
          <View style={{ paddingTop: 10, height: 40 }}>
            <TouchableOpacity onPress={onPress}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                  <IonIcons name={Icons.IonIcons.grid} size={20} color="#616161" />
                </View>
                <View style={{ flex: 10 }}>
                  <Text style={{ fontSize: 17, color: '#424242' }}>{selectedCategoryItem}</Text>
                </View>

              </View>
            </TouchableOpacity>
          </View>

        </View>
        <View style={{ borderBottomWidth: 0.7, borderBottomColor: '#5B3BB4', paddingTop: 20 }}>
          <View>
            <Text style={{ color: '#757575' }}>Date</Text>
          </View>
          <View style={{ paddingTop: 10, height: 40 }}>
            <TouchableOpacity onPress={dateTimePickerVisible}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                  <IonIcons name={Icons.IonIcons.calender} size={20} color="#616161" />
                </View>
                <View style={{ flex: 10 }}>
                  <Text style={{ fontSize: 17, color: '#424242' }}>{currentDate}</Text>
                </View>

              </View>
            </TouchableOpacity>
          </View>

        </View>

        <Form
          iconName="grid"
          label="Amount"
          placeholder="Amount"
          value={amount}
          onChangeText={(amount) => onChangeText('amount', amount)}
          keyboardType="numeric"
        />

        <Form
          iconName="notebook"
          label="Memo"
          placeholder="Memo"
          value={memo}
          onChangeText={(memo) => onChangeText('memo', memo)}
        />

        <View style={{ marginTop: 20 }}>
          <Button
            title={checkEditData() ? 'Update' : 'Add'}
            backgroundColor="#9DD377"
            onPress={onButtonPress}
          />
        </View>
      </Animated.View>
    </KeyboardAwareScrollView>
  )
}

/**
  ---------------------------

        Category Modal

  ---------------------------
 */

function CategoryModal({
  isCategoryModalOpen,
  onExpensePressed,
  onIncomePressed,
  onBackdropPress,
  isActive
}) {
  const icon = <IonIcons name={Icons.IonIcons.check} size={30} color="#fff" />
  return (
    <Modal
      isVisible={isCategoryModalOpen}
      style={{ justifyContent: 'flex-end', margin: 0 }}
      animationInTiming={50}
      onBackdropPress={onBackdropPress}
      backdropOpacity={0.8}
    >
      <View style={styles.categoryModalview}>
        <TouchableOpacity
          style={{ flex: 1, flexDirection: 'row' }}
          onPress={onExpensePressed}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#fff', fontSize: 18 }}>Expense</Text>
          </View>
          <View style={{ flex: 2 }}>
            {isActive('Expense') && icon}
          </View>

        </TouchableOpacity>

        <TouchableOpacity
          onPress={onIncomePressed}
          style={{ flex: 1, flexDirection: 'row' }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#fff', fontSize: 18 }}>Income</Text>
          </View>
          <View style={{ flex: 2 }}>
            {isActive('Income') && icon}
          </View>
        </TouchableOpacity>
      </View>

    </Modal>
  )
}

export default connect(state => ({ selectedTransactionItemData: state.transaction.selectedItemData }), { editTransaction })(AddTransactionContainer)