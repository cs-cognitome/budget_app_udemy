// IIFI allows us to get privacy 
// independent modules

// BUDGET CONTROLLER
var budgetController = (function() {
    var Expense = function(id, description, value) { 
        this.id = id; 
        this.description = description; 
        this.value = value; 
        this.percentage = -1; 
    };
    //calculates
    Expense.prototype.calcPercentage = function(totalIncome) { 
        if(totalIncome > 0) { 
            this.percentage = Math.round((this.value / totalIncome) * 100); 
        }else { 
            this.percentage = -1; 
        }
    }; 
    //gets
    Expense.prototype.getPercentage = function() { 
        return this.percentage; 
    }; 

    var Income = function(id, description, value) { 
        this.id = id; 
        this.description = description; 
        this.value = value; 
    }; 

    var calculateTotal = function(type) { 
        var sum = 0; 
        data.allItems[type].forEach(function(current) { 
            sum += current.value; 
        }); 
        data.totals[type] = sum; 
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
        }, 
        budget: 0, 
        percentage: -1
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

        deleteItem: function(type, id) { 
            var ids, index; 

            //map returns a new array
            ids = data.allItems[type].map(function(current){
                return current.id; 
            });  

            index = ids.indexOf(id); 

            //removing elements by their index
            if(index !== -1) { 
                data.allItems[type].splice(index, 1); 
            }
        }, 

        calculateBudget: function() { 
            // calculate total income and expenses 
            calculateTotal('exp'); 
            calculateTotal('inc'); 
            // calculate the budget: income - expenses 
            data.budget = data.totals.inc - data.totals.exp; 
            // calculate the percentage of income spent
            if(data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);  
            }else { 
                data.percentage = -1; 
            }
        },  

        calculatePercentages: function() { 
            /* 
            a = 20 
            b = 10 
            c = 40 
            income = 100

            a = 20/100 = 20% 
            b = 10/100 = 10% 
            c = 40/100 = 40% 
            */ 

            data.allItems.exp.forEach(function(cur){ 
                cur.calcPercentage(data.totals.inc); 
            }); 
        }, 

        getPercentages: function() { 
            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();
            }); 
            return allPerc; 
        }, 

        getBudget: function() { 
            return { 
                budget: data.budget, 
                totalInc: data.totals.inc, 
                totalExp: data.totals.exp, 
                percentage: data.percentage
            }; 
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
        expensesContainer: '.expenses__list', 
        budgetLabel: '.budget__value', 
        incomeLabel: '.budget__income--value', 
        expensesLabel: '.budget__expenses--value', 
        percentageLabel: '.budget__expenses--percentage', 
        container: '.container', 
        expensesPercLabel: '.item__percentage', 
        dateLabel: '.budget__title--month'
    }; 

    var formatNumber =  function(num, type) { 
        var numSplit, int, dec, type; 
        /**
         * '+' or '-' before number 
         * 2 decimal points 
         * comma separation 
         */ 

        num = Math.abs(num); 
        num = num.toFixed(2); 

        numSplit = num.split('.'); 

        int = numSplit[0]; 
        if(int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); // 3456 = 3, 456
        }
        dec = numSplit[1]; 

        return (type === 'exp' ? sign = '-' : sign = '+') +  ' ' + int + '.' + dec; 
    };

    return { 
        getInput: function() { 
            return { 
                type: document.querySelector(DOMstrings.inputType).value, // inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        }, 

        addListItem: function(obj, type) { 
            // create html string with placeholder text 
            var html, newHtml, element; 

            if(type === 'inc') {
                element = DOMstrings.incomeContainer; 

                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer; 

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }


            // replace the placeholder with actual text with id method
            newHtml = html.replace('%id%', obj.id); 
            newHtml = newHtml.replace('%description%', obj.description); 
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type)); 
       
            // insert the html in the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml); 

        },  

        deleteListItem: function(selectorID) {  
            var el = document.getElementById(selectorID); 
            el.parentNode.removeChild(el);
        },

        // clearing input fields 
        clearFields: function() { 
            var fields, fieldsArr; 
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue); 

            var fieldsArr = Array.prototype.slice.call(fields); 

            fieldsArr.forEach(function(current, index, array) {
                current.value = ""; 
            }); 
            // get focus back to the input fields 
            // to the first input field which is 'description'
            fieldsArr[0].focus(); 

        }, 

        displayBudget: function(obj) { 
            var type; 
            obj.budget > 0 ? type = 'inc' : type = 'exp'; 

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type); 
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc'); 
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp'); 
            
            if(obj.percentage > 0) { 
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%'; 
            }else { 
                document.querySelector(DOMstrings.percentageLabel).textContent = '---'; 
            }
        }, 

        displayPercentages: function(percentages) {
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel); 

            var nodeListForEach = function(list, callback) { 
                for(var i = 0; i < list.length; i++) {
                    callback(list[i], i);  
                }
            };

            nodeListForEach(fields, function(current, index){
                if(percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';   
                }else { 
                    current.textContent = '---'; 
                }
                
            }); 
        }, 

        displayMonth: function() { 
            var now, year, month; 

            now = new Date();  
            year = now.getFullYear(); 

            document.querySelector(DOMstrings.dateLabel).textContent = year; 
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

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);         
    }; 

    var updateBudget = function() {
        //1. calculate the budget 
        budgetCtrl.calculateBudget(); 
        //2. return the budget
        var budget = budgetCtrl.getBudget(); 
        //3. display the budget on the UI 
        UICtrl.displayBudget(budget); 
    }; 

    var updatePercentages = function() { 
        //1. calculate %
        budgetCtrl.calculatePercentages(); 
        //2. read percentages from budget controller 
        var percentages = budgetCtrl.getPercentages(); 
        //3. update the UI with the new percentages
        UICtrl.displayPercentages(percentages); 
    }; 

    var  ctrlAddItem = function() { 
        var input, newItem; 

        //1. get the filed input data 
        input = UICtrl.getInput();  

        // conditions when the empty fields are hit
        if(input.description !== "" && !isNaN(input.value) && input.value > 0) { 
            
            //2. add the item to the budget controller 
            newItem = budgetCtrl.addItem(input.type, input.description, input.value); 

            //3. add the item to the UI
            UICtrl.addListItem(newItem, input.type); 

            //4. clearing fields 
            UICtrl.clearFields(); 

            //5. calculate and update budget 
            updateBudget(); 

            //6. calculate & update % 
            updatePercentages(); 
        }
    }; 

    var ctrlDeleteItem = function(event) { 
        var itemID, splitID, type, ID; 
        // hardcoding
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id; 

        if(itemID) { 
            // inc-1
            splitID = itemID.split('-'); 
            type = splitID[0]; 
            //converting string to an integer
            ID = parseInt(splitID[1]); 

            //1. delete the item from the data structure 
            budgetCtrl.deleteItem(type, ID); 
            //2. delete the item from the UI 
            UICtrl.deleteListItem(itemID); 
            //3. update and show a new budged 
            updateBudget(); 
            //4. calculate & update % 
            updatePercentages(); 
        }
    }; 

    return { 
        init: function() { 
            console.log("App started."); 

            UICtrl.displayMonth(); 

            //when we reload everything will set to '0'
            UICtrl.displayBudget( {
                budget: 0, 
                totalInc: 0, 
                totalExp: 0, 
                percentage: -1
            }); 
            setupEventListeners(); 
        }
    };


})(budgetController, UIController); 

controller.init(); 