import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Clock, User, ChevronRight, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Blog | Minara Learn",
  description:
    "Explore our articles, tutorials, and insights on education, technology, and learning.",
};

// Mock blog data
const FEATURED_POST = {
  id: "1",
  title: "The Future of Learning: AI-Powered Education in 2024",
  excerpt:
    "Discover how artificial intelligence is transforming education and creating personalized learning experiences for students worldwide.",
  date: "April 15, 2024",
  readTime: "8 min read",
  author: {
    name: "Dr. Sarah Johnson",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  category: "Education Technology",
  image:
    "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  slug: "future-of-learning-ai-powered-education",
};

const BLOG_POSTS = [
  {
    id: "2",
    title: "10 Effective Study Techniques Based on Cognitive Science",
    excerpt:
      "Research-backed study methods to help you learn more efficiently and retain information longer.",
    date: "April 10, 2024",
    readTime: "6 min read",
    author: {
      name: "Michael Chen",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    category: "Study Tips",
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    slug: "effective-study-techniques-cognitive-science",
  },
  {
    id: "3",
    title: "How to Build an Effective Learning Routine",
    excerpt:
      "Creating a sustainable learning habit is key to mastering new skills. Here's how to design a routine that works for you.",
    date: "April 5, 2024",
    readTime: "5 min read",
    author: {
      name: "Emily Rodriguez",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    category: "Productivity",
    image:
      "https://images.unsplash.com/photo-1506784365847-bbad939e9335?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    slug: "build-effective-learning-routine",
  },
  {
    id: "4",
    title: "The Rise of Micro-Credentials: What You Need to Know",
    excerpt:
      "Smaller, focused certifications are changing the landscape of professional development. Learn why they matter.",
    date: "April 1, 2024",
    readTime: "7 min read",
    author: {
      name: "James Wilson",
      image: "https://randomuser.me/api/portraits/men/52.jpg",
    },
    category: "Career Development",
    image:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    slug: "rise-of-micro-credentials",
  },
  {
    id: "5",
    title: "Digital Wellness for Online Learners",
    excerpt:
      "Strategies to maintain your physical and mental health while learning online for extended periods.",
    date: "March 28, 2024",
    readTime: "4 min read",
    author: {
      name: "Dr. Sarah Johnson",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    category: "Health & Wellness",
    image:
      "https://images.unsplash.com/photo-1545205528-422527b83af9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    slug: "digital-wellness-online-learners",
  },
  {
    id: "6",
    title: "The Science of Motivation: Staying Engaged in Self-Paced Learning",
    excerpt:
      "Understanding the psychology behind motivation can help you stay consistent with your learning goals.",
    date: "March 25, 2024",
    readTime: "6 min read",
    author: {
      name: "Michael Chen",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    category: "Psychology",
    image:
      "https://images.unsplash.com/photo-1507490857-cbe2d2f15ee8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    slug: "science-of-motivation-self-paced-learning",
  },
];

const CATEGORIES = [
  "Education Technology",
  "Study Tips",
  "Productivity",
  "Career Development",
  "Health & Wellness",
  "Psychology",
  "Industry Insights",
  "Student Success Stories",
];

const TRENDING_TOPICS = [
  "Artificial Intelligence",
  "Remote Learning",
  "STEM Education",
  "Continuous Learning",
  "Digital Literacy",
  "Educational Psychology",
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">Minara Learn Blog</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
          Insights, guides, and expert perspectives on education, learning
          technologies, and professional development.
        </p>
        <div className="max-w-md mx-auto relative">
          <Input
            type="search"
            placeholder="Search articles..."
            className="pl-10 py-6 text-base"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
        </div>
      </div>

      {/* Featured Post */}
      <section className="mb-20">
        <Link href={`/blog/${FEATURED_POST.slug}`} className="block">
          <div className="group relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10" />
            <div className="relative aspect-[21/9] w-full">
              <Image
                src={FEATURED_POST.image}
                fill
                alt={FEATURED_POST.title}
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                priority
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-20">
              <Badge className="mb-4 bg-blue-600 hover:bg-blue-700">
                {FEATURED_POST.category}
              </Badge>
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 group-hover:text-blue-200 transition-colors">
                {FEATURED_POST.title}
              </h2>
              <p className="text-white/90 max-w-3xl mb-6 hidden md:block">
                {FEATURED_POST.excerpt}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                    <Image
                      src={FEATURED_POST.author.image}
                      width={40}
                      height={40}
                      alt={FEATURED_POST.author.name}
                      className="object-cover"
                    />
                  </div>
                  <span className="text-white/90">
                    {FEATURED_POST.author.name}
                  </span>
                </div>
                <div className="flex items-center text-white/70">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{FEATURED_POST.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {/* Blog Posts Grid */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {BLOG_POSTS.map((post) => (
              <Card
                key={post.id}
                className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={post.image}
                    fill
                    alt={post.title}
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-6">
                  <Badge variant="outline" className="mb-2">
                    {post.category}
                  </Badge>
                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <Image
                          src={post.author.image}
                          width={32}
                          height={32}
                          alt={post.author.name}
                          className="object-cover"
                        />
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {post.author.name}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-slate-500">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 px-6 pb-6">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                  >
                    Read More <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Button>Load More Articles</Button>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          {/* Categories */}
          <div>
            <h3 className="text-xl font-bold mb-4">Categories</h3>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
              <ul className="space-y-3">
                {CATEGORIES.map((category, i) => (
                  <li key={i}>
                    <Link
                      href={`/blog/category/${category
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      className="flex items-center justify-between text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      <span>{category}</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Trending Topics */}
          <div>
            <h3 className="text-xl font-bold mb-4">Trending Topics</h3>
            <div className="flex flex-wrap gap-2">
              {TRENDING_TOPICS.map((topic, i) => (
                <Link
                  key={i}
                  href={`/blog/tag/${topic.toLowerCase().replace(/\s+/g, "-")}`}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-sm hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-colors"
                >
                  {topic}
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-2">
              Subscribe to Our Newsletter
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Get the latest articles, resources, and updates delivered to your
              inbox.
            </p>
            <form className="space-y-3">
              <Input type="email" placeholder="Your email address" required />
              <Button className="w-full">
                Subscribe <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Featured Authors */}
          <div>
            <h3 className="text-xl font-bold mb-4">Featured Authors</h3>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
              <div className="space-y-4">
                {[...new Set(BLOG_POSTS.map((post) => post.author.name))].map(
                  (authorName, i) => {
                    const author = BLOG_POSTS.find(
                      (post) => post.author.name === authorName
                    ).author;
                    return (
                      <Link
                        key={i}
                        href={`/blog/author/${authorName
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                        className="flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-700 p-2 rounded-lg transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <Image
                            src={author.image}
                            width={40}
                            height={40}
                            alt={author.name}
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{author.name}</div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            {
                              BLOG_POSTS.filter(
                                (post) => post.author.name === author.name
                              ).length
                            }{" "}
                            Articles
                          </div>
                        </div>
                      </Link>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* CTA Section */}
      <section className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 md:p-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Share Your Knowledge</h2>
          <p className="text-white/90 mb-6">
            Are you an expert in education, learning, or professional
            development? We're looking for contributors to share their insights
            with our community.
          </p>
          <Button variant="secondary" size="lg">
            Become a Contributor
          </Button>
        </div>
      </section>
      </div>
    </div>
  );
}
