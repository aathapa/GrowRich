import { GET_CURRENCY } from '../actionType'

const initialState = {
  activeSymbol: ''
}


export default (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_CURRENCY:
      return {
        ...state,
        activeSymbol: payload
      }
    default:
      return state
  }
}