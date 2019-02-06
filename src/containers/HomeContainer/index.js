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

import Info from 'component/Info'
import Card from 'component/Card'

import { Images, Icons } from 'globalData'
import { month } from 'helper'
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
    isTransactionItemModalVisible: false
  }
  scrollY = new Animated.Value(0)

  componentDidMount = () => {
    Navigation.events().bindComponent(this)
  };

  componentDidAppear() {
    this.fetchData()
  }

  async fetchData() {
    const transactionData = await fetchAllTransaction(db)
    this.setState({ transactionData })
  }

  onMonthPressed(num) {
    const { currentYear } = this.state
    this.setState({ selectedMonth: num })
    const lastDate = new Date(currentYear, num, 0).getDate()
    // console.log('First Date', firstMonthDay(currentYear, num, 1), 'Last Date', lastMonthDay(currentYear, num, lastDate))
    let data = []
    db.transaction(txn => {
      txn.executeSql(`
        SELECT * FROM Transactions
        WHERE transaction_date BETWEEN "2019-1-1" AND "2019-2-31"
      `, [],
        (tx, res) => {
          console.log(res)
          for (let i = 0; i < res.rows.length; i++) {
            data.push(res.rows.item(i))
          }
          this.setState({ transactionData: data })
        }
      )
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

  render() {
    const { currentYear } = this.state
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

    const isMonthActive = (value) => this.state.selectedMonth === value

    return (
      <View style={{ height }}>
        <LineargradientAnimation style={{
          height: 300,
          position: 'absolute',
          left: 0,
          right: 0,
          transform: [
            { translateY }
          ],
        }}
          colors={['#5B3BB4', '#8B4FCB']}>
          <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center', }}>
            <View>
              <Animated.Text style={{ color: '#ccc', fontWeight: '600', opacity: textOpacity }}>CURRENT BALANCE</Animated.Text>
            </View>
            <Animated.View style={{ transform: [{ translateY: balanceTextMargin }] }}>

              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#fff', padding: 10, fontSize: 35 }}>12033444</Text>
              </View>
            </Animated.View>
            <View>
              <Animated.Text style={{ color: '#fff', fontWeight: '600', opacity: textOpacity }}>September 2018</Animated.Text>
            </View>

          </View>
          <View style={{ flex: 1, flexDirection: 'row', marginHorizontal: 15, alignItems: 'center' }}>
            <View style={{ flex: 2, }}>
              <Info
                iconName="arrow-up"
                type="INCOME"
                typeAmount="12000"
                iconColor="green"
                opacity={textOpacity}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Info
                iconName="arrow-down"
                type="EXPENSE"
                typeAmount="13000"
                iconColor="red"
                opacity={textOpacity}

              />
            </View>


          </View>
        </LineargradientAnimation>
        <View>
          <AnimatedFlatList
            contentContainerStyle={{ paddingTop: 225, paddingBottom: 50, }}
            bounces={false}
            data={this.state.transactionData}
            renderItem={({ item }) => <Card
              id={item.id}
              category={item.category}
              amount={item.amount}
              type={item.transaction_type}
              date={item.transaction_date}
              memo={item.memo}
              color={item.color}
              image={Images}
              onPress={() => this.setState({ isTransactionItemModalVisible: true, selectedTransactionData: item })}
            />
            }
            keyExtractor={(item) => item.id}
            onScroll={
              Animated.event(
                [{ nativeEvent: { contentOffset: { y: this.scrollY } }, }],
                { useNativeDriver: true }
              )
            }
            scrollEventThrottle={10}
          />
        </View>

        <Modal
          isVisible={this.state.isDateModalVisible}
          style={{ justifyContent: 'flex-end', margin: 0 }}
          animationInTiming={50}
          onBackdropPress={() => this.setState({ isDateModalVisible: false })}
          backdropOpacity={0.8}
        >
          <View style={styles.modalMainView}>
            <View>
              <View>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity style={{ flex: 1 }} onPress={() => this.onArrowPressed('-')}>
                    <IonIcons name={Icons.IonIcons.arrowBack} size={20} color="#000" />
                  </TouchableOpacity>
                  <View style={{ flex: 3, alignItems: 'center' }}>
                    <Text>{this.state.currentYear}</Text>
                  </View>
                  <TouchableOpacity
                    style={{ flex: 1, alignItems: 'flex-end' }}
                    onPress={() => this.onArrowPressed('+')}
                  >
                    <IonIcons name={Icons.IonIcons.arrowForward} size={20} color="#000" />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                {month.map(({ fullMonth, abbr, num }) => {
                  return (
                    <TouchableOpacity
                      onPress={() => this.onMonthPressed(num)}
                      key={abbr}
                      style={{ height: 50, width: 50 }}
                    >
                      <View style={[styles.dateModalView, isMonthActive(num) ? styles.selectedDateModalView : null]}>
                        <Text style={[{ fontSize: 17 }, isMonthActive(num) ? styles.selectedDateModalViewText : null]}>{abbr}</Text>
                      </View>

                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>
          </View>

        </Modal>
        <TouchableOpacity
          style={styles.filterView}
          onPress={() => this.setState({ isDateModalVisible: true })}
        >
          <IonIcons name={Icons.IonIcons.filter} size={25} color="#fff" />
        </TouchableOpacity>

        <ModalView
          isVisible={this.state.isTransactionItemModalVisible}
          onBackdropPress={() => this.setState({ isTransactionItemModalVisible: false })}
          data={this.state.selectedTransactionData}
          onDeletePressed={() => this.onDeletePressed()}
        >

        </ModalView>

      </View>
    );
  }
}

/**  
  -----------------------------
    Transaction Detail Modal
  -----------------------------

*/

function ModalView({
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
  console.log(data)
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
            <View style={[{backgroundColor: color}, styles.transactionDetailModalViewHeaderImageView]}>
              <Image
                source={Images[category]}
                style={{ width: 20, height: 20 }}
              />
            </View>
          </View>
          <View style={{ flex: 5 }}>
            <Text style={{ fontSize: 17 }}>{category}</Text>
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
        <View style={{ height: 0.7, backgroundColor: '#000' }} />
        <View style={{ height: 150, paddingTop: 20 }}>
          <TransactionDetailContent
            type="Category"
            value={category}
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
    <View style={{ flexDirection: 'row', height: 30 }}>
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