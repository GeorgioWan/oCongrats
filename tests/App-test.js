import expect from 'expect'
import React from 'react'
import {render, unmountComponentAtNode} from 'react-dom'

import App from 'src/container/App'

describe('App component', () => {
  let node

  beforeEach(() => {
    node = document.createElement('div')
  })

  afterEach(() => {
    unmountComponentAtNode(node)
  })

  it('Container App', () => {
    render(<App/>, node, () => {
      let child = node.firstChild;
      
      expect(child.id).toContain('rc-main');
    })
  })
})
