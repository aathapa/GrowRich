import React, { Component } from 'react'
import {
  View,
  Text,
  Animated,
  Dimensions,
  TouchableOpacity,
  TextInput
} from 'react-native'
import { Navigation } from 'react-native-navigation'
import LinearGradient from 'react-native-linear-gradient';
import { Button } from 'react-native-elements'
import DateTimePicker from 'react-native-modal-datetime-picker';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import { openDatabase } from 'react-native-sqlite-storage'
import uuid from 'uuid/v4'

import TopBar from 'component/Topbar'
import CategoryListing from 'component/CategoryListing'

import { formatDate } from 'helper'

import { insertDataInTransaction, fetchCategoryData } from '../../database'
import { Images } from 'globalData'


const { width, height } = Dimensions.get('window')
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

  rotateValue = new Animated.Value(0)
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
    const vars = [uuid(), currentActiveMenu, selectedCategoryItem, currentDate, amount, memo, colors[Math.floor(Math.random() * colors.length)]]
    try {
      await insertDataInTransaction(db, vars)
    }
    catch (e) {
      console.log(e)
    }
    this.setState({ amount: '', memo: '' })
  }

  onClickMenu(type) {
    this.setState({ currentActiveMenu: type, open: false, }, () => {
      this.fetchData(this.state.currentActiveMenu)
      this.rotateValue.setValue(0)
      this.categoryHeightValue.setValue(0)
    })
  }

  onTopbarHeadingPressed = () => {
    const toValue = this.state.open ? 0 : 1
    Animated.timing(this.rotateValue, {
      toValue,
      duration: 100,
      useNativeDriver: true
    }).start()
    this.setState(prevstate => ({
      open: !prevstate.open
    }))

  }

  animatedCategoryHeight() {
    Animated.timing(this.categoryHeightValue, {
      toValue: 1,
      duration: 100,
    }).start()
  }

  render() {
    const rotate = this.rotateValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg']
    })

    const categoryHeight = this.categoryHeightValue.interpolate({
      inputRange: [0, 1],
      outputRange: [height, 0]
    })

    return (
      <View>
        <TopBar
          onPress={this.onTopbarHeadingPressed}
          rotate={rotate}
          activeMenu={this.state.currentActiveMenu}
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

        <View style={{ marginHorizontal: 15, marginTop: 15 }}>
          <TouchableOpacity onPress={() => this.categoryHeightValue.setValue(0)}>
            <AddTransactionForm
              iconName="grid"
              value={this.state.selectedCategoryItem}
              editable={false}

            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.setState({ isDateTimePickerVisible: true })}>
            <AddTransactionForm
              iconName="calendar"
              value={this.state.currentDate}
              editable={false}
            />
          </TouchableOpacity>

          <AddTransactionForm
            iconName="grid"
            placeholder="Amount"
            value={this.state.amount}
            onChangeText={(amount) => this.setState({ amount })}
            keyboardType="numeric"
          />

          <AddTransactionForm
            iconName="notebook"
            placeholder="Memo"
            value={this.state.memo}
            onChangeText={(memo) => this.setState({ memo })}
          />


        </View>
        <View style={{ marginTop: 20 }}>
          <Button
            title="Add"
            backgroundColor="#9DD377"
            onPress={() => this.insertData()}
          />
        </View>

        <MenuItem
          open={this.state.open}
          onExpensePressed={() => this.onClickMenu('Expense')}
          onIncomePressed={() => this.onClickMenu('Income')}
        />

        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={(date) => this.setState({ isDateTimePickerVisible: false, currentDate: formatDate(date.getFullYear(), date.getMonth()+1, date.getDate()) })
          }
          onCancel={() => this.setState({ isDateTimePickerVisible: false })}
        />
      </View >
    )
  }

}

class AddTransactionForm extends Component {
  render() {
    const { placeholder, value, onChangeText, editable, keyboardType, iconName } = this.props
    return (
      <View
        style={{ flexDirection: 'row', backgroundColor: '#8B4FCB', height: 50, marginTop: 15 }}>
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <SimpleLineIcons name={iconName} color="#fff" size={15} />
        </View>
        <View style={{ flex: 8, justifyContent: 'center', backgroundColor: '#5B3BB4', paddingLeft: 15 }}>
          <TextInput
            style={{ color: '#fff', fontSize: 20 }}
            placeholder={placeholder}
            placeholderTextColor="#fff"
            value={value}
            onChangeText={onChangeText}
            editable={editable}
            keyboardType={keyboardType}
          />
        </View>

      </View>
    )
  }

}


function MenuItem({
  open,
  onExpensePressed,
  onIncomePressed
}) {
  const menuItem = open ? <LinearGradient
    // start={{ x: 0, y: 0 }}
    // end={{ x: 1, y: 0 }}
    colors={['#8B4FCB', '#5B3BB4']}
    style={{ position: 'absolute', top: 70, left: (width / 2) - 50, height: 80, width: 150 }}
  >
    <TouchableOpacity
      style={{ flex: 1, justifyContent: 'center', paddingLeft: 15 }}
      onPress={onExpensePressed}
    >
      <Text style={{ color: '#fff', fontSize: 16 }}>Expense</Text>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={onIncomePressed}
      style={{ flex: 1, paddingLeft: 15 }}
    >
      <Text style={{ color: '#fff', fontSize: 16 }}>Income</Text>
    </TouchableOpacity>

  </LinearGradient> : null

  return menuItem
}

export default AddTransactionContainer