'use strict';

const chai = require('chai'),
    rgbaToDataUri = require('../index');

const expect = chai.expect,
    assert = chai.assert;

// ----- Basic tests ----- //

const DroidGrid = require('../index');
const Droid = DroidGrid.Droid;
const Grid = DroidGrid.Grid;

exports['Test placement and movement'] = {
  // This is the provided spec
  'two droids no collision': function(done) {
    const expectedDroids = [
      {x: 1, y: 3, facing: 'north'},
      {x: 5, y: 1, facing: 'east'}
    ];

    const opts = { width: 6, height: 6 };
    let grid = new Grid(opts.width, opts.height);

    function placeAndMove() {
      let droid1 = new Droid(1, 2, 'north');
      grid.add(droid1);
      grid.execute(['left', 'move', 'left', 'move', 'left', 'move', 'left', 'move', 'move']);
      let droid2 = new Droid(3, 3, 'east');
      grid.add(droid2);
      grid.execute(['move', 'move', 'right', 'move', 'move', 'right', 'move', 'right', 'right', 'move']);
    }

    expect(placeAndMove).to.not.throw(Error);

    let dump = grid.dump();

    expect(dump.droids).to.exist;
    expect(dump.droids).to.eql(expectedDroids);

    done();
  },

  'moving collision': function(done) {
    const opts = { width: 6, height: 6 };
    let grid = new Grid(opts.width, opts.height);

    function placeAndMove() {
      let droid1 = new Droid(1, 1, 'north');
      grid.add(droid1);
      grid.execute(['left', 'move']);

      let droid2 = new Droid(1, 1, 'west');
      grid.add(droid2);
      grid.execute(['move']);
    }

    expect(placeAndMove).to.throw(Error);

    done();
  },

  'placement collision': function(done) {
    const opts = { width: 6, height: 6 };
    let grid = new Grid(opts.width, opts.height);

    function place() {
      grid.add(new Droid(1, 1, 'north'));
      grid.add(new Droid(1, 1, 'west'));
    }

    expect(place).to.throw(Error);

    done();
  },

  'invalid grid size': function(done) {
    const opts = { width: 6, height: -1 };

    function newBadGrid() {
      let grid = new Grid(opts.width, opts.height);
    }

    expect(newBadGrid).to.throw(Error);

    done();
  },

  'zero-value coords': function(done) {
    const opts = { width: 2, height: 2 };

    function makeGrid() {
      let grid = new Grid(opts.width, opts.height);
      grid.add(new Droid(0, 0, 'north'));
      grid.execute(['move','left','left','move']);
    }

    expect(makeGrid).to.not.throw(Error);

    done();
  }
};
