import React from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  useRouteMatch,
  useParams,
  Redirect
} from "react-router-dom"

const MyMenu: React.VFC = () => {
  return null
}

// FIXME: replace 'any' for type safety
const MyRoute: React.FC<any> = ({ children, ...other }) => {
  return (
    <Route {...other}>{children}</Route>
  )
}

export const App: React.VFC = () => {
  const jsx = (
    <Router basename="~mark/react003/">
      <MyMenu />
      <div className="content">
        <Switch>
          {/* Next optimization: The title is duplicated in the component. Either move the title into or out of the component */}
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
          <MyRoute title="🍽 Food" path="/food" component={Food} />
          <MyRoute title="🏠 Home" path="/home" component={Home} />
          <MyRoute title="🥸 Topics" path="/topics" component={Topics} />
          <MyRoute title="📚 About" path="/about" component={About} />
        </Switch>
      </div>
    </Router>
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
        return React.createElement('ul', { class: "menu" }, menu)
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

const Food: React.VFC = () => {
  return <React.Fragment>
    <h1>Food</h1>
    <h2> ☕️ Breakfast</h2>
    <h2>🍱 Lunch</h2>
    <h2>🍷 Dinner</h2>
  </React.Fragment>
}

const Home: React.VFC = () => {
  return <h2>Home</h2>
}

const About: React.VFC = () => {
  return <h2>About</h2>
}

const Topics: React.VFC = () => {
  let match = useRouteMatch()

  return (
    <React.Fragment>
      <h2>Topics</h2>

      <ul>
        <li>
          <NavLink to={`${match.url}/components`}>Components</NavLink>
        </li>
        <li>
          <NavLink to={`${match.url}/props-v-state`}>
            Props v. State
          </NavLink>
        </li>
      </ul>

      {/* The Topics page has its own <Switch> with more routes
          that build on the /topics URL path. You can think of the
          2nd <Route> here as an "index" page for all topics, or
          the page that is shown when no topic is selected */}
      <Switch>
        <Route path={`${match.path}/:topicId`}>
          <Topic />
        </Route>
        <Route path={match.path}>
          <h3>Please select a topic.</h3>
        </Route>
      </Switch>
    </React.Fragment>
  )
}

const Topic: React.VFC = () => {
  const { topicId } = useParams<{ topicId?: string }>()
  return <h3>Requested topic ID: {topicId}</h3>
}
