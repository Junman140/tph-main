"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { Share2, Tag, Clock, User, Heart, ThumbsUp, Wow, Sad, Angry } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { useAuth } from "@clerk/nextjs"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { useMutation } from "convex/react"
import { toast } from "sonner"
import Image from "next/image"

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const { userId, isSignedIn } = useAuth()
  const [comment, setComment] = useState("")
  const post = useQuery(api.blog.getPostBySlug, { slug: params.slug })
  const addComment = useMutation(api.blog.addComment)
  const addReaction = useMutation(api.blog.addReaction)
  const removeReaction = useMutation(api.blog.removeReaction)

  if (post === undefined) {
    return <div>Loading...</div>
  }

  if (post === null) {
    notFound()
  }

  const handleComment = async () => {
    if (!comment.trim()) return
    try {
      await addComment({ postId: post._id, content: comment })
      setComment("")
      toast.success("Comment added successfully")
    } catch (error) {
      toast.error("Failed to add comment")
    }
  }

  const handleReaction = async (type: "like" | "love" | "wow" | "sad" | "angry") => {
    try {
      const userReaction = post.reactions.find(r => r.userId === userId)
      if (userReaction?.type === type) {
        await removeReaction({ postId: post._id })
      } else {
        await addReaction({ postId: post._id, type })
      }
    } catch (error) {
      toast.error("Failed to add reaction")
    }
  }

  const getReactionCount = (type: string) => {
    return post.reactions.filter(r => r.type === type).length
  }

  const sharePost = () => {
    const text = `${post.title} - ${post.authorName}`
    const url = window.location.href
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text,
        url,
      })
    } else {
      navigator.clipboard.writeText(`${text}\n${url}`)
      alert("Post link copied to clipboard!")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {post.imageUrl && (
          <div className="relative h-64 mb-8">
            <Image
              src={post.imageUrl}
              alt={post.title}
              width={800}
              height={400}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-3xl font-bold">{post.title}</CardTitle>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {post.authorName}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {post.readingTime} min read
                  </span>
                  <span>
                    {format(new Date(post.publishedAt), "MMMM d, yyyy")}
                  </span>
                </div>
              </div>
              <Button onClick={sharePost} variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            <div className="mt-8 pt-6 border-t">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Reactions */}
            <div className="flex items-center gap-4 mt-8 border-t pt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleReaction("like")}
                className={post.reactions.find(r => r.userId === userId && r.type === "like") ? "text-blue-500" : ""}
              >
                <ThumbsUp className="w-4 h-4 mr-2" />
                {getReactionCount("like")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleReaction("love")}
                className={post.reactions.find(r => r.userId === userId && r.type === "love") ? "text-red-500" : ""}
              >
                <Heart className="w-4 h-4 mr-2" />
                {getReactionCount("love")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleReaction("wow")}
                className={post.reactions.find(r => r.userId === userId && r.type === "wow") ? "text-yellow-500" : ""}
              >
                <Wow className="w-4 h-4 mr-2" />
                {getReactionCount("wow")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleReaction("sad")}
                className={post.reactions.find(r => r.userId === userId && r.type === "sad") ? "text-blue-500" : ""}
              >
                <Sad className="w-4 h-4 mr-2" />
                {getReactionCount("sad")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleReaction("angry")}
                className={post.reactions.find(r => r.userId === userId && r.type === "angry") ? "text-red-500" : ""}
              >
                <Angry className="w-4 h-4 mr-2" />
                {getReactionCount("angry")}
              </Button>
            </div>

            {/* Comments */}
            <div className="mt-8 border-t pt-4">
              <h3 className="text-lg font-semibold mb-4">Comments</h3>
              {isSignedIn ? (
                <div className="mb-4">
                  <Textarea
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="mb-2"
                  />
                  <Button onClick={handleComment}>Post Comment</Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mb-4">
                  Please sign in to leave a comment
                </p>
              )}
              <div className="space-y-4">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <Avatar>
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.userName}`} />
                      <AvatarFallback>{comment.userName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{comment.userName}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                      </p>
                      <p className="mt-1">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 