import React, { Component } from 'react';
import {
  View,
  AsyncStorage,
  FlatList,
  Text
} from 'react-native';
import Modal from 'react-native-modal'
import { Navigation } from 'react-native-navigation'
import { connect } from 'react-redux'

import { Button, TopBar } from 'component'
import { getCurrency } from '../../redux/actions'

import { currency } from 'helper'

class SettingContainer extends Component {

  state = {
    isModalVisible: false,
  }

  componentDidMount() {
    Navigation.events().bindComponent(this)
  }

  componentDidAppear() {
    this.getCurrencySymbol()
  }

  getCurrencySymbol() {
    this.props.getCurrency('currency')
  }

  toggleModal = () => {
    this.setState(prevState => ({
      isModalVisible: !prevState.isModalVisible
    }))
  }

  async onPressCurrency(symbol) {
    await AsyncStorage.setItem('currency', symbol)
    this.getCurrencySymbol()
    this.setState({ isModalVisible: false })
  }

  renderItem = ({ item }) => {
    return (
      <Button
        style={{ height: 40, padding: 5 }}
        buttonTitle={`${item.name} (${item.symbol})`}
        onPress={() => {
          this.onPressCurrency(item.symbol);
        }}
      />
    )
  }

  render() {
    const { isModalVisible } = this.state
    return (
      <Setting
        toggleModal={this.toggleModal}
        isModalVisible={isModalVisible}
        renderItem={this.renderItem}
        currencySymbol={this.props.currencySymbol}
      />
    )
  }

}

function Setting({
  toggleModal,
  renderItem,
  isModalVisible,
  currencySymbol
}) {
  return (
    <View>
      <TopBar
        title="Setting"
      />
      <Button
        onPress={toggleModal}
        buttonTitle="Currency"
        subtitle="Set your currency"
        symbol={currencySymbol}
      />

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
      >
        <View style={{ height: 400, backgroundColor: '#fff', padding: 15 }}>
          {/* <Text>Currency List</Text> */}

          <View>
            <FlatList
              data={currency}
              renderItem={renderItem}
              keyExtractor={item => item.name}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default connect(state => ({ currencySymbol: state.currency.activeSymbol }), { getCurrency })(SettingContainer)