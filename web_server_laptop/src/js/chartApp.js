import React from 'react';
import ReactDom from 'react-dom';
import Model from './js/components/container/model.jsx';

function main() {
  const ws = {};
  const app = <Model ws={ws}/>;
  ReactDom.render(app, document.getElementById('create-article-form'));
}

main();