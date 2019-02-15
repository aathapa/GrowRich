import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  AsyncStorage
} from 'react-native'
import { sumBy } from 'lodash'
import { VictoryPie, VictoryLegend } from 'victory-native'
import { Navigation } from 'react-native-navigation'
import { openDatabase } from 'react-native-sqlite-storage'
import Svg from 'react-native-svg'
import { connect } from 'react-redux'

import { getCurrency } from '../../redux/actions'
import { fetchGroupByData } from '../../database'

import { TopBar, EmptyDataWithButton, YearMonthModal } from 'component'
import { Icons, Images } from 'globalData'
import { firstMonthDay, lastMonthDay, lastMonthDate, getCurrentFullMonthName, month } from 'helper'
import styles from './styles'

const db = openDatabase({ name: 'Expense.db' })
const { height, width } = Dimensions.get('window')

const colors = ['#F25365', '#FFCE6A', '#FF6C58', '#43C1E4', '#AD94E5', '#569EE6']

class AnalyticsContainer extends Component {

  state = {
    categoryData: [],
    currentYear: new Date().getFullYear(),
    selectedMonth: new Date().getMonth() + 1,
    selectedFullMonth: getCurrentFullMonthName(),
    transactionType: 'Expense',
    totalAmount: null,
    isDateModalVisible: false,
  }

  componentDidMount() {
    Navigation.events().bindComponent(this)
  }

  componentDidAppear() {
    this.fetchData()
    this.props.getCurrency('currency')
  }

  async fetchData() {
    const { currentYear, selectedMonth, transactionType } = this.state
    const lastDate = lastMonthDate(currentYear, selectedMonth)
    const vars = [transactionType, firstMonthDay(currentYear, selectedMonth, 1), lastMonthDay(currentYear, selectedMonth, lastDate)]
    try {
      const categoryData = await fetchGroupByData(db, vars)
      this.setState({ categoryData, totalAmount: sumBy(categoryData, 'y') })
    }
    catch (e) {
      alert(e)
    }
  }

  onArrowPressed(type) {
    this.setState(prevState => ({
      currentYear: type === '+' ? prevState.currentYear + 1 : prevState.currentYear - 1
    }))
  }

  onMonthPressed(num, fullMonth) {
    this.setState({ selectedMonth: num, isDateModalVisible: false, selectedFullMonth: fullMonth }, () => {
      this.fetchData()
    })
  }

  chartData() {
    const { categoryData } = this.state;
    if (categoryData.length <= 0) return [];

    const endLoopValue = categoryData.length > 4 ? 4 : categoryData.length;
    const dataWithoutOthers = categoryData.slice(0, endLoopValue)
    if (dataWithoutOthers.length === categoryData.length) {
      return dataWithoutOthers;
    }

    const totalOtherAmount = sumBy(categoryData.slice(endLoopValue), 'y')
    return [...dataWithoutOthers, { y: totalOtherAmount, x: 'Others' }]
  }

  percentage(amount, totalAmount) {
    return ((amount / totalAmount) * 100).toFixed(2)
  }

  renderLabels() {
    const { totalAmount } = this.state
    return this.chartData().map(({ x, y }, i) => ({
      name: `${this.percentage(y, totalAmount)}% ${x}`
    })
    )
  }

  onClickType(type) {
    this.setState({ transactionType: type }, () => this.fetchData())

  }

