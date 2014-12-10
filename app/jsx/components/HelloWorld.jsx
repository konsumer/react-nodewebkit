/* @jsx React.DOM */

var React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      <div>
        <h1>O, hey there</h1>
        <p>You can find this text in <code>app/components/HelloWorld.jsx</code>. It's pulled in by <code>app/index.jsx</code></p>
      </div>
    );
  }
});