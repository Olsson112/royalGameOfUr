import React from 'react';
import ReactDOM from 'react-dom';
import MainContainer from './components/mainContainer';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<MainContainer />, document.getElementById('root'));

serviceWorker.unregister();
