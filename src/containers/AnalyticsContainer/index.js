import React, { Component } from 'react';
import {
  View,
  Text
} from 'react-native'
import { sumBy, range } from 'lodash'
import { VictoryPie, VictoryLegend } from 'victory-native'
import { Navigation } from 'react-native-navigation'
import { openDatabase } from 'react-native-sqlite-storage'
import Svg from 'react-native-svg'

import { fetchGroupByData } from '../../database'

const db = openDatabase({ name: 'Expense.db' })

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
    const { categoryData} = this.state;
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


  render() {
    return (
      <View>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ height: 200, width: 200, marginLeft: -20 }}>
            <Svg width={500} height={200}>
              <VictoryLegend x={200} y={50}
                standalone={false}
                centerTitle
                labels={(d) => d.name}
                style={{ title: { fontSize: 20 } }}
                orientation="vertical"
                data={this.renderLabels()}
                colorScale={colors}
                events={[
                  {
                    target: "labels",
                    mutation: (props) => {
                      return props.text === "clicked" ? null : { text: "clicked" };
                    }
                  }
                ]}
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

        <View>
          <View>
            <Text>{this.state.transactionType} List</Text>
          </View>
        </View>
      </View>
    )
  }
}

export default AnalyticsContainer 