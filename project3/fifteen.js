/*
 * CPSC 5200A02 - Project 3: Fifteen Puzzle
 * Author: Christopher Boartfield
 * Date: 04-08-2026
 *
 * Implements the Fifteen Puzzle game logic.
 * 4x4 grid with 15 numbered tiles and one empty space.
 */

"use strict";

(function () {
    var PUZZLE_SIZE = 4;
    var TILE_SIZE = 100;
    var NUM_TILES = 15;
    var SHUFFLE_MOVES = 1000;

    // Empty square position (0-indexed)
    var emptyRow = 3;
    var emptyCol = 3;

    // Setup on page load
    window.onload = function () {
        setupTiles();
        document.getElementById("shufflebutton").onclick = shuffle;
    };

    // Configures the 15 existing tile divs inside #puzzlearea
    function setupTiles() {
        var tiles = document.getElementById("puzzlearea").getElementsByTagName("div");

        for (var i = 0; i < tiles.length; i++) {
            var tile = tiles[i];
            var tileNumber = i + 1;

            tile.classList.add("puzzletile");

            // Grid position from tile number
            var row = Math.floor(i / PUZZLE_SIZE);
            var col = i % PUZZLE_SIZE;

            setTilePosition(tile, row, col);
            setTileBackground(tile, tileNumber);
            tile.id = "square_" + row + "_" + col;

            tile.onclick = tileClicked;
            tile.onmouseover = tileMouseOver;
            tile.onmouseout = tileMouseOut;
        }

        updateMovableClasses();
    }

    // Sets a tile's left/top position on the grid
    function setTilePosition(tile, row, col) {
        tile.style.left = (col * TILE_SIZE) + "px";
        tile.style.top = (row * TILE_SIZE) + "px";
    }

    // Sets which portion of the background image a tile shows (negated offsets)
    function setTileBackground(tile, tileNumber) {
        var imgRow = Math.floor((tileNumber - 1) / PUZZLE_SIZE);
        var imgCol = (tileNumber - 1) % PUZZLE_SIZE;
        tile.style.backgroundPosition =
            (-imgCol * TILE_SIZE) + "px " + (-imgRow * TILE_SIZE) + "px";
    }

    // Moves tile into empty space if it's adjacent
    function tileClicked() {
        var tile = this;
        var pos = getTilePosition(tile);
        if (isNeighborOfEmpty(pos.row, pos.col)) {
            moveTile(tile, pos.row, pos.col);
        }
    }

    // Slides a tile into the empty square and updates positions
    function moveTile(tile, tileRow, tileCol) {
        var newRow = emptyRow;
        var newCol = emptyCol;

        setTilePosition(tile, newRow, newCol);
        tile.id = "square_" + newRow + "_" + newCol;

        emptyRow = tileRow;
        emptyCol = tileCol;

        updateMovableClasses();
    }

    // Returns a tile's current row/col from its CSS position
    function getTilePosition(tile) {
        var left = parseInt(tile.style.left);
        var top = parseInt(tile.style.top);
        return {
            row: top / TILE_SIZE,
            col: left / TILE_SIZE
        };
    }

    // Checks if a position is directly adjacent to the empty square
    function isNeighborOfEmpty(row, col) {
        return Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1;
    }

    // Adds/removes "movable" class on tiles neighboring the empty square
    function updateMovableClasses() {
        var tiles = document.querySelectorAll(".puzzletile");
        for (var i = 0; i < tiles.length; i++) {
            var pos = getTilePosition(tiles[i]);
            if (isNeighborOfEmpty(pos.row, pos.col)) {
                tiles[i].classList.add("movable");
            } else {
                tiles[i].classList.remove("movable");
            }
        }
    }

    // CSS :hover on .movable handles the red highlight
    function tileMouseOver() { }
    function tileMouseOut() { }

    // Shuffles by making random legal moves (guarantees solvability)
    function shuffle() {
        for (var i = 0; i < SHUFFLE_MOVES; i++) {
            var neighbors = getNeighborsOfEmpty();
            var randomIndex = parseInt(Math.random() * neighbors.length);
            var neighbor = neighbors[randomIndex];
            var row = neighbor.row;
            var col = neighbor.col;
            var tile = document.getElementById("square_" + row + "_" + col);
            moveTile(tile, row, col);
        }
    }

    // Returns positions adjacent to the empty square (within bounds)
    function getNeighborsOfEmpty() {
        var neighbors = [];
        if (emptyRow > 0) neighbors.push({ row: emptyRow - 1, col: emptyCol });
        if (emptyRow < PUZZLE_SIZE - 1) neighbors.push({ row: emptyRow + 1, col: emptyCol });
        if (emptyCol > 0) neighbors.push({ row: emptyRow, col: emptyCol - 1 });
        if (emptyCol < PUZZLE_SIZE - 1) neighbors.push({ row: emptyRow, col: emptyCol + 1 });
        return neighbors;
    }
})();