"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Calendar, User, Share2, Facebook, Twitter, Linkedin } from "lucide-react"
import TopNavMenu from "@/components/top-nav-menu"
import SiteFooter from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import ReactMarkdown from 'react-markdown'
import ResponsiveLogo from "@/components/responsive-logo"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  author: string
  publishedAt: string
  hero_image: string | null
  createdAt: string
  meta_title?: string
  meta_description?: string
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog/${params.slug}`)
        if (response.ok) {
          const data = await response.json()
          setPost(data)
        } else if (response.status === 404) {
          setNotFound(true)
        }
      } catch (error) {
        console.error('Error fetching blog post:', error)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [params.slug])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareTitle = post?.title || ''

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="w-full py-6 px-6 bg-white">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div>
              <Link href="/">
                <ResponsiveLogo variant="color" />
              </Link>
            </div>
            <TopNavMenu />
          </div>
        </div>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-8 w-1/3"></div>
              <div className="aspect-[16/9] bg-gray-200 rounded-2xl mb-8"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (notFound || !post) {
    return (
      <main className="min-h-screen bg-white">
        <div className="w-full py-6 px-6 bg-white">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div>
              <Link href="/">
                <ResponsiveLogo variant="color" />
              </Link>
            </div>
            <TopNavMenu />
          </div>
        </div>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="font-tenor-sans text-4xl text-gray-900 mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-8">The article you're looking for doesn't exist or has been removed.</p>
            <Link href="/blog" className="inline-flex items-center text-[#aa9578] hover:text-[#473729] transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Top Navigation */}
      <div className="w-full py-6 px-6 bg-white">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <Link href="/">
              <ResponsiveLogo variant="color" />
            </Link>
          </div>
          <TopNavMenu />
        </div>
      </div>

      {/* Back Button */}
      <div className="container mx-auto px-4 pt-8">
        <Link
          href="/blog"
          className="inline-flex items-center text-[#aa9578] hover:text-[#473729] transition-colors font-manrope"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Link>
      </div>

      {/* Article Header */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-6">
                <span className="inline-block bg-[#aa9578] text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                  {post.category}
                </span>
                <h1 className="font-tenor-sans text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6 leading-tight">
                  {post.title}
                </h1>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center text-gray-600">
                    <div className="flex items-center mr-6">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      <span>{post.author}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Share2 className="h-4 w-4 text-gray-600 mr-2" />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')}
                    >
                      <Facebook className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`, '_blank')}
                    >
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank')}
                    >
                      <Linkedin className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Hero Image */}
      {post.hero_image && (
        <section className="pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative aspect-[16/9] rounded-2xl overflow-hidden"
              >
                <Image
                  src={post.hero_image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Article Content */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="prose prose-lg max-w-none prose-headings:font-tenor-sans prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-[#aa9578] prose-a:hover:text-[#473729] prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700"
            >
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-[#f9f6f1]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="font-tenor-sans text-3xl md:text-4xl text-gray-900 mb-6">
                Ready to Explore Toronto's Luxury Real Estate?
              </h2>
              <p className="text-gray-700 text-lg mb-8 max-w-2xl mx-auto">
                Get personalized insights and exclusive access to Toronto's most prestigious properties.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  className="bg-[#aa9578] hover:bg-[#8a7a63] text-white rounded-full px-8 py-6 text-lg"
                >
                  <Link href="/contact">Schedule Consultation</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-[#aa9578] text-[#aa9578] hover:bg-[#aa9578] hover:text-white rounded-full px-8 py-6 text-lg"
                >
                  <Link href="/listings">View Properties</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
} 