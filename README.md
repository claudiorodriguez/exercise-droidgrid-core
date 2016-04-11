# exercise-droidgrid-core

[![Build Status][travis-image]][travis-url]

Performs droid placement and movement operations on a 2D grid, checking for collision.

## Installation

### node.js

Install using [npm](http://npmjs.org/):

```bash
$ npm install git+https://github.com/claudiorodriguez/exercise-droidgrid-core.git
```

## Examples

**Node.JS**

```javascript
const DroidGrid = require('exercise-droidgrid-core');

const opts = { width: 6, height: 6 };
let grid = new DroidGrid(opts);
grid.placeDroid(1, 2, 'north'); // x, y, facing (north|south|east|west)
grid.moveDroid(['left', 'move', 'right', 'move']); // array of left|right|move
grid.placeDroid(1, 3, 'north'); // droids are placed sequentially
// you will keep moving the same droid in consecutive moveDroid calls:
grid.moveDroid(['left', 'right', 'left']);
grid.moveDroid('move'); // this will throw an error (collision)
grid.placeDroid(0, 3, 'east'); // this will also throw an error (occupied)

// gets a dump of the grid's current state in object form
let snapshot = grid.snapshot();
// create a grid from a snapshot:
let anotherGrid = new DroidGrid(snapshot);
```

## Testing

To run the tests:

```bash
$ npm test
```

## Contributing

This is an exercise project. You are welcome to fork it but I am unlikely to maintain it.

## License

MIT - see [LICENSE][license-url]

[travis-image]: https://travis-ci.org/claudiorodriguez/exercise-droidgrid-core.svg?branch=master
[travis-url]: https://travis-ci.org/claudiorodriguez/exercise-droidgrid-core
[license-url]: https://github.com/claudiorodriguez/exercise-droidgrid-core/blob/master/LICENSE
