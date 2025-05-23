"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Calendar, User } from "lucide-react"

interface BlogPost {
  id: number
  title: string
  excerpt: string
  image: string
  category: string
  date: string
  author: string
  slug: string
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Toronto Real Estate Market Update: Trends and Forecasts for 2025",
    excerpt:
      "Discover the latest trends in Toronto's luxury real estate market, from emerging neighborhoods to investment opportunities and price forecasts for the coming year.",
    image: "/blog/1/hero.jpg",
    category: "Market Analysis",
    date: "May 20, 2025",
    author: "Pooya Pirayesh",
    slug: "toronto-real-estate-market-update",
  },
  {
    id: 2,
    title: "5 Interior Design Trends That Increase Your Property's Value",
    excerpt:
      "Learn which interior design choices can significantly boost your property's market value and appeal to luxury buyers in Toronto's competitive real estate market.",
    image: "/blog/2/hero.jpg",
    category: "Design & Architecture",
    date: "May 15, 2025",
    author: "Sarah Williams",
    slug: "interior-design-trends-property-value",
  },
  {
    id: 3,
    title: "The Ultimate Guide to Toronto's Most Exclusive Neighborhoods",
    excerpt:
      "Explore Toronto's most prestigious neighborhoods, from Rosedale to Yorkville, and discover what makes each area unique for luxury homebuyers and investors.",
    image: "/blog/3/hero.jpg",
    category: "Neighborhoods",
    date: "May 10, 2025",
    author: "Michael Chen",
    slug: "toronto-exclusive-neighborhoods-guide",
  },
]

export default function BlogSection() {
  const [hoveredPost, setHoveredPost] = useState<number | null>(null)

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: post.id * 0.1 }}
              viewport={{ once: true }}
              className="group"
              onMouseEnter={() => setHoveredPost(post.id)}
              onMouseLeave={() => setHoveredPost(null)}
            >
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="relative aspect-[16/9] overflow-hidden rounded-2xl mb-6">
                  <Image
                    src={post.image || "/placeholder.svg"}
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
                      <span>{post.date}</span>
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
      </div>
    </section>
  )
}
