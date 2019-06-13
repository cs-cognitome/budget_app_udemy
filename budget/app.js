// IIFI allows us to get privacy 
// independent modules

// BUDGET CONTROLLER
var budgetController = (function() {
    var Expense = function(id, description, value) { 
        this.id = id; 
        this.description = description; 
        this.value = value; 
    };

    var Income = function(id, description, value) { 
        this.id = id; 
        this.description = description; 
        this.value = value; 
    }; 

    // object (ready to receive data)
    var data = {
        allItems:  {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };

    return  {
        addItem: function(type, des, val) {
            var newItem; 
            var ID; 
            // unique number for each item 
            // ID = last ID + 1
            // new ID
            // if array is empty, the ID === 0
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            } 
        
             
            // create a new item whether it's 'inc' or 'exp' type
            if(type === 'exp') {
                newItem = new Expense(ID, des, val); 
            }else if(type === 'inc') { 
                newItem = new Income(ID, des, val); 
            }

            // push it into data structure
            data.allItems[type].push(newItem); 
            // return the new element
            return newItem; 
        }, 
        testing: function() { 
            console.log(data); 
        }
    }; 

})(); 


// UI CONTROLLER
var UIController = (function(){ 

    // get all values together
    var DOMstrings = { 
        inputType: '.add__type', 
        inputDescription: '.add__description', 
        inputValue: '.add__value', 
        inputBtn: '.add__btn', 
        incomeContainer: '.income__list', 
        expensesContainer: '.expenses__list'
    }

    return { 
        getInput: function() { 
            return { 
                type: document.querySelector(DOMstrings.inputType).value, // inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
        }, 

        addListItem: function(obj, type) { 
            // create html string with placeholder text 
            var html, newHtml, element; 

            if(type === 'inc') {
                element = DOMstrings.incomeContainer; 

                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer; 

                html = '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }


            // replace the placeholder with actual text with id method
            newHtml = html.replace('%id%', obj.id); 
            newHtml = newHtml.replace('%description%', obj.desctiption); 
            newHtml = newHtml.replace('%value%', obj.value); 
       
            // insert the html in the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml); 
        },

        getDOMstrings: function() { 
            return DOMstrings; 
        }
    };

})(); 

// this controller knows about two other modules
// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){ 

    var setupEventListeners = function() { 
        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event) {
            if(event.keyCode === 13 || event.which === 13) { 
                    ctrlAddItem(); 
            }
        }); 
    }; 

  

    var ctrlAddItem = function() { 
        var input, newItem; 

        //1. get the filed input data 
        input = UICtrl.getInput();  

        //2. add the item to the budget controller 
        newItem = budgetCtrl.addItem(input.type, input.description, input.value); 

        //3. add the item to the UI

        //4. calculate the budget 

        //5. display the budget on the UI 

    };

    return { 
        init: function() { 
            console.log("App started."); 
            setupEventListeners(); 
        }
    };


})(budgetController, UIController); 

controller.init(); 