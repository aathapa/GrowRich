import React, { Component } from 'react';
import {
  View,
  Text,
  Image
} from 'react-native';

import { openDatabase } from 'react-native-sqlite-storage'
import uuid from 'uuid'
import { goToAuth } from 'navigator/routes'
import { Images } from '../../globalData'
import { categories } from 'helper/data'
import {
  createTransactionTable,
  createCategoryTable,
  insertDataInCategory
} from '../../database'

const db = openDatabase({ name: 'Expense.db' })

export default class SplashContainer extends Component {

  componentDidMount() {
    // db.transaction(txn => {
    //   txn.executeSql(`DROP TABLE Transactions`)
    // })
    setTimeout(() => {
      createTransactionTable(db)
      createCategoryTable(db)
      categories.map(async({ category, type }) => {
        await insertDataInCategory(db, vars = [uuid(), category, type, true])
      })
      goToAuth()
    }, 500);
  };


  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'blue', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'yellow' }}> Splash Container </Text>
        <Image
          source={Images.Cafe}
          style={{ height: 40, width: 40 }}
        />
      </View>
    );
  }
}