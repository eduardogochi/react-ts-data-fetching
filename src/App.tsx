import { ReactNode, useEffect, useState } from 'react'

import BlogPosts, { BlogPost } from './components/BlogPosts'
import { get } from './util/http'
import fetchImg from './assets/data-fetching.png'
import { z } from 'zod'
import ErrorMessage from './components/ErrorMessage'

const rawDataBlogPostSchema = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
  userId: z.number()
})

const expectedResponseDataSchema = z.array(rawDataBlogPostSchema)

function App() {
  const [fetchedPosts, setFetchedPosts] = useState<BlogPost[]>()
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState<string>()

  useEffect(() => {
    async function fetchPosts() {
      setIsFetching(true)
      try {

        const data = (await get('https://jsonplaceholder.typicode.com/posts', z.array(rawDataBlogPostSchema)))
        const parsedData = expectedResponseDataSchema.parse(data)

        const blogPosts: BlogPost[] = parsedData.map((rawPost) => {
          return {
            id: rawPost.id,
            title: rawPost.title,
            text: rawPost.body
          }
        })
        setIsFetching(false)
        setFetchedPosts(blogPosts)

      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        }

      }
    }

    fetchPosts()
  }, [])

  let content: ReactNode

  if (error) {
    content = <ErrorMessage text={error} />
  } else if (isFetching) {
    content = <p id='loading-fallback'>Fetching posts...</p>
  }

  if (fetchedPosts) {
    content = <BlogPosts posts={fetchedPosts} />
  }


  return <main>
    <img src={fetchImg} alt='img' />
    {content}
  </main>
}

export default App