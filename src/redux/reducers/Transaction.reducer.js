import { EDIT_TRANSACTION } from '../actionType'

const initialState = {
  selectedItemData: {}
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case EDIT_TRANSACTION: 
      return {
        ...state,
        selectedItemData: payload
      }
    default: 
      return state
  }
}

