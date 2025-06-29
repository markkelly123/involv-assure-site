import Head from 'next/head'
import Link from 'next/link'
import { GetStaticProps, GetStaticPaths } from 'next'
import { PortableText } from '@portabletext/react'
import { getPost, getPosts, Post, buildImageUrl, calculateReadingTime } from '../../../lib/sanity'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'

interface PostPageProps {
  post: Post
}

export default function PostPage({ post }: PostPageProps) {
  if (!post) {
    return <div>Post not found</div>
  }

  const readingTime = post.estimatedReadingTime || calculateReadingTime(post.body)

  return (
    <>
      <Head>
        <title>{post.title} - Assure</title>
        <meta name="description" content={post.excerpt || `Read ${post.title} on Assure`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || `Read ${post.title} on Assure`} />
        {post.mainImage?.asset?.url && (
          <meta property="og:image" content={buildImageUrl(post.mainImage.asset.url, 1200, 630, 80)} />
        )}
        <meta property="og:type" content="article" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt || `Read ${post.title} on Assure`} />
        {post.mainImage?.asset?.url && (
          <meta name="twitter:image" content={buildImageUrl(post.mainImage.asset.url, 1200, 630, 80)} />
        )}
      </Head>

      <div className="bg-white text-gray-900 font-sans min-h-screen">
        {/* Navigation Component */}
        <Navigation />

        <article className="max-w-4xl mx-auto px-4 py-12">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link href="/insights" className="text-blue-600 hover:text-blue-700 text-sm">
              ← Back to Insights
            </Link>
          </nav>

          {/* Main Image */}
          {post.mainImage?.asset?.url && (
            <div className="aspect-video w-full bg-gray-200 rounded-lg overflow-hidden mb-8">
              <img 
                src={buildImageUrl(post.mainImage.asset.url, 1200, 675, 80)} 
                alt={post.mainImage.alt || post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Header */}
          <header className="mb-8">
            {/* Categories */}
            {post.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.categories.map((category) => (
                  <span key={category._id} className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {category.title}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">{post.title}</h1>
            
            {post.excerpt && (
              <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>
            )}

            {/* Author and Meta */}
            <div className="flex items-center justify-between py-6 border-t border-b border-gray-200">
              <div className="flex items-center">
                {/* Author Avatar */}
                {post.author?.image?.asset?.url ? (
                  <img 
                    src={buildImageUrl(post.author.image.asset.url, 48, 48, 80)} 
                    alt={post.author.image.alt || post.author.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mr-4">
                    <span className="text-lg font-medium text-white">
                      {post.author?.name?.charAt(0).toUpperCase() || '?'}
                    </span>
                  </div>
                )}
                
                <div>
                  <p className="font-medium text-gray-900">
                    {post.author?.name || 'Unknown Author'}
                  </p>
                  {post.author?.role && (
                    <p className="text-sm text-gray-600">{post.author.role}</p>
                  )}
                </div>
              </div>
              
              <div className="text-right text-sm text-gray-600">
                <p>{new Date(post.publishedAt).toLocaleDateString('en-AU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}</p>
                <p>{readingTime} min read</p>
              </div>
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none mb-8">
            <PortableText 
              value={post.body} 
              components={{
                block: {
                  normal: ({children}) => <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>,
                  h1: ({children}) => <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900">{children}</h1>,
                  h2: ({children}) => <h2 className="text-2xl font-bold mt-6 mb-3 text-gray-900">{children}</h2>,
                  h3: ({children}) => <h3 className="text-xl font-bold mt-4 mb-2 text-gray-900">{children}</h3>,
                  blockquote: ({children}) => (
                    <blockquote className="border-l-4 border-blue-500 pl-4 my-6 italic text-gray-600 bg-blue-50 py-2">
                      {children}
                    </blockquote>
                  ),
                },
                list: {
                  bullet: ({children}) => <ul className="list-disc list-inside mb-4 text-gray-700">{children}</ul>,
                  number: ({children}) => <ol className="list-decimal list-inside mb-4 text-gray-700">{children}</ol>,
                },
                listItem: {
                  bullet: ({children}) => <li className="mb-1">{children}</li>,
                  number: ({children}) => <li className="mb-1">{children}</li>,
                },
                marks: {
                  strong: ({children}) => <strong className="font-bold text-gray-900">{children}</strong>,
                  em: ({children}) => <em className="italic">{children}</em>,
                  link: ({children, value}) => (
                    <a href={value.href} className="text-blue-600 hover:text-blue-700 underline" target="_blank" rel="noopener noreferrer">
                      {children}
                    </a>
                  ),
                },
              }}
            />
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Jurisdictions */}
          {post.jurisdictions && post.jurisdictions.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Jurisdictions</h3>
              <div className="flex flex-wrap gap-2">
                {post.jurisdictions.map((jurisdiction) => (
                  <span key={jurisdiction} className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-medium">
                    {jurisdiction.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="pt-8 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <Link href="/insights" className="text-blue-600 hover:text-blue-700 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                All Insights
              </Link>
              
              <div className="text-right">
                <Link href="/contact" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                  Get in Touch
                </Link>
              </div>
            </div>
          </div>
        </article>

        {/* Footer Component */}
        <Footer />
      </div>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Get all posts that include 'assure' in their sites array
  const posts = await getPosts('assure', 100) // Get more posts for paths
  
  const paths = posts.map((post) => ({
    params: { slug: post.slug.current }
  }))

  return {
    paths,
    fallback: 'blocking' // Enable ISR for new posts
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string
  
  if (!slug) {
    return { notFound: true }
  }

  try {
    const post = await getPost(slug)
    
    if (!post) {
      return { notFound: true }
    }

    // Check if this post is available for the 'assure' site
    if (!post.sites.includes('assure')) {
      return { notFound: true }
    }

    return {
      props: {
        post,
      },
      revalidate: 300, // Revalidate every 5 minutes
    }
  } catch (error) {
    console.error('Error fetching post:', error)
    return { notFound: true }
  }
}