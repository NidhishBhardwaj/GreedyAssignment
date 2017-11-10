var greedy_app = angular.module('greedyApp',['ngMaterial','ngAnimate','ngMessages','tc.chartjs']);
greedy_app.config(function($mdDateLocaleProvider) {
    $mdDateLocaleProvider.formatDate = function(date) {
       return moment(date).format('YYYY-MM-DD');
    };
});