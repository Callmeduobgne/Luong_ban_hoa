'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ArrowLeft, Share2, FileText, User, Clock, ArrowRight, Eye } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5003";

interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  featured_image: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

interface BlogResponse {
  success: boolean;
  data: {
    blog: Blog;
  };
}

interface RelatedBlogsResponse {
  success: boolean;
  data: {
    blogs: Blog[];
  };
}

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [readingTime, setReadingTime] = useState(0);

  const blogId = params.id as string;

  // Calculate reading time (average 200 words per minute)
  const calculateReadingTime = (content: string) => {
    const textContent = content.replace(/<[^>]*>/g, '');
    const wordCount = textContent.split(/\s+/).length;
    return Math.ceil(wordCount / 200);
  };

  // Fetch blog details
  const fetchBlog = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await fetch(`${API_URL}/api/blogs/${blogId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError("Bài viết không tồn tại");
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return;
      }
      
      const data: BlogResponse = await response.json();
      
      if (data.success && data.data.blog) {
        const blogData = data.data.blog;
        setBlog(blogData);
        setReadingTime(calculateReadingTime(blogData.content));
        
        // Fetch related blogs
        fetchRelatedBlogs();
      } else {
        setError("Không thể tải bài viết");
      }
    } catch (error: any) {
      console.error('Error fetching blog:', error);
      setError("Lỗi khi tải bài viết: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch related blogs
  const fetchRelatedBlogs = async () => {
    try {
      const response = await fetch(`${API_URL}/api/blogs?limit=3&published=true&exclude=${blogId}`);
      
      if (response.ok) {
        const data: RelatedBlogsResponse = await response.json();
        if (data.success && data.data.blogs) {
          setRelatedBlogs(data.data.blogs);
        }
      }
    } catch (error) {
      console.error('Error fetching related blogs:', error);
    }
  };

  useEffect(() => {
    if (blogId) {
      fetchBlog();
    }
  }, [blogId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = () => {
    if (navigator.share && blog) {
      navigator.share({
        title: blog.title,
        text: blog.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      alert('Link đã được copy vào clipboard!');
    }
  };

  const truncateContent = (content: string, maxLength: number) => {
    const textContent = content.replace(/<[^>]*>/g, '');
    if (textContent.length <= maxLength) return textContent;
    return textContent.substr(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="h-12 bg-gray-200 rounded animate-pulse mb-6"></div>
            <div className="flex space-x-4 mb-6">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-24"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
            </div>
          </div>
          
          {/* Image Skeleton */}
          <div className="h-96 bg-gray-200 rounded-xl animate-pulse mb-8"></div>
          
          {/* Content Skeleton */}
          <div className="space-y-4">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="h-4 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-purple-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error === "Bài viết không tồn tại" ? "Bài viết không tồn tại" : "Có lỗi xảy ra"}
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex space-x-4 justify-center">
            <button
              onClick={() => router.back()}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Quay lại
            </button>
            <Link
              href="/blog"
              className="px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
            >
              Xem tất cả blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation */}
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center text-gray-600 hover:text-rose-600 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Quay lại
            </button>
            <span className="text-gray-300">|</span>
            <Link
              href="/blog"
              className="text-gray-600 hover:text-rose-600 transition-colors"
            >
              Tất cả bài viết
            </Link>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {blog.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              <span>{formatDate(blog.created_at)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span>{readingTime} phút đọc</span>
            </div>
            <div className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              <span>No.07 Floral</span>
            </div>
          </div>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Chia sẻ
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Image */}
        {blog.featured_image && (
          <div className="relative h-96 md:h-[500px] rounded-xl overflow-hidden shadow-2xl mb-12">
            <Image
              src={blog.featured_image}
              alt={blog.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        )}

        {/* Article Content */}
        <article className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-12">
          {/* Excerpt */}
          {blog.excerpt && (
            <div className="bg-gray-50 border-l-4 border-rose-500 p-6 mb-8 rounded-r-lg">
              <p className="text-lg text-gray-700 italic leading-relaxed">
                {blog.excerpt}
              </p>
            </div>
          )}

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Updated Date */}
          {blog.updated_at !== blog.created_at && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Cập nhật lần cuối: {formatDate(blog.updated_at)}
              </p>
            </div>
          )}
        </article>

        {/* Related Posts */}
        {relatedBlogs.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Bài viết liên quan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((relatedBlog) => (
                <Link
                  key={relatedBlog.id}
                  href={`/blog/${relatedBlog.id}`}
                  className="group"
                >
                  <article className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
                    {relatedBlog.featured_image && (
                      <div className="relative h-32 overflow-hidden">
                        <Image
                          src={relatedBlog.featured_image}
                          alt={relatedBlog.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 300px"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-rose-600 transition-colors">
                        {relatedBlog.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {relatedBlog.excerpt || truncateContent(relatedBlog.content, 100)}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{formatDate(relatedBlog.created_at)}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to Blog List */}
        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <Eye className="w-5 h-5" />
            Xem thêm bài viết khác
          </Link>
        </div>
      </div>
    </div>
  );
} 