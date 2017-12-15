var myApp = angular.module('myApp', ['ngMessages','ngRoute','ngResource']); //An array of dependencies --2nd parameter , myApp module is dependent on ngMessages dependencies // "myApp" says What part of the view is going to be controlled by the app. angularJS looks for this 'myApp ' module name in DOM connects 
//The `ngResource` module provides interaction support with RESTful services* via the $resource service
//declare a controller
myApp.config(function($routeProvider, $locationProvider){
    //console.log($location);
    //$locationProvider.html5Mode(true).hashPrefix('');
    $routeProvider
    .when('/first',{
          templateUrl:'pages/main.html', //tying this template to mainController
          controller:'mainController'
          })
    .when('/second/:num',{                 //Passing temporary values to url
        templateUrl:'pages/second.html',
        controller:'secondController'
    })
   .when('/second',{                 //when no params passed, then also it connects to same template and same controller
        templateUrl:'pages/second.html',
        controller:'secondController'
    })
});

myApp.service('nameService',function(){
    var self = this;
    this.name = 'John Doe';
    this.namelength = function(){
        return self.name.length;
    }
})
myApp.controller("mainController", function ($scope, $log, $filter, $resource, $timeout,$location,nameService) { //$resource service is provided by ngResource module
    console.log(window.location.hash);
    /*$log.log("Hello.");
    $log.info("This is some information");
    $log.warn("Warning!");
    $log.debug("Some Debug information while writing my code.");
    $log.error("Error in the code.");*/
   $scope.people = [{
        name:"Shoeb",
        address: "Sneh Vihar",
       city:'Indore',
       state:'M.P',
       zip:'1111'
    },
                   {
        name:"Moiz",
        address: "Sneh Vihar",
       city:'Delhi',
       state:'M.P',
       zip:'1111'
    },
                    {
        name:"Yusuf",
        address: "Sneh Vihar",
       city:'Ujjain',
       state:'M.P',
       zip:'1111'
    }]
    $scope.formattedAddress = function(person){
        return person.address+','+person.city+','+person.state+' '+person.zip
    }
    console.log("Inside Main controller "+nameService.name+" "+nameService.namelength());
    $scope.TextBoxname = nameService.name;   
    // When we change TexBox name in main page its not reflected on second and also when we go back on main, value is disappeared. This is because $scope.name changed but not nameService.name. Therefore we need to check when $scope.name changes we also change nameService.name. Digest loop doesn't do this its the scope which digest loop checks for here nothing that wraps up and looks at where scope came from.In order to do this we need to add a watch.
    
    $scope.$watch('TextBoxname', function(){
        nameService.name = $scope.TextBoxname;
    });
    
    $scope.occupation = 'Coder';
    $scope.getName = function() {
        return 'Mike';
    }
    $scope.name = "maryam dairkee"
    $scope.formattedname = $filter('uppercase')($scope.name);
    //$log.info($scope.name);
    //$log.info($resource);
    //$log.info($scope.formattedname);
    
    $scope.handle = "";
    $scope.lowercasehandle = function(handle){
        return $scope.handle = $filter('lowercase')(handle);
    }
    $scope.$watch('handle', function(newValue, oldValue){
        console.log($scope)
        /*console.warn("Changed");
        console.info('Old:'+oldValue);
        console.log('New:'+newValue);*/
    });
    
    setTimeout(function(){
        $scope.$apply(function(){
            $scope.handle = "maryam";
        $log.log("ScopeChanged");
       })
    },3000);
    $timeout(function(){
        $scope.name = "Everybody"; // changes $scope.name after 3 seconds in the view
    },3000)
});
/*var things = [1,2,function(){ alert("hello")}] // An array in Javascript can have any type of variables number, string or even functions
    things[2]();*/
/*myApp.controller("mainController", ["$scope", "$log", function ($scope, $log) {
    
    $log.log($scope);
    
}]);*/
//myApp.controller("mainController",["$scope","$log",function(o,l){l.log(o)}]);

//var searchPeople = function(firstName, height, age, occupation) {
//}

//$scope object is unique to a controller
myApp.controller("secondController",["$scope","$log","$http","$routeParams","nameService",function(o,l,$http,$routeParams,nameService){
    l.log("Inside Second controller "+nameService.name+" "+nameService.namelength());
    o.handle = "test";
    o.characters = 5;
    o.rules = [
        {rulename:"Must be 5 characters"},
        {rulename:"Must not be used elsewhere"},
        {rulename:"Must be cool"},
    ]
    l.log(o.rules);
    o.alertClick = function(){
        alert("clicked");
    }
    o.num = $routeParams.num || 1;   // when route without num is passed then we set default value to 1
    o.TextBoxname = nameService.name;
    o.$watch('TextBoxname', function(){
        nameService.name = o.TextBoxname;
    });
    o.$watch('handle', function(newValue, oldValue){
        console.log(o);
    });
    $http({
        method: 'GET',
        url: 'https://maps.googleapis.com/maps/api/geocode/json?address=20%20sneh%20vihar%20indore'
    }).then(function successCallback(response) {
            o.result = response;
            console.log(o.result.data);
    }, function errorCallback(response) {
        console.log(response);
    }).catch(function(e){
        console.log(e);
    });
}]);  // controller function is executed only when controller is referred inside html
var searchPeople = function(firstName, height, age, occupation) {
}
//searchPeople(1,2,3,4)
//console.log(angular.injector().annotate(searchPeople)); //["firstName", "height", "age", "occupation"]

myApp.directive("searchResult", function(){
    return {
        restrict:"AECM",
        //template:'<a href="#" class="list-group-item"><h4 class="list-group-item-heading">{{TextBoxname}}</h4><p class="list-group-item-text">{{handle}}</p></a>',
        templateUrl:'Directives/search-result.html',
        replace:true, //replace:false doesn't work with directive comment,
        scope:{
            //personName : "@",   //It says that it is expecing a text type 
           // PersonID: "@personHandle"  // Another way of expressing
            personObject: "=",
            formattedAddressFunction:"&"
        },
        transclude:true,
        link: function(scope,elems,attrs){
                    console.log('Post-linking');
                    console.log(elems.html());
                    console.log(attrs);
                }
       /*compile:function(elem,attrs){
            console.log("compiling");
            //console.log(elem);
            return {
                pre: function(scope,elems,attrs){
                    console.log('Pre-linking');
                    console.log(elems.html());
                },
                post: function(scope,elems,attrs){
                    console.log('Post-linking');
                    console.log(elems.html());
                    console.log(attrs);
                }
            }
        }*/
    }
})