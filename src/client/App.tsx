import React from "react"
import {
  BrowserRouter,
  Switch,
  Route,
  NavLink,
  Redirect
} from "react-router-dom"
import { About } from "./view/About"
import { Food } from "./view/Food"
import { Home } from "./view/Home"
import { Topics } from "./view/Topics"

import { Survey } from "./model/Survey"

// With react, rollup takes about 4s to compile... :(
// compiled file is 155119 bytes, gzipped 50348 bytes

// With material-ui, rollup takes about 5s to compile... :(
// compiled file is 286152 bytes, gzipped 88842 bytes

// * material ui doesn't provide input validation
// * inputMode: 'numeric', pattern: '[0-9]*' work's like shit
//    pattern is a HTML feature and work for the input types text, date, search, url, tel, email, and password
// * https://github.com/NoHomey/material-ui-number-input is deprecated

const MyMenu: React.VFC = () => {
  return null
}

// FIXME: replace 'any' for type safety
const MyRoute: React.FC<any> = ({ children, ...other }) => {
  return (
    <Route {...other}>{children}</Route>
  )
}

const survey = new Survey()

export const App: React.VFC = () => {
  const jsx = (
    <BrowserRouter>
      <MyMenu />
      <div className="content">
        <Switch>
          {/* Next optimization: The title is duplicated in the component. Either move the title into or out of the component */}
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
          <MyRoute title="🏠 Home" path="/home" component={Home} />
          <MyRoute title="🍽 Food" path="/food">
            <Food survey={survey}/>
          </MyRoute>
          <MyRoute title="🥸 Topics" path="/topics" component={Topics} />
          <MyRoute title="📚 About" path="/about" component={About} />
        </Switch>
      </div>
    </BrowserRouter>
  )

  // search UI tree to generate menu
  const menu: Array<React.ReactNode> = []
  forAllChildren(jsx, (child: React.ReactNode, index: number, depth: number) => {
    if (React.isValidElement(child)) {
      if (child.type === MyRoute) {
        const link = React.createElement(NavLink, { to: child.props.path }, child.props.title)
        menu.push(React.createElement('li', {}, link))
      }
    }
  })

  // replace <MyMenu/> with generated menu
  return forAllChildrenClone(jsx, (child: React.ReactNode, index: number, depth: number) => {
    // console.log(index, depth, child)
    if (React.isValidElement(child)) {
      if (child.type === MyMenu) {
        return React.createElement('ul', { className: "menu" }, menu)
      }
    }
    return child
  }) as React.ReactElement // FIXME: do without typecast
}

function forAllChildren(jsx: React.ReactNode, closure: (child: React.ReactNode, index: number, depth: number) => void) {
  forAllChildrenHelper(jsx, closure, 0)
}

function forAllChildrenHelper(jsx: React.ReactNode, closure: (child: React.ReactNode, index: number, depth: number) => void, depth: number) {
  React.Children.forEach(jsx, (child, index) => {
    if (React.isValidElement(child)) {
      closure(child, index, depth)
      if (child.props.children) {
        forAllChildrenHelper(child.props.children, closure, depth + 1)
      }
    }
  })
}

export function forAllChildrenClone(jsx: React.ReactNode, closure: (child: React.ReactNode, index: number, depth: number) => React.ReactNode): React.ReactNode {
  return forAllChildrenCloneHelper(jsx, closure, 0)
}

function forAllChildrenCloneHelper(jsx: React.ReactNode, closure: (child: React.ReactNode, index: number, depth: number) => React.ReactNode, depth: number): React.ReactNode {
  return React.Children.map(jsx, (child: React.ReactNode) => {
    if (React.isValidElement(child)) {
      const child2 = closure(child, 0, depth) as React.ReactElement
      let children: React.ReactNode
      if (child2 !== child && child2.props.children) {
        children = child2.props.children
      } else
        if (child.props.children) {
          children = forAllChildrenCloneHelper(child.props.children, closure, depth + 1)
        }
      // child.props.children.m==
      return React.cloneElement(child2, child.props, children)
    }
    return child
  })
}


