import React, { useState } from "react"
import { Suspense } from "react"
import { Resource } from "@rest-hooks/rest"
import { useResource } from "rest-hooks"

// https://resthooks.io/

// NOTE: one entry in the list has the same id as the single article
//       which will cause the single article to change too

// useCache
// useSubscription
// useRetrieve

// useContext
// useState
// useReducer

// useEffect

// can we change cached values?
// how to send data back?
// can we look into the cache?
// is there a service worker in place?
// what about caching the webapp with a service worker?
// can mockd be used in a unit test for rest-hooks? (karma, pupetter, local?)

class ArticleResource extends Resource {
  readonly id: string = ''
  readonly title: string = '';
  readonly body: string = ''

  pk() { return this.id }
  static urlRoot = '/api/articles/';
}

export const Home: React.VFC = () => {
  return <>
    <h2>Home</h2>
    <Suspense fallback={<div>Loading article...</div>}>
      <Article id="4711" />
    </Suspense>
    <Suspense fallback={<div>Loading articles...</div>}>
      <Articles />
    </Suspense>
  </>
}

export const Article: React.VFC<{ id: string }> = ({ id }) => {
  // http://localhost:8080/api/articles/4711
  const article = useResource(ArticleResource.detail(), { id })
  return <div style={{border: "1px solid #ccc", background: "#ccf"}}>
    ARTICLE<br />
    ID: {article.id}<br />
    TITLE: {article.title}<br />
    BODY: {article.body}<br />
  </div>
}

export const Articles: React.VFC = () => {
  // http://localhost:8080/api/articles/
  // additional parameters will be added as query params, eg.
  //   http://localhost:8080/api/articles/?id=4711
  const articles = useResource(ArticleResource.list(), {})
  return <>
    {articles.map((article) =>
      <div style={{border: "1px solid #ccc", background: "#cfc"}}>
        ARTICLE<br />
        ID: {article.id}<br />
        TITLE: {article.title}<br />
        BODY: {article.body}<br />
      </div>)}
  </>
}