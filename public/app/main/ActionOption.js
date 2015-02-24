var blackjack = angular.module('blackjackApp', ['ngResource', 'ngRoute', 'ngStorage']);
angular.module('blackjackApp').factory('Card', function () {
        var Cards = {};
        Cards.names = [2,3,4,5,6,7,8,9,'T','J','Q','K','A'];
        Cards.shap  = ['h', 'd', 'c', 's'];

        return  Cards;

    }
);



angular.module('blackjackApp').factory('ActionOption',['Card', function (Card) {
        Card;
    return {
        getCard : function  () {
        var cardTaken = {};
        cardTaken.name = Card.names[ Math.floor(Math.random() * Card.names.length )] ;
        cardTaken.shap = Card.shap[ Math.floor(Math.random() * Card.shap.length )];
        cardTaken.imgLink = '_' + cardTaken.name + cardTaken.shap +  '.png' ;
        return cardTaken;
        }
    };
}]);
