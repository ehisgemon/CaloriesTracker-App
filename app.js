//storage controller
const StorageCtrl = (function(){

    //public Methods
    return{
        storeItem: function(item){
          let items;
          if(localStorage.getItem('items') === null){
            //Define items
            items = [];
            //push item
            items.push(item);
            //set local
            localStorage.setItem('items', JSON.stringify(items));
          }else{
            items = JSON.parse(localStorage.getItem('items'));
            //push item
            items.push(item);
            //re set local storage
            localStorage.setItem('items', JSON.stringify(items));
          }

        },
        getStoredItems: function(){
          let items;
          if(localStorage.getItem('items') === null){
            items = [];
          }else {
            items = JSON.parse(localStorage.getItem('items'));
          }
          return items;
        },
        updateStorage: function(newItem){
          let items = JSON.parse(localStorage.getItem('items'));
            //loop thru
            items.forEach(function(item, index){
                if(item.id === newItem.id){
                  items.splice(index, 1, newItem);
                }
            });

          //re set local Storage
          localStorage.setItem('items', JSON.stringify(items));            
        },
        deleteStorageItem: function(itemId){
          let items = JSON.parse(localStorage.getItem('items'));
          //loop thru
          items.forEach(function(item, index){
              if(item.id === itemId){
                items.splice(index, 1);
              }
          });

        //re set local Storage
        localStorage.setItem('items', JSON.stringify(items));  
        },
        clearStorage: function(){
          localStorage.removeItem('items');
        }
   }
})();

