app.service('dateService', ["$log", '$timeout', "expenseApi", function ($log, $timeout, expenseApi) {
    class DateService{
        constructor(){

        }
        
        test(){
            console.log("O HERY I AMMMMM")
        }


    }

    return new DateService();
}]);
