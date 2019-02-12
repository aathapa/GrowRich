import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  Animated,
  TouchableOpacity,
  Dimensions,
  Image
} from 'react-native';
import Linergradient from 'react-native-linear-gradient'
import { Navigation } from 'react-native-navigation'
import { openDatabase } from 'react-native-sqlite-storage'
import IonIcons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Modal from 'react-native-modal';

import { Info, Card, EmptyDataWithButton, YearMonthModal } from 'component'

import { Images, Icons } from 'globalData'
import { month, firstMonthDay, lastMonthDay, lastMonthDate, getCurrentFullMonthName } from 'helper'
import { fetchAllTransaction, deleteTransactionItem } from '../../database/transactions.model'
import styles from './style'

const { height } = Dimensions.get('window')

const db = openDatabase({ name: 'Expense.db' })

const LineargradientAnimation = new Animated.createAnimatedComponent(Linergradient)
const AnimatedFlatList = new Animated.createAnimatedComponent(FlatList)

class HomeContainer extends Component {

  state = {
    transactionData: [],
    selectedTransactionData: {},
    isDateModalVisible: false,
    selectedTransactionType: null,
    currentYear: new Date().getFullYear(),
    selectedMonth: new Date().getMonth() + 1,
    selectedFullMonth: getCurrentFullMonthName(),
    isTransactionItemModalVisible: false,
    totalExpense: null,
    totalIncome: null,
    totalBalance: null
  }
  scrollY = new Animated.Value(0)

  componentDidMount = () => {
    Navigation.events().bindComponent(this)
  };

  componentDidAppear() {
    this.fetchData()
  }

  async fetchData() {
    const { currentYear, selectedMonth } = this.state
    const lastDate = lastMonthDate(currentYear, selectedMonth)
    const vars = [firstMonthDay(currentYear, selectedMonth, 1), lastMonthDay(currentYear, selectedMonth, lastDate)]
    const transactionData = await fetchAllTransaction(db, vars)

    const totalExpense = this.calculateTotal(transactionData, 'Expense')
    const totalIncome = this.calculateTotal(transactionData, 'Income')

    this.setState({ transactionData, totalExpense, totalIncome, totalBalance: totalIncome - totalExpense })
  }

  calculateTotal(data = [], type) {
    return data.filter(t => t.transaction_type === type).reduce((acc, ele) => (acc + ele.amount), 0)
  }

  onMonthPressed(num, fullMonth) {
    this.setState({ selectedMonth: num, isDateModalVisible: false, selectedFullMonth: fullMonth }, () => {
      this.fetchData()
    })
  }

  onDeletePressed() {
    const { id } = this.state.selectedTransactionData
    deleteTransactionItem(db, vars = [id])
    this.fetchData()
    this.setState({ isTransactionItemModalVisible: false })
  }

  onArrowPressed(type) {
    this.setState(prevState => ({
      currentYear: type === '+' ? prevState.currentYear + 1 : prevState.currentYear - 1
    }))
  }

  switchToTab() {
    Navigation.mergeOptions(this.props.componentId, {
      bottomTabs: {
        currentTabIndex: 2
      }
    })
  }


