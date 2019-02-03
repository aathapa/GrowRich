import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  Animated
} from 'react-native'

import { Navigation } from 'react-native-navigation'
import LinearGradient from 'react-native-linear-gradient'
import Feather from 'react-native-vector-icons/Feather'

import { openDatabase } from 'react-native-sqlite-storage'
import { Images } from 'globalData'
import { fetchAllCategory } from '../../database/'
import { randomColor } from 'helper'

const db = openDatabase({ name: 'Expense.db' })

const { width } = Dimensions.get('window')

let color = {}

class CategoryContainer extends Component {

  state = {
    categoryData: []
  }

  animationValue = new Animated.Value(0)

  componentDidMount() {
    Navigation.events().bindComponent(this)
  }

  componentDidAppear() {
    this.fetchData()
  }

  componentDidDisappear() {
    this.animationValue.setValue(0)
  }

  onCategoryItemClick() {
    Animated.timing(this.animationValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true
    }).start()
  }

  renderItems({ name, id }) {
    const exactColor = color[id] || randomColor()
    color[id] = exactColor
    return (
      <TouchableOpacity
        onPress={() => this.onCategoryItemClick()}
      >
        <View style={{ flex: 1, flexDirection: 'row', height: 50, alignItems: 'center', marginHorizontal: 15 }}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: exactColor, height: 32, width: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' }}>
              <Image
                source={Images[name]}
                style={{ width: 20, height: 20 }}
              />
            </View>
          </View>
          <View style={{ flex: 5 }}>
            <Text style={{ fontSize: 16 }}>{name}</Text>
          </View>

          <View style={{ justifyContent: 'flex-end' }}>
            <Feather name="chevron-right" size={20} color="grey" />
          </View>
        </View>

      </TouchableOpacity>

    )
  }

  async fetchData() {
    const categoryData = await fetchAllCategory(db)
    this.setState({ categoryData })
  }

  render() {

    const translateX = this.animationValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -width]
    })
    return (
      <View style={{}}>
        <Animated.View
          style={{ transform: [{ translateX }]}}
        >
          <LinearGradient
            style={{ height: 150, justifyContent: 'center', }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={['#8B4FCB', '#5B3BB4']}

          >
            <View style={{ marginHorizontal: 15, }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 20 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#fff', fontSize: 25, fontWeight: '600' }}>Categories</Text>
                </View>
                <TouchableOpacity style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Feather name="plus-circle" color="#fff" size={25} />
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row', backgroundColor: '#fff', height: 40, borderRadius: 20 }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                  <Feather name="search" color="#656d78" size={25} />
                </View>
                <View style={{ flex: 8, justifyContent: 'center' }}>
                  <TextInput
                    placeholder="Search categories"
                  />
                </View>
              </View>
            </View>

          </LinearGradient>
          <View style={{ backgroundColor: '#FFFFFF', height: 470 }}>
            <FlatList
              data={this.state.categoryData}
              renderItem={({ item }) => this.renderItems(item)}
              keyExtractor={(item) => item.id}
            />
          </View>
        </Animated.View>
        
      </View>
    )
  }
}

export default CategoryContainer