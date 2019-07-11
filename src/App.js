import React, { Component, createRef } from 'react';
import './App.css';
import './styles/main.css'
import 'semantic-ui-css/semantic.min.css'
import Dashboard from './components/Dashboard'
import { Sticky, Header, Icon } from 'semantic-ui-react'


class App extends Component {
  contextRef = createRef()

  render() {
    return (
      <div ref={this.contextRef}>
        <Sticky context={this.contextRef}>
        <div className='_headerClass'>
          <Header as='h2'>
            <Icon name='chart line' />
            <Header.Content>
              React Charts Dashboard
              <Header.Subheader className='_white'>Create Rich Animated Charts</Header.Subheader>
            </Header.Content>
          </Header>
        </div>
      </Sticky>
        <Dashboard/>
      </div>
    );
  }
}

export default App;
