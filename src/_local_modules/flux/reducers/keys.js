
export default function keysReducer (state = [], action) {
  switch (action.type) {
    case 'KEYS_LOAD':
      return action.payload
    default:
      return state
  }
}
