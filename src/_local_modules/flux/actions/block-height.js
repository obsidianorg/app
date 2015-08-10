export function updateCurrent (current) {
  return { type: 'BLOCK_HEIGHT-UPDATE_CURRENT', payload: current }
}

export function updateTop (top) {
  return { type: 'BLOCK_HEIGHT-UPDATE_TOP', payload: top }
}
