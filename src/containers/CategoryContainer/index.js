import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  Animated,
  ActivityIndicator,
  BackHandler
} from 'react-native'

import { Navigation } from 'react-native-navigation'
import LinearGradient from 'react-native-linear-gradient'
import Feather from 'react-native-vector-icons/Feather'
import { VictoryChart, VictoryLine, VictoryAxis } from 'victory-native'
import { openDatabase } from 'react-native-sqlite-storage'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { Images } from 'globalData'
import { fetchAllCategory, fetchEachCategoryData } from '../../database/'
import { randomColor } from 'helper'
import { EmptyDataWithButton, TopBar } from 'component'

const db = openDatabase({ name: 'Expense.db' })

const { height, width } = Dimensions.get('window')

let color = {}

class CategoryContainer extends Component {

  state = {
    categoryData: [],
    selectedCategory: '',
    eachCategoryData: [],
    categoryFormText: '',
    open: false
  }

  arrayholder = []

  animationValue = new Animated.Value(0)

  componentDidMount() {
    Navigation.events().bindComponent(this)
  }

  componentDidAppear() {
    this.fetchData()
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (this.state.open) {
        this.animateValue()
        return true
      }
      BackHandler.exitApp()

    })
  }

  componentDidDisappear() {
    this.animationValue.setValue(0)
    this.setState({ open: false, categoryFormText: '' })
    this.backHandler.remove()

  }

  async fetchData() {
    const categoryData = await fetchAllCategory(db)
    this.setState({ categoryData })
    this.arrayholder = categoryData
  }

  async fetchCategoryData() {
    const eachCategoryData = await fetchEachCategoryData(db, vars = [this.state.selectedCategory])
    this.setState({ eachCategoryData })
  }

  animateValue = () => {
    const toValue = this.state.open ? 0 : 1
    Animated.timing(this.animationValue, {
      toValue,
      duration: 200,
      useNativeDriver: true
    }).start(finished => {
      if (finished) {
        this.setState(prevState => ({
          open: !prevState.open,
          categoryFormText: ''
        })
        )
      }
    })
  }

  onCategoryItemClick(name) {
    this.animateValue()
    this.setState({ selectedCategory: name }, () => {
      this.fetchCategoryData()
    })
  }

  renderItems = ({ name, id }) => {
    const exactColor = color[id] || randomColor()
    color[id] = exactColor
    return (
      <TouchableOpacity
        onPress={() => this.onCategoryItemClick(name, id)}
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

  onChangeCategoryText = (categoryFormText) => {
    this.setState({ categoryFormText })
    const searchText = categoryFormText.toUpperCase()
    const searchedData = this.arrayholder.filter(d => {
      const name = d.name.toUpperCase()
      return name.indexOf(searchText) > -1
    })
    this.setState({ categoryData: searchedData })
  }

  switchToTab() {
    Navigation.mergeOptions(this.props.componentId, {
      bottomTabs: {
        currentTabIndex: 2
      }
    })
  }

  render() {
    const { eachCategoryData, categoryData, categoryFormText, selectedCategory } = this.state

    const translateX = this.animationValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -width]
    })

    const opacity = this.animationValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0, 1]
    })

    return (
      <View style={{ height }}>
        <CategoryChart
          opacity={opacity}
          eachCategoryData={eachCategoryData}
          switchToTab={() => this.switchToTab()}
          animateValue={this.animateValue}
          selectedCategory={selectedCategory}
        />
        <Animated.View style={{ transform: [{ translateX }] }}>
          <CategoryHeader
            onChangeCategoryText={this.onChangeCategoryText}
            categoryFormText={categoryFormText}
          />
          <CategoryList
            categoryData={categoryData}
            renderItems={this.renderItems}
            categoryFormText={categoryFormText}
          />
        </Animated.View>
      </View>
    )
  }
}


/**
  -----------------------------

        Category List

  -----------------------------
*/

function CategoryList({
  categoryData,
  renderItems,
  categoryFormText
}) {
  return (
    <KeyboardAwareScrollView
    >
      {categoryData.length > 0 ?
        <View style={{ backgroundColor: '#FFFFFF', height: 450 }}>
          <FlatList
            data={categoryData}
            renderItem={({ item }) => renderItems(item)}
            keyExtractor={(item) => item.id}
          />

        </View>
        // 
        : <View style={{ height }}>
          {categoryFormText.length > 0 ?
            <EmptyDataWithButton
              title="Category Not Found"
              buttonTitle="Add Category"
              onPress={() => alert('aa')}
            />
            : <ActivityIndicator size="small" />}
        </View>
      }
    </KeyboardAwareScrollView>
  )
}

/**
  -----------------------------
      
        Category Header

  -----------------------------        
 */

function CategoryHeader({
  onChangeCategoryText,
  categoryFormText
}) {
  return (
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
          {/* <TouchableOpacity style={{ flex: 1, alignItems: 'flex-end' }}>
            <Feather name="plus-circle" color="#fff" size={25} />
          </TouchableOpacity> */}
        </View>
        <View style={{ flexDirection: 'row', backgroundColor: '#fff', height: 40, borderRadius: 20 }}>
          <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <Feather name="search" color="#656d78" size={25} />
          </View>
          <View style={{ flex: 8, justifyContent: 'center' }}>

            <TextInput
              placeholder="Search categories"
              onChangeText={categoryFormText => onChangeCategoryText(categoryFormText)}
              value={categoryFormText}
            />
          </View>
        </View>
      </View>

    </LinearGradient>
  )
}

/**
  -----------------------------

        Category chart  

  -----------------------------          
 */

function CategoryChart({
  opacity,
  eachCategoryData,
  switchToTab,
  animateValue,
  selectedCategory
}) {
  return (
    <Animated.View
      style={{ position: 'absolute', top: 0, left: 0, right: 0, opacity }}
    >
      <TopBar
        title={selectedCategory}
        renderBackButton={true}
        backPress={animateValue}
      />

      {
        eachCategoryData.length > 0 ?
          <View style={{ paddingHorizontal: 15 }}>
            <VictoryChart minDomain={{ y: 0 }}>
              <VictoryAxis dependentAxis />
              <VictoryLine
                style={{
                  data: { stroke: "#c43a31" },
                }}
                interpolation="natural"
                data={eachCategoryData.length === 1 ? [eachCategoryData[0], eachCategoryData[0]] : eachCategoryData}

              />
            </VictoryChart>
          </View> :
          <View style={{ height, justifyContent: 'center', alignItems: 'center' }}>
            <EmptyDataWithButton
              title="Data Empty"
              buttonTitle="Add Transactions"
              onPress={switchToTab}
            />
          </View>
      }
    </Animated.View>
  )
}

export default CategoryContainer