var blackjack = angular.module('blackjackApp', ['ngResource', 'ngRoute', 'ngStorage']);
blackjack.factory('Card', function () {
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



blackjack.factory('blackjackRules', function () {
    return{
     getHandScore : function(cards) {
          function getCardValue (name) {
            if (name != 'A') {
                return 10;
            } else{
                return 11;
            }
        }
        var score = 0;
        var aces = 0;
        angular.forEach(cards, function  (card) {
            if (card.name == parseInt(card.name, 10)) {
                score += parseInt(card.name, 10)
            } else {
                var value = getCardValue(card.name);
                if (value == 11) {
                    aces += 1;
                }
                score += value;
            }
        });
       while ((score > 21) && aces > 0) {
                score -= 10;
                aces -= 1;
        }
     return score;
    }
  };
});

blackjack.factory('blackjackOptions', [function () {
        return  {
            busted : function (score) {
                if (score > 21) {
                    return true;
                } else return false;
            },
            canSplit : function(cards) {
                if (cards.length == 2) {
                    if (cards[0].name == cards[1].name) {
                        return true;
                    }
                } else return false;
            },
            isItBlackjack : function (cards) {
                if (cards.length == 2) {
                    if (cards[0].name == 'A' || cards[1].name == 'A') {
                         if (cards[0].name in ['T','J','Q','K'] || cards[0].name in ['T','J','Q','K']  ) {
                            return true;
                        }
                    }
                } else return false;
            },
            canDouble : function(cards) {
                return cards.length == 2;
            }
        };
}]);

blackjack.config(function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider.when('/', { templateUrl: '/', controller: 'MainCtrl'});
});
