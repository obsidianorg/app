
const initialState = { current: 0, top: 0 }

export default function blockHeightReducer (state = initialState, action) {
  switch (action.type) {
    case 'BLOCK_HEIGHT-UPDATE_CURRENT':
      return {
        ...state,
        current: action.payload
      }
    case 'BLOCK_HEIGHT-UPDATE_TOP':
      return {
        ...state,
        top: action.payload
      }
    default:
      return state
  }
}