  renderItem = ({ x, y, c }) => {
    return (
      <View style={{ flexDirection: 'row', paddingTop: 15 }}>
        <View style={{ flex: 1, }}>
          <View style={[styles.imageView, { backgroundColor: c }]}>
            <Image
              source={Images[x]}
              style={styles.image}
            />
          </View>

        </View>
        <View style={{ flex: 6, flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
          <View style={{ flex: 2 }}>
            <Text style={styles.listItemText}>{x}</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Text style={styles.listItemText}>{this.props.currencySymbol}{y}</Text>
          </View>
        </View>

      </View>
    )
  }

  switchToTab() {
    Navigation.mergeOptions(this.props.componentId, {
      bottomTabs: {
        currentTabIndex: 2
      }
    })
  }

  render() {
    const { categoryData, selectedMonth, isDateModalVisible, currentYear, transactionType } = this.state
    const isMonthActive = (value) => selectedMonth === value
    const activeType = (value) => transactionType === value

    return (
      <View style={{ backgroundColor: '#EEEEEE', flex: 1 }}>
        <TopBar
          title={transactionType}
          iconName={Icons.IonIcons.filter}
          onPress={() => this.setState({ isDateModalVisible: true })}
        />
        <TransactionTypeButton
          onExpensePress={() => this.onClickType('Expense')}
          onIncomePress={() => this.onClickType('Income')}
          activeType={(value) => activeType(value)}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ marginHorizontal: 15, }}>

            {categoryData.length > 0 ?
              <View>
                <TransactionTypeCharts
                  chartData={this.chartData()}
                  labelData={this.renderLabels()}
                />
                <CategoryWiseData
                  renderItem={this.renderItem}
                  categoryData={categoryData}
                  transactionType={transactionType}
                />
              </View>
              : <View style={{ justifyContent: 'center', alignItems: 'center', height, }}>
                <EmptyDataWithButton
                  title="Data Empty"
                  buttonTitle="Add Transactions"
                  onPress={() => this.switchToTab()}
                />
              </View>

            }
          </View>

        </ScrollView>


        <YearMonthModal
          isVisible={isDateModalVisible}
          data={month}
          onBackdropPress={() => this.setState({ isDateModalVisible: false })}
          currentYear={currentYear}
          onArrowBackPressed={() => this.onArrowPressed('-')}
          onArrowForwardPressed={() => this.onArrowPressed('+')}
          onMonthPressed={(num, fullMonth) => this.onMonthPressed(num, fullMonth)}
          isMonthActive={(num) => isMonthActive(num)}
        />
      </View>
    )
  }
}

/**
  ------------------------------------------

      Button that change transaction Type

  ------------------------------------------
 */

function TransactionTypeButton({
  onIncomePress,
  onExpensePress,
  activeType
}) {
  return (
    <View style={styles.transactionTypeButtonView}>
      <View style={styles.transactionTypeButtons}>
        <TouchableOpacity
          onPress={onExpensePress}
          style={[styles.transactiontypeView, activeType('Expense') ? styles.selectedTransactionTypeView : null]}
        >
          <Text style={[styles.transactionTypeText, activeType('Expense') ? styles.selectedTransactionTypeText : null]}>Expense</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          onPress={onIncomePress}
          style={[styles.transactiontypeView, activeType('Income') ? styles.selectedTransactionTypeView : null]}>
          <Text style={[styles.transactionTypeText, activeType('Income') ? styles.selectedTransactionTypeText : null]}>Income</Text>
        </TouchableOpacity>
      </View>
    </View>

  )
}

/**
  ---------------------

        Charts

  ----------------------
 */

function TransactionTypeCharts({
  chartData,
  labelData,

}) {
  return (
    <View style={styles.chartView}>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Svg width={width} height={180}>
          <VictoryLegend x={190} y={20}
            standalone={false}
            centerTitle
            labels={(d) => d.name}
            style={{ title: { fontSize: 14 } }}
            orientation="vertical"
            data={labelData}
            colorScale={colors}
          />

          <VictoryPie
            data={chartData}
            width={210} height={210}
            padAngle={2}
            innerRadius={10}
            labels={() => null}
            colorScale={colors}
          />
        </Svg>

      </View>
    </View>

  )
}

/**
  ----------------------------------

      List of category wise data

  ----------------------------------
 */

function CategoryWiseData({
  transactionType,
  categoryData,
  renderItem
}) {
  return (
    <View style={styles.categoryWiseListView}>
      <View>
        <Text>{transactionType} List</Text>
      </View>
      <View>
        <FlatList
          data={categoryData}
          renderItem={({ item }) => renderItem(item)}
          keyExtractor={(item) => item.x}
          showsVerticalScrollIndicator={false}
        />
      </View>

    </View>
  )
}

export default connect(state => ({ currencySymbol: state.currency.activeSymbol }), { getCurrency })(AnalyticsContainer)   