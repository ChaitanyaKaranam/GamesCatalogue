import React, { Component } from 'react';
import GameList from './GameList/gamelist';

export default class App extends Component {
  render() {
    return (
      <div>        
        <div>
          <nav className="navbar navbar-dark bg-dark">            
            <a style={{color:'white'}} className="navbar-brand">Games Arena</a>
          </nav>
        </div>

        <br/>
        <GameList/>
      </div>
    );
  }
}
