import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  Animated,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import Linergradient from 'react-native-linear-gradient'
import { Navigation } from 'react-native-navigation'
import { openDatabase } from 'react-native-sqlite-storage'
import IonIcons from 'react-native-vector-icons/Ionicons'
import Modal from 'react-native-modal';

import Info from 'component/Info'
import Card from 'component/Card'

import { Images, Icons } from 'globalData'
import { month, firstMonthDay, lastMonthDay } from 'helper'
import { fetchAllTransaction } from '../../database/transactions.model'
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
    selectedMonth: null
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
    const lastDate = new Date(currentYear, num, 0).getDate()
    // console.log('First Date', firstMonthDay(currentYear, num, 1), 'Last Date', lastMonthDay(currentYear, num, lastDate))
    let data = []
    db.transaction(txn => {
      txn.executeSql(`
        SELECT * FROM Transactions
        WHERE transaction_date BETWEEN "2019-2-1" AND "2019-2-31"
      `, [],
        (tx, res) => {
          console.log(res)
          for (let i = 0; i < res.rows.length; i++) {
            data.push(res.rows.item(i))
          }
          this.setState({transactionData: data})
        }
      )
    })
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

    const isActive = (value) => this.state.selectedTransactionType === value
    const isMonthActive = (value) = this.state.selectedMonth
    // console.log(this.state.transactionData)
    
    return (
      <View style={{height}}>
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
              onPress={() => alert(item)}
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
            <View style={{ height: 100 }}>
              <View>
                <Text style={{ fontSize: 18 }}>Transaction Type</Text>
              </View>
              <View style={{ height: 2, backgroundColor: '#000' }} />
              <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                <TouchableOpacity
                  style={[styles.modalTransactionTypeView, isActive('Expense') ? styles.selectedmodalTransactionTypeView : null]}
                  onPress={() => this.setState({ selectedTransactionType: 'Expense' })}
                >
                  <Text style={isActive('Expense') ? styles.selectedmodalTransactionTypeText : null}>Expense</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalTransactionTypeView, isActive('Income') ? styles.selectedmodalTransactionTypeView : null]}
                  onPress={() => this.setState({ selectedTransactionType: 'Income' })}
                >
                  <Text style={isActive('Income') ? styles.selectedmodalTransactionTypeText : null}>Income</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalTransactionTypeView, isActive('Both') ? styles.selectedmodalTransactionTypeView : null]}
                  onPress={() => this.setState({ selectedTransactionType: 'Both' })}
                >
                  <Text style={isActive('Both') ? styles.selectedmodalTransactionTypeText : null}>Both</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <View>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity style={{ flex: 1 }} onPress={() => this.setState({ currentYear: this.state.currentYear - 1 })}>
                    <IonIcons name={Icons.IonIcons.arrowBack} size={20} color="#000" />
                  </TouchableOpacity>
                  <View style={{ flex: 3, alignItems: 'center' }}>
                    <Text>{this.state.currentYear}</Text>
                  </View>
                  <TouchableOpacity style={{ flex: 1, alignItems: 'flex-end' }}>
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
                      style={{ height: 50, width: 50, justifyContent: 'center', alignItems: 'center' }}
                    >
                      <Text style={{ fontSize: 17 }}>{abbr}</Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>
          </View>

        </Modal>
        <TouchableOpacity
          style={{
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
          }}
          onPress={() => this.setState({ isDateModalVisible: true })}
        >
          <IonIcons name={Icons.IonIcons.filter} size={25} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }
}

export default HomeContainer