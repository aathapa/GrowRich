import React, { Component } from 'react'
import {
  View,
  Text,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native'
import { Navigation } from 'react-native-navigation'
import { Button } from 'react-native-elements'
import DateTimePicker from 'react-native-modal-datetime-picker';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import { openDatabase } from 'react-native-sqlite-storage'
import uuid from 'uuid/v4'
import Modal from 'react-native-modal'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { CategoryListing, Form, TopBar } from 'component'

import { formatDate } from 'helper'

import { insertDataInTransaction, fetchCategoryData } from '../../database'
import { Images, Icons } from 'globalData'
import styles from './styles'


const { height } = Dimensions.get('window')
const db = openDatabase({ name: 'Expense.db' })

const colors = ['#F25365', '#FFCE6A', '#FF6C58', '#43C1E4', '#AD94E5', '#569EE6']


class AddTransactionContainer extends Component {

  state = {
    open: false,
    currentActiveMenu: 'Expense',
    currentActiveMenuData: [],
    selectedCategoryItem: null,
    isDateTimePickerVisible: false,
    currentDate: formatDate(),
    amount: '',
    memo: ''
  }

  categoryHeightValue = new Animated.Value(0)

  componentDidMount() {
    Navigation.events().bindComponent(this)
  }

  componentDidAppear() {
    const { currentActiveMenu } = this.state
    this.fetchData(type = currentActiveMenu)
  }

  async fetchData(type) {
    try {
      const currentActiveMenuData = await fetchCategoryData(db, vars = [type])
      this.setState({ currentActiveMenuData })
    }
    catch (e) {

    }
  }

  async insertData() {
    const { amount, memo, currentDate, currentActiveMenu, selectedCategoryItem } = this.state

    if (amount.length === 0) {
      alert('Enter amount')
      return
    }
    
    const vars = [uuid(), currentActiveMenu, selectedCategoryItem, currentDate, amount, memo, colors[Math.floor(Math.random() * colors.length)], Date.now()]
    try {
      await insertDataInTransaction(db, vars)
    }
    catch (e) {
      alert(e)
    }
    this.setState({ amount: '', memo: '' })
  }

  onTopbarHeadingPressed = () => {
    this.setState(prevstate => ({
      open: !prevstate.open
    }))

  }

  onClickMenu(type) {
    this.setState({ currentActiveMenu: type, open: false, }, () => {
      this.fetchData(this.state.currentActiveMenu)
      this.categoryHeightValue.setValue(0)
    })
  }

  onChangeText = (type, value) => {
    this.setState({ [type]: value })
  }

  animatedCategoryHeight() {
    Animated.timing(this.categoryHeightValue, {
      toValue: 1,
      duration: 100,
    }).start()
  }

  render() {
    const { amount, memo, currentDate, selectedCategoryItem } = this.state;
    const categoryHeight = this.categoryHeightValue.interpolate({
      inputRange: [0, 1],
      outputRange: [height, 0]
    })

    return (
      <View style={{ height }}>
        <TopBar
          onPress={this.onTopbarHeadingPressed}
          iconName={Icons.IonIcons.filter}
          title={this.state.currentActiveMenu}
        />
        <Animated.View style={{ height: categoryHeight }}>
          <CategoryListing
            onPress={(item) => {
              this.setState({ selectedCategoryItem: item })
              this.animatedCategoryHeight()
            }}
            data={this.state.currentActiveMenuData}
            images={Images}
          />
        </Animated.View>

        <CategoryForm
          memo={memo}
          amount={amount}
          selectedCategoryItem={selectedCategoryItem}
          dateTimePickerVisible={() => this.setState({ isDateTimePickerVisible: true })}
          currentDate={currentDate}
          onChangeText={this.onChangeText}
          onButtonPress={() => this.insertData()}
          onPress={() => this.categoryHeightValue.setValue(0)}
        />
        <CategoryModal
          open={this.state.open}
          onExpensePressed={() => this.onClickMenu('Expense')}
          onIncomePressed={() => this.onClickMenu('Income')}
          onBackdropPress={() => this.setState({ open: false })}
        />

        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
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
  onPress
}) {
  return (
    <KeyboardAwareScrollView
      extraScrollHeight={50}
      enableOnAndroid
    >
      <View style={{ marginHorizontal: 15, marginTop: 15 }}>
        <View style={{ borderBottomWidth: 0.7, borderBottomColor: '#5B3BB4' }}>
          <View>
            <Text style={{ color: '#757575' }}>Category</Text>
          </View>
          <View style={{ paddingTop: 10, height: 40 }}>
            <TouchableOpacity onPress={onPress}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                  <SimpleLineIcons name="grid" size={20} color="#616161" />
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
                  <SimpleLineIcons name="calendar" size={20} color="#616161" />
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
            title="Add"
            backgroundColor="#9DD377"
            onPress={onButtonPress}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  )
}

/**
  ---------------------------

        Category Modal

  ---------------------------
 */

function CategoryModal({
  open,
  onExpensePressed,
  onIncomePressed,
  onBackdropPress
}) {
  return (
    <Modal
      isVisible={open}
      style={{ justifyContent: 'flex-end', margin: 0 }}
      animationInTiming={50}
      onBackdropPress={onBackdropPress}
      backdropOpacity={0.8}
    >
      <View style={styles.categoryModalview}>
        <TouchableOpacity
          style={{ flex: 1,}}
          onPress={onExpensePressed}
        >
          <Text style={{ color: '#fff', fontSize: 18 }}>Expense</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onIncomePressed}
          style={{ flex: 1, }}
        >
          <Text style={{ color: '#fff', fontSize: 18 }}>Income</Text>
        </TouchableOpacity>
      </View>

    </Modal>
  )
}

export default AddTransactionContainer