(function() {
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");

  var grids = {
    // number of rows
    rows: 556,
    // number of columns
    columns: 900
  };

  grids.total = grids.rows * grids.columns;

  var alive = 1;
  var dead = 0;
  var lifes = new Array(grids.total);
  var neighbours = new Array(grids.total);
  lifes.fill(dead);

  var ui = {
    init: function() {
      canvas.width = grids.columns;
      canvas.height = grids.rows;
    },
    refresh: function() {
      ui.clear();
      ui.render();
    },
    render: function() {
      for (var i = 0; i < grids.total; i++) {
        if (lifes[i] === alive) {
          var row = Math.floor(i / grids.columns);
          var column = i % grids.columns;
          context.fillRect(column, row, 1, 1);
        }
      }
    },
    clear: function() {
      context.clearRect(0, 0, grids.columns, grids.rows);
    }
  };

  var rules = {
    apply: function(i) {
      if (lifes[i] === alive && (neighbours[i] < 2 || neighbours[i] > 3)) {
        lifes[i] = dead;
      } else if (lifes[i] === dead && neighbours[i] === 3) {
        lifes[i] = alive;
      }
    }
  };

  var dice = {
    getSeeds: function(count) {
      // TODO: random.org
      var i = count;
      while (i > 0) {
        var randomNumber = Math.ceil(Math.random() * grids.total);
        if (lifes[randomNumber] !== alive) {
          i--;
          lifes[randomNumber] = alive;
        }
      }
    }
  };

  var engine = {
    interval: 10, // 10 milli-seconds
    start: function() {
      ui.init();
      setInterval(function() {
        engine.change();
        ui.refresh();
      }, engine.interval);
    },
    reset: function() {},
    speedUp: function() {
      interval /= 2;
    },
    slowDown: function() {
      interval *= 2;
    },
    caculate: function(i) {
      var myNeighbours = [
        i - grids.columns - 1, i - grids.columns, i - grids.columns + 1,
        i - 1, i + 1,
        i + grids.columns - 1, i + grids.columns, i + grids.columns + 1
      ];
      var myAliveNeighbours = myNeighbours.filter(function(index) {
        return index >= 0 && index < grids.total && lifes[index] === alive;
      });
      neighbours[i] = myAliveNeighbours.length;
    },
    change: function() {
      for (var i = 0; i < grids.total; i++) {
        // caculate neighbours
        engine.caculate(i);
      }
      // should not merge two loops
      for (i = 0; i < grids.total; i++) {
        rules.apply(i);
      }
    }
  };
  dice.getSeeds(grids.total / 5);
  engine.start();
})();
