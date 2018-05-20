import { filter } from 'lodash';

export function takenThePledge(record) {
  return record.pledged ? ' has taken the pledge.' : ' has not taken the pledge.';
}

export const totalPledgedInState = itemsInState => Object.keys(itemsInState)
  .reduce((acc, cur) => {
    acc += filter(itemsInState[cur], 'pledged').length;
    return acc;
  }, 0);

export const totalPledgedInCategory = (items, category) => filter(items[category], 'pledged').length;

export const totalPledgedInDistricts = itemsInState => Object.keys(itemsInState)
  .reduce((acc, cur) => {
    if (Number(cur)) {
      acc += filter(itemsInState[cur], 'pledged').length;
    }
    return acc;
  }, 0);
