const e = React.createElement;
ReactDOM.render(
  e('table',
    e('img', {src: "https://imgs.xkcd.com/comics/random_number.png"}

    )

  ),
  document.getElementById('reactTable')

);



/*import React from "react";
import ReactDOM from "react-dom";

"use strict";

var _ref2;

var products = [{
  name: "onion",
  price: ".99",
  id: 1
}, {
  name: "pepper",
  price: "1.25",
  id: 2
}, {
  name: "broccoli",
  price: "3.00",
  id: 3
}];

var TableRow = function TableRow(_ref) {
  var row = _ref.row;
  return React.createElement(
    "tr",
    null,
    React.createElement(
      "td",
      { key: row.name },
      row.name
    ),
    React.createElement(
      "td",
      { key: row.id },
      row.id
    ),
    React.createElement(
      "td",
      { key: row.price },
      row.price
    )
  );
};

var Table = (_ref2 = React.createElement(
  "table",
  null,
  data.map(function (row) {
    React.createElement(TableRow, { row: row });
  })
), data = _ref2.data, _ref2);

ReactDOM.render(React.createElement(Table, { data: products }), document.getElementById("reactTable"));
*/
