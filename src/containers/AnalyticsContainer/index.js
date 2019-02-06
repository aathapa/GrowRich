import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
  FlatList,
  Image
} from 'react-native'
import { sumBy } from 'lodash'
import { VictoryPie, VictoryLegend } from 'victory-native'
import { Navigation } from 'react-native-navigation'
import { openDatabase } from 'react-native-sqlite-storage'
import Svg from 'react-native-svg'
import IonIcons from 'react-native-vector-icons/Ionicons'

import { fetchGroupByData } from '../../database'

import { TopBar } from 'component'
import { Icons, Images } from 'globalData'

const db = openDatabase({ name: 'Expense.db' })
const { height } = Dimensions.get('window')

const colors = ['#F25365', '#FFCE6A', '#FF6C58', '#43C1E4', '#AD94E5', '#569EE6']

class AnalyticsContainer extends Component {

  state = {
    categoryData: [],
    transactionType: 'Expense',
    totalAmount: null
  }

  componentDidMount() {
    Navigation.events().bindComponent(this)
  }

  componentDidAppear() {
    this.fetchData(this.state.transactionType)
  }

  async fetchData(type) {
    try {
      const categoryData = await fetchGroupByData(db, vars = [type])
      this.setState({ categoryData, totalAmount: sumBy(categoryData, 'y') })
    }
    catch (e) {
      alert(e)
    }
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

  renderItem({ x, y ,c}) {
    
    return (
      <View style={{flex: 1, flexDirection: 'row', paddingTop: 20}}>
        <View style={{ flex: 1, }}>
          <View style={{ backgroundColor: c, height: 26, width: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center'}}>
            <Image
              source={Images[x]}
              style={{ height: 15, width: 15 }}
            />
          </View>
         
        </View>
        <View style={{flex: 6,flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ccc'}}>
          <View style={{ flex: 2 }}>
            <Text>{x}</Text>
          </View>
          <View style={{ flex: 1 ,alignItems: 'flex-end'}}>
            <Text>{y}</Text>
          </View>
        </View>
        
      </View>
      
    )
  }

  render() {
    return (
      <View style={{ backgroundColor: '#EEEEEE', height }}>
        {/* <TopBar>
          <IonIcons name={Icons.filter} size={25} color="#fff" />
        </TopBar> */}
        <View style={{ marginHorizontal: 15 }}>
          <View style={{ flexDirection: 'row', backgroundColor: '#fff', borderWidth: 0.5, borderColor: '#ccc', borderRadius: 3 }}>
            <View style={{ height: 200, width: 200 }}>
              <Svg width={500} height={200}>
                <VictoryLegend x={200} y={50}
                  standalone={false}
                  centerTitle
                  labels={(d) => d.name}
                  style={{ title: { fontSize: 20 } }}
                  orientation="vertical"
                  data={this.renderLabels()}
                  colorScale={colors}
                />

                <VictoryPie
                  data={this.chartData()}
                  width={250} height={250}
                  padAngle={2}
                  innerRadius={10}
                  labels={() => null}
                  colorScale={colors}
                />
              </Svg>

            </View>
          </View>

          <View style={{ borderRadius: 3, borderWidth: 0.5, borderColor: '#ccc', backgroundColor: '#fff', marginTop: 10, padding: 20 }}>
            <View>
              <Text>{this.state.transactionType} List</Text>
            </View>
            <View>
              <FlatList
                data={this.state.categoryData}
                renderItem={({ item }) => this.renderItem(item)}
                keyExtractor={(item)=> item.x}
              />
            </View>
          </View>
        </View>

      </View>
    )
  }
}

export default AnalyticsContainer 