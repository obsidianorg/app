import { createSelector } from 'reselect'

export const blockHeightPercentSelector = createSelector(
  [
    state => state.blockHeight.current,
    state => state.blockHeight.top
  ],
  (current, top) => (current / top) * 100
)
