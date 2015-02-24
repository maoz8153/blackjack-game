blackjack.controller('MainCtrl', function($scope, Card, blackjackRules, $timeout, $localStorage, $sessionStorage,ActionOption) {
  $scope.round = 0;
  $scope.player = {
                            name : "",
                            bet : 10,
                            bank : 100
                          };
  $scope.handForPlay = {
    cards : [],
    score : 0,
    bet : 10,
    ceaseAction : false,
    splitIOn : false
  };
  $scope.playerHands = [];
  var put = $scope.playerHands.push($scope.handForPlay);
  $localStorage.bank = $scope.player.bank;
  $localStorage.playerName = $scope.player.name;
  $scope.setName = false;
  $scope.splitDeck =[];
  $scope.$storage = $localStorage;
  $scope.playerHands[0].score = 0;
  $scope.dealerScore = 0;
  $scope.ceaseAction = false;
  $scope.dealerDraw = [];
  $scope.gameStarted = false;
  $scope.isBusted = false;
  $scope.isCanSplit = false;
  $scope.isBlackjack = false;
  $scope.splitInAction = false;
  $scope.splitCounter = 0 ;
  $scope.startGame = function  () {
      $scope.ceaseAction = false;
      $scope.ceaseActionSplit = false;
      $scope.setName = true;
      $scope.gameStarted = true;
      $localStorage.playerName = $scope.player.name;
      $scope.gameStarted = true;
      var bet = $scope.player.bet;
      $scope.playerHands[0].bet = bet;
      $scope.playerHands[0].cards.push(ActionOption.getCard());
      $scope.playerHands[0].cards.push(ActionOption.getCard());
      $scope.dealerDraw.push(ActionOption.getCard());
      var backCard = {
            name : "0",
            shap : "backCard",
            imgLink : 'card_back.png'
      };
      $scope.dealerDraw.push(backCard);
      $scope.dealerScore = blackjackRules.getHandScore($scope.dealerDraw);
      var score = blackjackRules.getHandScore($scope.playerHands[0].cards);
      $scope.playerHands[0].score =  score;

      $scope.playerHands[0].isCanSplit  = $scope.canSplit($scope.playerHands[0].cards);
      $scope.CanDouble = true;
      if ($scope.playerHands[0].score == 21) {
        winBlackjack(0);
      }
  };


    function resetHand () {
        this.cards = [];
        this.score = "";
        this.ceaseAction = false;
        this.bet = 0;
        this.splitOn = false;
        this.isCanSplit = false;
        this.CanDouble = false;
    }

    function winBlackjack(i) {
      var bank = $localStorage.bank + $scope.playerHands[i].bet * 1.5;
      return timer(bank);
    }

    function gameOver(bank) {
      $localStorage.bank  = bank;
      $scope.splitCounter = 0;
      $scope.gameStarted = false;
      $scope.isbusted = false;
      $scope.ceaseAction = false;
      $scope.playerHands = [];
      var getClearHand = new resetHand();
      $scope.playerHands.push(getClearHand);
      $scope.dealerScore = 0;
      $scope.dealerDraw = [];

    }

     $scope.hitMe = function(i) {
      $scope.CanDouble = false;
      $scope.playerHands[i].cards.push(ActionOption.getCard());
      $scope.playerHands[i].score = blackjackRules.getHandScore($scope.playerHands[i].cards);
      if ($scope.busted($scope.playerHands[i].score)) {
        var bank = $localStorage.bank - $scope.playerHands[i].bet;
        timer(bank);
      }
    };

    function addHand(){
        this.cards = [];
        this.score = "";
        this.bet = 0;
        this.ceaseAction = false;
        this.splitOn = false;
        this.isCanSplit = false;
        this.CanDouble = false;
    }

    $scope.busted = function(score) {
        if (score > 21) {
            return true;
        } else return false;
    };

    $scope.canSplit = function(cards) {
        if (cards.length == 2) {
            if (cards[0].name == cards[1].name) {
                return true;
            }
        } else return false;
    };

    $scope.isBlackjack = function(cards) {
        if (cards.length == 2) {
            if (cards[0].name == 'A' || cards[1].name == 'A') {
                 if (cards[0].name in ['T','J','Q','K'] || cards[0].name in ['T','J','Q','K']  ) {
                    return true;
                }
            }
        } else return false;
    };

     $scope.doubleDown = function(bet, i) {
        $scope.playerHands[i].bet = bet + bet ;
        $scope.hitMe(i);
        if ($scope.playerHands[i].score <= 21) {
            $scope.stand(i);
        } else {
            var bank = $localStorage.bank   - $scope.playerHands[i].bet;
            timer(bank);
        }
    };
    $scope.stand = function(i) {
        var indexHand = i ;
        var c = $scope.playerHands.length - 1;
        $scope.playerHands[i].ceaseAction = true;
        if (c >  indexHand ) {
            $scope.splitCounter = $scope.splitCounter + 1;
            $scope.splitInAction = false;
            $scope.playerHands[indexHand +1].cards.push(ActionOption.getCard());
            $scope.playerHands[indexHand +1].canDouble = true;
            $scope.playerHands[$scope.splitCounter].isCanSplit = $scope.canSplit($scope.playerHands[$scope.splitCounter].cards);
            $scope.playerHands[indexHand +1].score = blackjackRules.getHandScore($scope.playerHands[indexHand +1].cards);


        }
        if ($scope.playerHands.length - 1 == indexHand ) {
            showDealerHand();
        }
    };
    function showDealerHand () {
        var win = 0;
        var lose = 0;
        var total = 0;
        var totalB = 0;
        var scoreP = [];
        for (var i = 0; i < $scope.playerHands.length; i++) {
            scoreP[i] = $scope.playerHands[i].score;
        }
        var scoreD = 0;
        var remBackCard = $scope.dealerDraw.pop();
        function getDealerMoreCards(){
            $scope.dealerDraw.push(ActionOption.getCard());
            scoreD = blackjackRules.getHandScore($scope.dealerDraw);
            if (scoreD < 17) {
                $scope.dealerScore = scoreD;
                getDealerMoreCards();
            }
        }
            $scope.dealerScore = blackjackRules.getHandScore($scope.dealerDraw);
            $scope.ceaseAction = true;
            getDealerMoreCards();
            $scope.dealerScore = blackjackRules.getHandScore($scope.dealerDraw);
            if ($scope.busted($scope.dealerScore)) {
                for (var z = 0; z < $scope.playerHands.length; z++) {
                    totalB = $scope.playerHands[z].bet;
                }
                totalB = totalB + $localStorage.bank;
                timer(totalB);
            } else {
                for (var ii = 0; ii < scoreP.length; ii++) {
                    if (scoreP[ii] >= scoreD) {
                        total = total + $scope.playerHands[ii].bet;
                    } else {
                        total = total -$scope.playerHands[ii].bet;
                    }
                }
                total = total + $localStorage.bank;
                timer(total);
            }
    }
    $scope.split = function  (i) {
        $scope.splitInAction = true;
        $scope.playerHands[i].splitIOn = true;
        var counter = $scope.splitCounter + 1 + i;
        var cardSplit = $scope.playerHands[i].cards[1];
        var newHand = new addHand();
        $scope.playerHands[i].cards.pop();
        $scope.playerHands.push(newHand);
        var c = $scope.playerHands.length - 1;
        $scope.playerHands[c].bet = $scope.playerHands[i].bet;
        $scope.playerHands[c].cards.push(cardSplit);
        $scope.playerHands[c].score = blackjackRules.getHandScore($scope.playerHands[i].cards);
        $scope.playerHands[i].cards.push(ActionOption.getCard());
        $scope.playerHands[i].score = blackjackRules.getHandScore($scope.playerHands[i].cards);
        $scope.playerHands[i].isCanSplit = $scope.canSplit($scope.playerHands[i].cards);
        $scope.playerHands[i].canDouble = true;
        $scope.playerHands[c].score = blackjackRules.getHandScore($scope.playerHands[c].cards);


    };

    function timer(bank){
        $timeout(function(){
            gameOver(bank);
        }, 1000);
    }
});


