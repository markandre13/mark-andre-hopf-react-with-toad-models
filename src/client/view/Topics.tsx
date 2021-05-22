import React from "react"
import {
  Switch,
  Route,
  NavLink,
  useRouteMatch,
  useParams
} from "react-router-dom"

export const Topics: React.VFC = () => {
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
  const { topicId } = useParams<{ topicId?: string} >()
  return <h3>Requested topic ID: {topicId}</h3>
}
