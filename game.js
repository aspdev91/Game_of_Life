var utils = {
  //get cell status
  getCellStatus: function(cell){
    return cell.getAttribute('data-status');
  },
  //set cell status
  setCellStatus: function(cell, status) {
    cell.setAttribute('data-status', status)
    cell.className = status;
  },
  //toggle cell
  toggleStatus: function(cell) {
    if(utils.getCellStatus(cell) === 'dead') {
      utils.setCellStatus(cell, 'alive');
    } else {
      utils.setCellStatus(cell, 'dead');
    }
  },
  // retrieve cell object from DOM
  getCell: function(col,row) {
    return document.getElementById(col + '-' + row);
  },

  //get neighbors of cell 
  getNeighbors : function(cell) {
 
    var splitId = cell.id.split('-').map(Number);
    var col = splitId[0];
    var row = splitId[1];
    var neighbors = [];

    //get left/right
    neighbors.push(utils.getCell(col-1, row));
    neighbors.push(utils.getCell(col+1, row));
    //get top row
    neighbors.push(utils.getCell(col-1, row-1));
    neighbors.push(utils.getCell(col, row-1));
    neighbors.push(utils.getCell(col+1, row-1));

    //get bottom row
    neighbors.push(utils.getCell(col-1, row+1));
    neighbors.push(utils.getCell(col, row+1));
    neighbors.push(utils.getCell(col + 1, row+1));

    return neighbors.filter(function(neighbor) {
      return neighbor !== null;
    });

  },
  //count neieighbors
  countAlive : function(neighbors) {
    return neighbors.filter(function(neighbor) {
      return utils.getCellStatus(neighbor) === 'alive';
    }).length;
  }
}


var gameOfLife = {
  // Determines dimensions of board
  width: 12,
  height: 12,
  stepInterval: null,

  createAndShowBoard: function () {
    // create <table> element
    var goltable = document.createElement("tbody");
    
    // build Table HTML
    var tablehtml = '';
    for (var h=0; h<this.height; h++) {
      tablehtml += "<tr id='row+" + h + "'>";
      for (var w=0; w<this.width; w++) {
        tablehtml += "<td data-status='dead' id='" + w + "-" + h + "'></td>";
      }
      tablehtml += "</tr>";
    }
    goltable.innerHTML = tablehtml;
    
    // add table to the #board element
    var board = document.getElementById('board');
    board.appendChild(goltable);
    
    // once html elements are added to the page, attach events to them
    this.setupBoardEvents();
  },

  forEachCell: function (iteratorFunc) {
    // iterates through each cell and runs any function inputted through parameter
    var allCells = [].slice.call(document.getElementsByTagName('td'));

    allCells.forEach(function(cell) {
      var splitId = cell.id.split('-');
      iteratorFunc(cell, splitId[0], splitId[1])
    })
  },
  
  setupBoardEvents: function() {
    
    // adds event listeners for each cell
    this.forEachCell(function(cell) {
      cell.addEventListener('click', function(){
        utils.toggleStatus(this);     
      });
    });

    // assigns DOM object to variables
    var stepBtn = document.getElementById('step_btn');
    var playBtn = document.getElementById('play_btn');
    var clearBtn = document.getElementById('clear_btn');
    var resetBtn = document.getElementById('reset_btn');

    // adds corresponding event listeners to each button
    stepBtn.addEventListener('click', gameOfLife.step.bind(this));
    playBtn.addEventListener('click', gameOfLife.enableAutoPlay.bind(this));
    clearBtn.addEventListener('click', gameOfLife.clear.bind(this));
    resetBtn.addEventListener('click', gameOfLife.reset.bind(this));
  },

  step: function () {
    // establish array to track cells that need to be toggled
    var toToggle = [];

    //iterate over cells to determine if cell should be toggled
    this.forEachCell(function(cell) {
      var neighbors = utils.getNeighbors(cell);
      var numAlive = utils.countAlive(neighbors);
      if(utils.getCellStatus(cell) === 'alive') {
        console.log('living', cell, numAlive)
      }
      if(utils.getCellStatus(cell) === 'dead') {
        if(numAlive === 3) {
          toToggle.push(cell)
        }
      //cell is alive
      } else {
        if(numAlive < 2 || numAlive > 3) {
          toToggle.push(cell);
        }
      }
    });

    // toggle the cells that meet the conditions of Game of Life
    toToggle.forEach(utils.toggleStatus)
  },

  enableAutoPlay: function () {
    // start Auto-Play by running the 'step' function
    // automatically repeatedly every fixed time interval
   if( this.stepInterval === null) {
    this.stepInterval = setInterval(this.step.bind(this), 500) 
   } else {
    //stop
    this.stop();
   }
  },
  // stop autoplay
  stop : function() {
    clearInterval(this.stepInterval);
    this.stepInterval = null;
  },
  // clear entire board to all dead cells
  clear : function() {
    this.stop();
    this.forEachCell(function(cell){
      utils.setCellStatus(cell, 'dead');
    })
  },
  // clears board and randomly sets the status of each cell
  reset : function() {
    this.stop();
    this.clear();
    this.forEachCell(function(cell){
      if(Math.random() > 0.5) {
        utils.setCellStatus(cell, 'alive')
      } else {
        utils.setCellStatus(cell, 'dead');
      }
    })
  }
};

gameOfLife.createAndShowBoard();
