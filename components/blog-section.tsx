"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Calendar, User } from "lucide-react"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  hero_image: string | null
  category: string
  publishedAt: string
  author: string
  slug: string
  createdAt: string
}

export default function BlogSection() {
  const [hoveredPost, setHoveredPost] = useState<string | null>(null)
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch('/api/blog')
        if (response.ok) {
          const posts = await response.json()
          setBlogPosts(posts.slice(0, 3)) // Show only first 3 posts
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogPosts()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <section className="py-24 md:py-32 bg-[#f9f6f1]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
          <div>
            <span className="text-[#aa9578] font-montserrat text-sm uppercase tracking-widest mb-4 block">
              Resources
            </span>
            <h2 className="font-tenor-sans text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-4">Insights & Articles</h2>
            <p className="text-gray-700 max-w-xl font-light">
              Stay informed with the latest trends, tips, and insights in Toronto's luxury real estate market.
            </p>
          </div>
          <Link
            href="/blog"
            className="mt-6 md:mt-0 inline-flex items-center text-[#473729] hover:text-[#3a9aa7] font-medium transition-colors"
          >
            <span className="mr-2">View all articles</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div className="aspect-[16/9] bg-gray-200 rounded-2xl mb-6"></div>
                <div className="px-2">
                  <div className="h-4 bg-gray-200 rounded mb-3"></div>
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
                onMouseEnter={() => setHoveredPost(post.id)}
                onMouseLeave={() => setHoveredPost(null)}
              >
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="relative aspect-[16/9] overflow-hidden rounded-2xl mb-6">
                    <Image
                      src={post.hero_image || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      className={`object-cover transition-transform duration-700 ${
                        hoveredPost === post.id ? "scale-105" : "scale-100"
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-70"></div>
                    <div className="absolute bottom-0 left-0 p-6">
                      <span className="inline-block bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-1 rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <div className="flex items-center mr-4">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        <span>{post.author}</span>
                      </div>
                    </div>

                    <h3 className="font-tenor-sans text-2xl text-gray-900 mb-3 group-hover:text-[#473729] transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-700 font-light mb-4">{post.excerpt}</p>
                    <div className="inline-flex items-center text-[#473729] font-medium">
                      <span className="mr-2">Read more</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
