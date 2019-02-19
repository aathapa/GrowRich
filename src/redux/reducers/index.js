import { combineReducers } from 'redux'

import currency from './currency.reducer'
import transaction from './Transaction.reducer'

export default combineReducers({
  currency,
  transaction
})