//Item controller
const ItemCtrl = (function(StorageCtrl){
    //item constructor
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    //item Data Structure
    const data = {
        // items:[
        //     // {id: 0, name: 'Ice cream', calories: 1200},
        //     // {id: 1, name: 'Dinner Steak', calories: 900},
        //     // {id: 2, name: 'Pepsi flavor', calories: 600}
        // ],
        items: StorageCtrl.getStoredItems(),
        currentItem: null,
        totalCalories: 0
    }

    //public methods
    return {
        logData: function(){
            return data;
        },
        getItems: function(){
            return data.items;
        },
        getInputValues: function(){
          const name = document.querySelector('#item-name').value;
          const calories = document.querySelector('#item-calories').value;

          return{
            name,
            calories
          }
        },
        addItem: function(name, calories){
            //create ID
            let ID;
            if(data.items.length > 0){
                ID = data.items[data.items.length -1].id + 1;
            }else {
                ID = 0
            }
            
            //Turn calories to number
            calories = parseInt(calories);

            //create newItem
            const newItem = new Item(ID, name, calories);

            //Push newItem
            data.items.push(newItem);

            //Return
            return newItem;
        },
        updateItem: function(name, calories){
          //parse calories to number
          calories = parseInt(calories);

          let found = null;

          //loop thru Ds
          data.items.forEach(function(item){
            //check for same ID
            if(item.id === data.currentItem.id){
              item.name = name;
              item.calories = calories;
              found = item;
            }
          });

          return found;

        },
        getItemById: function(id){
            let found = null;
            data.items.forEach(function(item){
              if(item.id === id){
                found = item;
              }
            });
            return found;
        },
        setCurrentItem: function(currentItem){
            data.currentItem = currentItem;
        },
        getCurrentItem: function(){
           return data.currentItem;
        },
        getTotalCalories: function(){
            let totalCalories = 0;

            data.items.forEach(function(item){
                totalCalories += item.calories;
            });

            data.totalCalories = totalCalories;

            return totalCalories;
        },
        deleteItem: function(id){
          //loop thru data items
          const ids = data.items.map(function(item){
            return item.id;
          });

          //Get index
          const index = ids.indexOf(id);

          //delete actual item
          data.items.splice(index, 1);
        },
        clearItems: function(){
          data.items = [];
        }
    }
})(StorageCtrl);
//UI controller
const UICtrl = (function(StorageCtrl){
    //UI Selectors
    const UISelectors = {
        clearBtn: '.clear-btn',
        itemList: '#item-list',
        listItems: '.collection-item',
        addBtn: '.add-btn',
        itemCalories: '#item-calories',
        itemName: '#item-name',
        backBtn: '.back-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn'
    }


    //public methods
    return {
      getUISelectors: function(){
        return UISelectors;
      },
      getInputValues: function(){
         const name = document.querySelector(UISelectors.itemName).value,
               calories = document.querySelector(UISelectors.itemCalories).value;
        return{
          name,
          calories
        }
      },
      populateItems: function(items){
        let listItems = '';
        //Loop thru items
        items.forEach(function(item){
           listItems +=  `
           <li class="collection-item" id="item-${item.id}">
           <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
           <a href="#" class="secondary-content">
             <i class="edit-item fa fa-pencil"></i>
           </a>
         </li>
           `;
        });
        document.querySelector(UISelectors.itemList).innerHTML = listItems;
      },
      addItemList: function(item){
        //Show hidden line
        document.querySelector(UISelectors.itemList).style.display = 'block';
        //create li
        const li = document.createElement('li');
        //add class
        li.className =  `collection-item`;
        //add ID
        li.id = `item-${item.id}`;
        //add innnerHTML
        li.innerHTML = `
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
        `;

        //Insert
        document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);

      },
      addTotalCalories: function(totalCalories){
        document.querySelector('#total-calories').textContent = totalCalories;
      },
      addItemTOInputField: function(item){
        document.querySelector('#item-name').value = `${item.name}`;
        document.querySelector('#item-calories').value = `${item.calories}`;
        // show Edit State
        UICtrl.showEditState();
      },
      updateListItem: function(item){
         let listItems = document.querySelectorAll(UISelectors.listItems);

         //convert listItems to Array
         listItems = Array.from(listItems);

         listItems.forEach(function(listItem){
            const itemId = listItem.getAttribute('id');

            if(itemId === `item-${item.id}`){
              document.querySelector(`#${itemId}`).innerHTML = `
              <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
              <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
              </a>
              `;
            }
         });
      },
      hideList: function(){
        document.querySelector(UISelectors.itemList).style.display = 'none';
      },
      showEditState: function(){
        document.querySelector(UISelectors.updateBtn).style.display = 'inline';
        document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
        document.querySelector(UISelectors.backBtn).style.display = 'inline';
        document.querySelector(UISelectors.addBtn).style.display = 'none';
      },
      hideEditState: function(){
        UICtrl.clearIput();
        document.querySelector(UISelectors.updateBtn).style.display = 'none';
        document.querySelector(UISelectors.deleteBtn).style.display = 'none';
        document.querySelector(UISelectors.backBtn).style.display = 'none';
        document.querySelector(UISelectors.addBtn).style.display = 'inline';
      },
      deleteListItem: function(id){
        const itemId = `#item-${id}`;
        const item = document.querySelector(itemId);
        item.remove();
      },
      clearListItems: function(){
        let listItems = document.querySelectorAll(UISelectors.listItems);

        listItems.forEach(function(listItem){
          listItem.remove();
        })
      },
      clearIput: function(){
        document.querySelector('#item-name').value = '';
        document.querySelector('#item-calories').value = '';
      }
    }
})(StorageCtrl);
//App Activation
const App = (function(ItemCtrl, UICtrl, StorageCtrl){

    //Load All Events
    const loadEventListeners = function(){
        //Get UiSelectors
        const UISelectors = UICtrl.getUISelectors();

        // Add itemsubmitBtn
        document.querySelector(UISelectors.addBtn).addEventListener('click', addItemSubmit);

        //Prevent the Default Enter key
        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.which === 13){
                e.preventDefault();
                return false;
            }
        });

        //Item EditClick
        document.addEventListener('click', itemEditClick);

        //updateItemBtn
        document.querySelector(UISelectors.updateBtn).addEventListener('click', updateitemSubmit);

        //delete item sunmit
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', deleteItemSubmit);

        //back submit Btn
        document.querySelector(UISelectors.backBtn).addEventListener('click', backSubmitBtn);

        //Clear All items
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItems);
        

    }

    //AddItemSubmit
    const addItemSubmit = function(e){
        const input = ItemCtrl.getInputValues();

        //check inputfield
        if(input.name !== '' && input.calories !== ''){
            //add item to DS
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            //add to UI
            UICtrl.addItemList(newItem);

            //Get totalCalories
            const totalCalories = ItemCtrl.getTotalCalories();

            //add totalCalories to UI
            UICtrl.addTotalCalories(totalCalories);

            // Store newItem to LS
            StorageCtrl.storeItem(newItem);

            //clear input
            UICtrl.clearIput();
        }

        e.preventDefault();
    }

    //itemEditClick
    const itemEditClick = function(e){
      //check li className
      if(e.target.classList.contains('edit-item')){
        //Get listId
        const listId = e.target.parentNode.parentNode.id;
        
        //split id by '-'
        const listIdArr = listId.split('-');

        // Extract actual Id from Arr
        const id = parseInt(listIdArr[1]); 
        
        //Get item to Edit
        const itemToEdit = ItemCtrl.getItemById(id);

        //Set currentItem
        ItemCtrl.setCurrentItem(itemToEdit);

        //move currItem to inputfield
        UICtrl.addItemTOInputField(itemToEdit);

      }
      
    }

    //updateitemSubmit
    const updateitemSubmit = function(e){
       //Get input Values
       const input = UICtrl.getInputValues();

       //update inputed item (DS)
       const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

       //update inputed item (UI)
       UICtrl.updateListItem(updatedItem);

       //Get totalCalories
       const totalCalories = ItemCtrl.getTotalCalories();

       //add totalCalories to UI
       UICtrl.addTotalCalories(totalCalories);

       //update Local storage
       StorageCtrl.updateStorage(updatedItem);

       //Clear Edit state
       UICtrl.hideEditState();

      e.preventDefault();
    }

    //deleteItemSubmit
    const deleteItemSubmit = function(e){

      //Get currentItem
      const currentItem = ItemCtrl.getCurrentItem();

      //Delete from DS
      ItemCtrl.deleteItem(currentItem.id);

      //Get totalCalories
      const totalCalories = ItemCtrl.getTotalCalories();

      //add totalCalories to UI
      UICtrl.addTotalCalories(totalCalories);      

      //Delete ftom UI
      UICtrl.deleteListItem(currentItem.id);

      //Delete from Lacal Storage
      StorageCtrl.deleteStorageItem(currentItem.id);

      //clear Edit State
      UICtrl.hideEditState();

      e.preventDefault();
    }

    //Back submit Btn
    const backSubmitBtn = function(e){
        //clear Edit State
        UICtrl.hideEditState();

      e.preventDefault();
    }

    const clearAllItems = function(e){
        //clear All from DS
        ItemCtrl.clearItems();

        // clear items from UI
        UICtrl.clearListItems();

        //Get totalCalories
        const totalCalories = ItemCtrl.getTotalCalories();

        //add totalCalories to UI
        UICtrl.addTotalCalories(totalCalories);     

        //clear Local Storage
        StorageCtrl.clearStorage();
        
        // hide list
        UICtrl.hideList();

        //clearInput field
        UICtrl.clearIput();


      e.preventDefault();
    }

    //public Methods
    return {
        init: function(){
            //Hide EditState
            UICtrl.hideEditState();

            //Get Item
            const items = ItemCtrl.getItems();

            if(items.length === 0){
                UICtrl.hideList();
            }else{
                UICtrl.populateItems(items);
            }

            //load All Events
            loadEventListeners();

        }
    }
})(ItemCtrl, UICtrl, StorageCtrl);

// Initialize App
App.init();