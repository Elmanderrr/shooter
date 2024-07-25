import EasyStar from "easystarjs";

export class Game {
  constructor() {
    const grid = [
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0],
    ];
    const easyStar = new EasyStar.js();

    easyStar.setGrid(grid);
    easyStar.setAcceptableTiles([0]);
    easyStar.findPath(0, 0, 4, 0, function (path) {
      if (path === null) {
        console.log("Path was not found.");
      } else {
        console.log(path);
      }
    });
    easyStar.calculate();
  }
}
