import { ReactNode, useEffect, useState } from 'react'

import BlogPosts, { BlogPost } from './components/BlogPosts'
import { get } from './util/http'
import fetchImg from './assets/data-fetching.png'

type RawDataBlogPost = {
  id: number
  title: string
  body: string
  userId: number
}

function App() {
  const [fetchedPosts, setFetchedPosts] = useState<BlogPost[]>()

  useEffect(() => {
    async function fetchPosts() {
      const data = (await get('https://jsonplaceholder.typicode.com/posts')) as RawDataBlogPost[]

      const blogPosts: BlogPost[] = data.map((rawPost) => {
        return {
          id: rawPost.id,
          title: rawPost.title,
          text: rawPost.body
        }
      })

      setFetchedPosts(blogPosts)
    }

    fetchPosts()
  }, [])

  let content: ReactNode

  if (fetchedPosts) {
    content = <BlogPosts posts={fetchedPosts} />
  }

  return <main>
    <img src={fetchImg} alt='img' />
    {content}
  </main>
}

export default App