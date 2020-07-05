(function () {
    var currentPlayer = "player1";
    var columns = ["col1", "col2", "col3", "col4", "col5", "col6", "col7"];
    var doc = $(document);
    var board = $("#board");
    var slots = $(".slot");
    var start = $("#start");
    var shroud = $("#shroud");
    var playerNames = $("#playerNames");
    var chip = $("#chip");
    var dropDown = $("#dropdown");
    var menuBtn = $("#menu");
    var closeMenuBtn = $("#closeMenu");
    var saveBtn = $("#save");
    var clearBtn = $("#clear");
    var game;
    var finished;

    start.on("click", startGame);
    menuBtn.on("click", menuDropdown);
    closeMenuBtn.on("click", closeMenu);
    saveBtn.on("click", saveGame);
    clearBtn.on("click", clearGames);

    function drop(e) {
        var col = $(e.currentTarget);
        var slotsInCol = col.children();
        var lastPlay;
        var colNumber = columns.indexOf(col.attr("id"));

        for (var i = slotsInCol.length - 1; i >= 0; i--) {
            if (
                !slotsInCol.eq(i).hasClass("player1") &&
                !slotsInCol.eq(i).hasClass("player2")
            ) {
                // do something
                lastPlay = [colNumber, i];
                dropPlayerPiece(slotsInCol.eq(i));

                game.play(currentPlayer, lastPlay);

                break;
            }
        }
        var slotsInRow = $(".row" + (i + 1));

        // if i is -1 col is full, get outta there!

        waitForAnimation();
        function waitForAnimation() {
            if (finished === false) {
                setTimeout(waitForAnimation, 50);
                return;
            } else {
                if (i === -1) {
                    return;
                }
                if (columnCheck(slotsInCol)) {
                    console.log("column victory");
                    victory();
                } else if (rowCheck(slotsInRow)) {
                    console.log("row victory");
                    victory();
                } else if (diagonalCheck(lastPlay)) {
                    console.log("diagonal victory");
                    victory();
                }
                switchPLayer();
            }
        }
    }

    function playerPiece(e) {
        var bgc = currentPlayer === "player1" ? "#ea3546" : "#662e9b";
        var col = $(e.target).parent().parent();
        var left;
        if (chip.hasClass("hide")) {
            chip.removeClass("hide");
        }
        // var bottom = board.offset().top + board.height();
        if ($(e.target).hasClass("hole")) {
            try {
                left = col.offset().left + 5 + "px";
            } catch (err) {
                console.log("off the board", err);
            }
        }

        chip.css({
            position: "absolute",
            backgroundColor: bgc,
            borderRadius: "50%",
            border: "3px solid white",
            width: "80px",
            height: "80px",
            left: left,
            top: "50px",
            zIndex: 0,
        });
        // for (var i = 0; i < )
    }
    function dropPlayerPiece(slot) {
        var start = chip.offset().top;
        var top = start;
        var left = chip.offset().left;
        var bottom = slot.offset().top;
        var step;
        finished = false;
        doc.off("mouseover", playerPiece);
        function animateDrop() {
            top += 10;

            chip.css({ top: top + "px" });
            if (top >= bottom) {
                chip.addClass("hide");
                slot.addClass(currentPlayer);
                doc.on("mouseover", playerPiece);
                cancelAnimationFrame(step);
                finished = true;
                return;
                // chip.css({ top: start + 'px' });
            }

            step = window.requestAnimationFrame(animateDrop);
        }

        chip.css({
            top: top + "px",
            left: left + "px",
        });
        step = window.requestAnimationFrame(animateDrop);
    }
    function diagonalCheck(currentPos) {
        var left = 0;
        var right = 0;
        var currentR = currentPos[0] + currentPos[1];
        var currentL = currentPos[0] - currentPos[1];

        for (var i = 0; i < slots.length; i++) {
            var col = columns.indexOf(slots.eq(i).parent().attr("id"));
            var rowClasses = slots.eq(i).attr("class").split(" ");
            var row = Number(rowClasses[1].slice(-1) - 1);
            var diagRight = col + row;
            var diagLeft = col - row;

            if (currentR === diagRight && slots.eq(i).hasClass(currentPlayer)) {
                right++;
            }
            if (currentL === diagLeft && slots.eq(i).hasClass(currentPlayer)) {
                left++;
            }
            if (left === 4 || right === 4) {
                console.log("VICTORY!");
                return true;
            }
        }
    }

    function rowCheck(slots) {
        var counter = 0;
        for (var i = 0; i < slots.length; i++) {
            if (slots.eq(i).hasClass(currentPlayer)) {
                counter++;
            } else {
                counter = 0;
            }
            if (counter === 4) {
                console.log("VICTORY!");
                $(".column").off("click", drop);
                return true;
            }
        }
    }

    function columnCheck(slots) {
        var counter = 0;
        for (var i = 0; i < slots.length; i++) {
            if (slots.eq(i).hasClass(currentPlayer)) {
                counter++;
            } else {
                counter = 0;
            }
            if (counter === 4) {
                console.log("VICTORY!");
                $(".column").off("click", drop);
                return true;
            }
        }
    }

    function switchPLayer() {
        currentPlayer === "player1"
            ? (currentPlayer = "player2")
            : (currentPlayer = "player1");
    }

    function startGame() {
        shroud.addClass("show").removeClass("hide");
        getPLayerNames();

        function getPLayerNames() {
            var p1Input = $("#p1Input");
            var p2Input = $("#p2Input");
            var ok = $("#pnOK");
            var pNames = ["", ""];

            playerNames.addClass("show").removeClass("hide");
            // get player one name
            p1Input.on("input", handleP1Input);
            // get player two name
            p2Input.on("input", handleP2Input);
            // handle ok
            ok.on("click", handleOk);

            function handleP1Input(e) {
                pNames[0] = p1Input.val();
            }
            function handleP2Input(e) {
                pNames[1] = p2Input.val();
            }
            function handleOk(e) {
                var conf;
                if (pNames[0] === "" || pNames[1] === "") {
                    conf = confirm(
                        "Are you sure you don't want to enter a PLayer name?\nYou won't be able to save your victory."
                    );
                    if (conf) {
                        closeGetNameAndStart(["", ""]);
                    }
                } else {
                    closeGetNameAndStart(pNames);
                }
                doc.on("mouseover", playerPiece);
            }
            function closeGetNameAndStart(names) {
                playerNames.addClass("hide").removeClass("show");
                shroud.addClass("hide").removeClass("show");
                p1Input.off("input", handleP1Input);
                p2Input.off("input", handleP2Input);
                ok.off("click", handleOk);

                game = new ConnectFour(names[0], names[1]);
                $("#playerName1").text(names[0]);
                $("#playerName2").text(names[1]);
                clearBoard();

                $(".column").on("click", drop);
                start.text("New Game!");
                start.off("click", startGame);
                start.on("click", samePlayers);
            }
        }
    }

    function victory() {
        var nameArr = game.getPLayerName();
        var victory = $("#victory");
        doc.off("mouseover", playerPiece);
        victory.removeClass("hide").addClass("show");
        $("#winnerPlayer").text("Player " + nameArr[0]);
        $("#winnerName").text(nameArr[1]);
        $("#winnerName").addClass("playerName" + nameArr[0]);
        $("#xWrapper").on("click", closeVictory);
        // increment score
        if (nameArr[0] == 1) {
            game.player1.score++;
            $("#p1Point").text(game.player1.score);
        } else {
            game.player2.score++;
            $("#p2Point").text(game.player2.score);
        }

        var thisGame = game;
        game.playedGames.push(thisGame);
        console.log(
            "Player One " + game.player1.score,
            "Player Two " + game.player2.score
        );

        function closeVictory(e) {
            victory.removeClass("show").addClass("hide");
            $("#xWrapper").off("click", closeVictory);
        }
    }
    function samePlayers(e) {
        var same = confirm("Are the same two players playing?");
        if (same) {
            game.history = [];
            clearBoard();
            doc.on("mouseover", playerPiece);
            $(".column").on("click", drop);
        } else {
            startGame();
        }
    }
    function clearBoard() {
        slots.each(function (i) {
            var elem = $(this);
            if (elem.hasClass("player1")) {
                elem.removeClass("player1");
            } else if (elem.hasClass("player2")) {
                elem.removeClass("player2");
            }
        });
        game.newBoard();
    }

    // game state
    function ConnectFour(player1Name, player2name) {
        this.player1 = new Player(player1Name, 1);
        this.player2 = new Player(player2name, 2);
        this.board = new Board();
        this.newBoard = function () {
            this.board = new Board();
        };
        this.history = [];
        this.playedGames = [];
        this.play = function (player, position) {
            var oldBoard = JSON.stringify(this.board);
            this.history.push(oldBoard);
            var coin = player === "player1" ? "X" : "O";
            this.board[position[1]][position[0]] = coin;
            this.getPLayerName();
            this.printCurrentBoard();
        };
        this.getPLayerName = function () {
            var num = currentPlayer.charAt(currentPlayer.length - 1);
            var player = num === "1" ? this.player1.name : this.player2.name;
            console.log("Player " + num + ": " + player);
            return [num, player];
        };

        this.printCurrentBoard = function () {
            var board = "";

            for (var i = 0; i < this.board.length; i++) {
                var row = this.board[i];
                board += row.toString() + "\n";
            }
            console.log(board);
        };
        // creat 2d array for board
        function Board() {
            var arr = [];
            for (var j = 0; j < 6; j++) {
                arr.push([" ", " ", " ", " ", " ", " ", " "]);
            }
            return arr;
        }
        function Player(name, number) {
            (this.name = name), (this.number = number), (this.score = 0);
        }
    }

    function menuDropdown() {
        dropDown.removeClass("upAndAway");
        loadGames();
    }
    function closeMenu() {
        dropDown.addClass("upAndAway");
    }
    function loadGames() {
        var games = getLocalStorage();
        console.log(games);
    }
    function saveGame() {
        // check local storage
        var save = new savedGame(game);
        var games = getLocalStorage();
        var saveObj = {
            name: `${game.player1.name}-${game.player2.name}`,
            game: save,
            date: new Date().toLocaleString(),
        };
        games.push(saveObj);
        var gameJson = JSON.stringify(games);

        localStorage.setItem("connectFour", gameJson);
    }
    function savedGame(game) {
        this.player1 = game.player1;
        this.player2 = game.player2;
        this.history = game.history;
        this.playedGames = game.playedGames;
    }
    function getLocalStorage() {
        if (!localStorage.getItem("connectFour")) {
            localStorage.setItem("connectFour", "[]");
        }
        var savedGames = localStorage.getItem("connectFour");
        var parsedGames = JSON.parse(savedGames);
        return parsedGames;
    }
    function clearGames() {
        localStorage.clear();
    }
})();