  render() {
    const {
      currentYear,
      transactionData,
      isDateModalVisible,
      isTransactionItemModalVisible,
      selectedTransactionData,
      totalExpense,
      totalIncome,
      totalBalance,
      selectedMonth,
      selectedFullMonth
    } = this.state
    const inputRange = [0, 20, 40, 60, 80, 100]
    const translateY = this.scrollY.interpolate({
      inputRange,
      outputRange: [-25, -40, -60, -90, -130, -160,]
    })

    const balanceTextMargin = this.scrollY.interpolate({
      inputRange,
      outputRange: [0, 20, 40, 60, 90, 120],
      extrapolate: 'clamp'
    })

    const textOpacity = this.scrollY.interpolate({
      inputRange: [0, 50, 100],
      outputRange: [1, 0.4, 0],
    })

    const isMonthActive = (value) => selectedMonth === value

    return (
      <View style={{ height }}>
        <TransactionTotalValue
          translateY={translateY}
          textOpacity={textOpacity}
          balanceTextMargin={balanceTextMargin}
          totalExpense={totalExpense}
          totalIncome={totalIncome}
          totalBalance={totalBalance}
          selectedFullMonth={selectedFullMonth}
          currentYear={currentYear}
        />
        {transactionData.length > 0 ?
          <View>

            <View style={{ height: height }}>
              <TransactionList
                transactionData={transactionData}
                scrollY={this.scrollY}
                onPress={(item) =>
                  this.setState({
                    isTransactionItemModalVisible: true,
                    selectedTransactionData: item
                  })}
              />
            </View>

          </View>
          : <View style={{ height, justifyContent: 'center', alignItems: 'center' }}>
            <EmptyDataWithButton
              title="Transaction Empty"
              buttonTitle="Start tracking your money"
              onPress={() => this.switchToTab()}
            />
          </View>
        }

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

        <TransactionDetailModalView
          isVisible={isTransactionItemModalVisible}
          onBackdropPress={() => this.setState({ isTransactionItemModalVisible: false })}
          data={selectedTransactionData}
          onDeletePressed={() => this.onDeletePressed()}
        />
        <TouchableOpacity
          style={styles.filterView}
          onPress={() => this.setState({ isDateModalVisible: true })}
        >
          <IonIcons name={Icons.IonIcons.filter} size={25} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }
}

/**
  --------------------------------

      Total Transaction Value

  --------------------------------
 */

function TransactionTotalValue({
  translateY,
  textOpacity,
  balanceTextMargin,
  totalExpense,
  totalIncome,
  totalBalance,
  selectedFullMonth,
  currentYear
}) {
  return (
    <LineargradientAnimation style={[styles.homeContainerHeaderView, { transform: [{ translateY }], }]}
      colors={['#5B3BB4', '#8B4FCB']}>
      <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center', }}>
        <View>
          <Animated.Text style={{ color: '#ccc', fontWeight: '600', opacity: textOpacity }}>CURRENT BALANCE</Animated.Text>
        </View>
        <Animated.View style={{ transform: [{ translateY: balanceTextMargin }] }}>

          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.homeContainerHeaderCurrentBalanceText}>{totalBalance}</Text>
          </View>
        </Animated.View>
        <View>
          <Animated.Text style={{ color: '#fff', fontWeight: '600', opacity: textOpacity }}>{`${selectedFullMonth} ${currentYear}`}</Animated.Text>
        </View>

      </View>
      <View style={{ flex: 1, flexDirection: 'row', marginHorizontal: 15, alignItems: 'center' }}>
        <View style={{ flex: 2, }}>
          <Info
            iconName="arrow-down"
            type="INCOME"
            typeAmount={totalIncome}
            iconColor="green"
            opacity={textOpacity}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Info
            iconName="arrow-up"
            type="EXPENSE"
            typeAmount={totalExpense}
            iconColor="red"
            opacity={textOpacity}

          />
        </View>


      </View>
    </LineargradientAnimation>
  )
}

/**
  ----------------------------------

          Transaction List

  ----------------------------------          
*/

function TransactionList({
  transactionData,
  scrollY,
  onPress
}) {
  return (
    <AnimatedFlatList
      contentContainerStyle={styles.homeContainerTransactionList}
      bounces={false}
      data={transactionData}
      renderItem={({ item }) => <Card
        id={item.id}
        category={item.category}
        amount={item.amount}
        type={item.transaction_type}
        date={item.transaction_date}
        memo={item.memo}
        color={item.color}
        image={Images}
        onPress={() => onPress(item)}
      />
      }
      keyExtractor={(item) => item.id}
      onScroll={
        Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } }, }],
          { useNativeDriver: true }
        )
      }
      scrollEventThrottle={10}
      showsVerticalScrollIndicator={false}
    />
  )
}

/**  
  -----------------------------

    Transaction Detail Modal

  -----------------------------
*/

function TransactionDetailModalView({
  isVisible,
  onBackdropPress,
  data,
  onDeletePressed,
  onEditPressed
}) {
  const {
    category,
    memo,
    amount,
    transaction_type,
    color,
    transaction_date,
  } = data
  return (
    <Modal
      isVisible={isVisible}
      animationInTiming={50}
      onBackdropPress={onBackdropPress}
      backdropOpacity={0.8}
    >
      <View style={styles.transactionDetailModalView}>
        <View style={styles.transactionDetailModalViewHeader}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={[{ backgroundColor: color }, styles.transactionDetailModalViewHeaderImageView]}>
              <Image
                source={Images[category]}
                style={{ width: 20, height: 20 }}
              />
            </View>
          </View>
          <View style={{ flex: 5 }}>
            <Text style={styles.transactionDetailModalViewHeaderText}>{category}</Text>
          </View>
          <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'space-around', }}>
            <TouchableOpacity
              onPress={onEditPressed}
            >
              <AntDesign name="edit" size={20} color="#212121" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onDeletePressed}
            >
              <AntDesign name="delete" size={20} color="#212121" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ height: 0.4, backgroundColor: '#000' }} />
        <View style={styles.transactonDetailModalViewContent}>
          <TransactionDetailContent
            type="Category"
            value={category}
          />
          <TransactionDetailContent
            type="Type"
            value={transaction_type}
          />
          <TransactionDetailContent
            type="Amount"
            value={amount}
          />
          {memo !== '' && <TransactionDetailContent
            type="Memo"
            value={memo}
          />}

          <TransactionDetailContent
            type="Date"
            value={transaction_date}
          />
        </View>
      </View>

    </Modal>
  )
}

function TransactionDetailContent({
  value,
  type
}) {
  return (
    <View style={styles.transactonDetailModalViewContentTypeText}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, color: '#616161' }}>{type}</Text>
      </View>
      <View style={{ flex: 2 }}>
        <Text style={{ fontSize: 16 }}>{value}</Text>
      </View>
    </View>
  )
}

export default HomeContainer