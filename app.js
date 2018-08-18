var budgetController = (function(){
    // create data structure to store the number
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    Expense.prototype.calcPercentage = function(totalIncome){
        if (totalIncome>0){
            this.percentage = Math.round((this.value/totalIncome)*100);
        } else {
            this.percentage = -1;
        }
        
    };
    Expense.prototype.getPercentage = function(){
        return this.percentage;
    };
    var calculateTotal = function(type) { 
        var sum = 0;
        data.allItems[type].forEach(function(cur){
            sum += cur.value;
            
        });
        data.totals[type] = sum;
        
    };
    
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var data = {
        allItems:{
            expense: [],
            income: []
            
        },
        totals:{
            expense:0,
            income:0
        },
        budget:0,
        percentage: -1
    };
    return {
        addItem: function(type, des, val){
            var newItem, ID;
            console.log(data.allItems[type]);
            if (data.allItems[type].length > 0){
                  ID = data.allItems[type][data.allItems[type].length-1].id+1;
            } else {
                ID = 0;
            }
          
            if (type === 'expense'){
                newItem = new Expense(ID, des, val);
                
            } else if (type === 'income'){
                newItem = new Income(ID, des, val);
            }
                
            
            data.allItems[type].push(newItem);
            return newItem;
            
        },
        deleteItem: function(type, id){
            var ids, index;
            ids = data.allItems[type].map(function(current){
               return current.id; 
            });
            index = ids.indexOf(id);
            if (index !== -1){
                data.allItems[type].splice(index,1);
            }
        },
        calculateBudget: function(){
            //1. calculate total income and expense
            calculateTotal('expense');
            calculateTotal('income');
            //2. calculate income minus expense
            data.budget = data.totals.income - data.totals.expense;
            //3. calculate percentage of icome that we spend
            if (data.totals.income >0){
                 data.percentage = Math.round((data.totals.expense/data.totals.income)*100);
            } else{
                data.percentage = -1;
            }
        },
        calculatePercentages: function(){
            data.allItems.expense.forEach(function(cur){
                cur.calcPercentage(data.totals.income);
            });
        },
        getPercentages: function(){
            var allPerc = data.allItems.expense.map(function(cur){
                return cur.getPercentage();
            });
            return allPerc; 
        },
           
        getBudget:function(){
            return {
                budget: data.budget,
                totalIncome: data.totals.income,
                totalExpenses: data.totals.expense,
                percentage: data.percentage
            };
        },
        testing:function(){
            console.log(data);
        }
    };
    
        
    
    
    
})();

var UIController = (function(){
    //code to get input 
    var DOMStrings = {
        inputType:'.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };
    return {
        
            getInput: function(){
                
            return{
                type: document.querySelector(DOMStrings.inputType).value,// will be either inc or exp
             description: document.querySelector(DOMStrings.inputDescription).value,
             value : parseFloat(document.querySelector(DOMStrings.inputValue).value)
            }
            },
            addListItem: function(obj, type){
                //create html string with place holder text
                var html, newHtml, element;
                // replace placeholder text with actual data
                
                // insert html into the dom
                if (type ==='income'){
                    
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div> </div>';
                } else if (type === 'expense'){
                    element = DOMStrings.expenseContainer;
                
                    html ='<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div></div></div>';
                }
                newHtml = html.replace('%id%', obj.id);
                newHtml = newHtml.replace('%value%', obj.value);
                
                newHtml = newHtml.replace('%description%', obj.description);
                document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
                console.log(newHtml);
            },
            deleteItem: function(selectorID){
                var el = document.getElementById(selectorID);
                el.parentNode.removeChild(el);
                
            },
            clearFields: function(){
                var fields, fieldsArr;
                fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);
               
                var fieldsArr =Array.prototype.slice.call(fields);
                fieldsArr.forEach(function(current, index, array){
                    current.value = "";
                    
                    
                });
            },
            displayBudget: function(obj){
                document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
                 document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalIncome;
                 document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExpenses;
                 if (obj.percentage > 0) {
                     document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
                 } else {
                     document.querySelector(DOMStrings.percentageLabel).textContent = '---';
                 }
                
                
            },
            displayPercentages:function(percentages){
                var fields;
                fields = document.querySelectorAll(DOMStrings.expensesPercLabel);
                var nodeListForEach = function(list, callback){
                    for (var i =0;i<list.length;i++){
                        callback(list[i], i);
                    }
                };
                
                nodeListForEach(fields, function(current, index){
                    if (percentages[index]> 0){
                        current.textContent = percentages[index] + '%';
                    } else{
                         current.textContent = '---';
                    }
                    
                    
                });
            },
            displayDate: function(){
                var now, year, month;
                now = new Date();
                year = now.getFullYear();
                month = now.getMonth();
                document.querySelector(DOMStrings.dateLabel).textContent = month + ' ' + year;
                
            },
            getDOMstrings: function(){
                return DOMStrings;
            }
        };   
        
    
})();

var controller = (function(budgetCtrl, UICtrl){
    var setupEventListeners = function(){
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
     
        document.addEventListener('keypress', function(event){
            if (event.KeyCode === 13|| event.which === 13){
                ctrlAddItem();
        }
 
    });
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };
    
    var updateBudget = function(){
        //1. calculate budget
        budgetCtrl.calculateBudget();
        //2, return the budget
        var budget = budgetCtrl.getBudget();
        //3. display budget on UI
        UICtrl.displayBudget(budget);
    }
    var updatePercentages = function(){
        //1. calculate percentage
        budgetCtrl.calculatePercentages();
        //2. read percentage from budget ctrl
        var percentages = budgetCtrl.getPercentages();
        console.log(percentages);
        //3.update ui with new percentage
        UICtrl.displayPercentages(percentages);
    };
    var ctrlAddItem = function (){
           //1. get input data
        
        var input = UICtrl.getInput();
        
        if (input.description!== "" && !isNaN(input.value)){
            
        
        // 2. add data to budget controller
        var newItem= budgetCtrl.addItem(input.type, input.description, input.value);
        //3.add item to UI
        UICtrl.addListItem(newItem, input.type);
       
        UICtrl.clearFields();
        //4. calculate budget
        updateBudget();
        updatePercentages();
        }
        //5. display budget
    };
    var ctrlDeleteItem = function(event){
        var type, splitID, ID, itemID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            budgetCtrl.deleteItem(type, ID);
            UICtrl.deleteItem(itemID);
            updateBudget();
            updatePercentages();
            //1.delete item from data structure
            //2.delete item from ui
            //3. update UI
        }
    };
    return {
        init:function(){
            setupEventListeners();
            UICtrl.displayDate();
            UICtrl.displayBudget({budget: 0,
                totalIncome: 0,
                totalExpenses: 0,
                percentage: -1});
           
        }
    };
  
})(budgetController, UIController);

controller.init();