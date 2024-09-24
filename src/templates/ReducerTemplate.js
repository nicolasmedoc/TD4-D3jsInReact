function myDataReducer(myDataState, action){
    switch (action.type) {
        case 'updateAnObject': {
          return {...myDataState.myObject, keyToUpdate: action.valueToUpdate};
        }
        case 'updateAnArray': {
          return myDataState.myArray.map(itemData => {
            if (itemData.index === action.updatedItem.index) {
              return {...itemData, keyToUpdate: action.updatedItem.valueToUpdate};
            } else {
              return itemData;
            }
          });
        }
        default: {
          throw Error('Unknown action for myDataReducer: ' + action.type);
        }
      }
  
}
export default myDataReducer;