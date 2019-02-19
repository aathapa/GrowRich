import { EDIT_TRANSACTION } from '../actionType'


export const editTransaction = (data) => dispatch => {
  dispatch({
    type: EDIT_TRANSACTION,
    payload: data
  })
}