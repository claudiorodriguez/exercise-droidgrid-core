'use strict';

const chai = require('chai'),
    rgbaToDataUri = require('../index');

const expect = chai.expect,
    assert = chai.assert;

// ----- Basic tests ----- //

const DroidGrid = require('../index');

exports['Test placement and movement'] = {
  // This is the provided spec
  'two droids no collision': function(done) {
    const expectedDroids = [
      {x: 1, y: 3, facing: 'north'},
      {x: 5, y: 1, facing: 'east'}
    ];

    const opts = { width: 6, height: 6 };
    let grid = new DroidGrid(opts);

    function placeAndMove() {
      grid.placeDroid(1, 2, 'north');
      grid.moveDroid(['left', 'move', 'left', 'move', 'left', 'move', 'left', 'move', 'move']);

      grid.placeDroid(3, 3, 'east');
      grid.moveDroid(['move', 'move', 'right', 'move', 'move', 'right', 'move', 'right', 'right', 'move']);
    }

    expect(placeAndMove).to.not.throw(Error);

    let snapshot = grid.snapshot();

    expect(snapshot.droids).to.exist;
    expect(snapshot.droids).to.eql(expectedDroids);

    done();
  },

  'moving collision': function(done) {
    const opts = { width: 6, height: 6 };
    let grid = new DroidGrid(opts);

    function placeAndMove() {
      grid.placeDroid(1, 1, 'north');
      grid.moveDroid(['left', 'move']);

      grid.placeDroid(1, 1, 'west');
      grid.moveDroid(['move']);
    }

    expect(placeAndMove).to.throw(Error);

    done();
  },

  'placement collision': function(done) {
    const opts = { width: 6, height: 6 };
    let grid = new DroidGrid(opts);

    function place() {
      grid.placeDroid(1, 1, 'north');
      grid.placeDroid(1, 1, 'west');
    }

    expect(place).to.throw(Error);

    done();
  },

  'invalid grid size': function(done) {
    const opts = { width: 6, height: -1 };

    function newBadGrid() {
      let grid = new DroidGrid(opts);
    }

    expect(newBadGrid).to.throw(Error);

    done();
  },

  'zero-value coords': function(done) {
    const opts = { width: 2, height: 2 };

    function makeGrid() {
      let grid = new DroidGrid(opts);
      grid.placeDroid(0, 0, 'north');
      grid.moveDroid(['move','left','left','move']);
    }

    expect(makeGrid).to.not.throw(Error);

    done();
  }
};
