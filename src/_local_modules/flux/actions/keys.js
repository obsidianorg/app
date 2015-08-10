import * as keydb from '#keydb'

export function load () {
  return (dispatch, getState) => {
    let keys = keydb.loadAllSync()
    dispatch({
      type: 'KEYS_LOAD',
      payload: keys
    })
  }
}
