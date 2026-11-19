import type { Request, Response } from "express"

export interface CommunityAuthor {
  name: string
  district: string
  role: "farmer" | "progressive_farmer" | "agronomist" | "officer"
  avatar?: string
  verified?: boolean
  mobile?: string
}

export interface CommunityAnswer {
  id: string
  questionId: string
  author: CommunityAuthor
  content: string
  image?: string
  upvotes: number
  isUpvoted?: boolean
  createdAt: string
}

export interface CommunityQuestion {
  id: string
  title: string
  description: string
  crop: string
  district: string
  images: string[]
  author: CommunityAuthor
  upvotes: number
  isUpvoted?: boolean
  answersCount: number
  answers: CommunityAnswer[]
  createdAt: string
}

export interface CommunityBlog {
  id: string
  title: string
  content: string
  coverImage: string
  crop: string
  district: string
  author: CommunityAuthor
  readTime: string
  likes: number
  isLiked?: boolean
  createdAt: string
}

// In-Memory state for KrushikaDhara FarmerConnect
let questionsStore: CommunityQuestion[] = [
  {
    id: "q-tomato-early-blight-101",
    title: "Dark concentric ring spots on lower leaves of Tomato. Is it Early Blight?",
    description:
      "Noticed brownish circular spots with target-like rings on lower leaves after recent rainfall in Srinivasapur. Plants are 40 days old. Leaf margins are yellowing and drying up. What is the recommended treatment to protect fruiting?",
    crop: "Tomato",
    district: "Kolar",
    images: [
      "https://images.unsplash.com/photo-1592417817098-8f3d6eb22501?w=800",
      "https://images.unsplash.com/photo-1597916829826-02e5bb4a54e0?w=800",
    ],
    author: {
      name: "Ramesh Gowda",
      district: "Kolar",
      role: "progressive_farmer",
      verified: true,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    },
    upvotes: 24,
    isUpvoted: false,
    answersCount: 2,
    createdAt: "2 hours ago",
    answers: [
      {
        id: "ans-101-1",
        questionId: "q-tomato-early-blight-101",
        author: {
          name: "Dr. B. N. Harish",
          district: "Bengaluru Rural",
          role: "agronomist",
          verified: true,
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        },
        content:
          "This is characteristic Early Blight (Alternaria solani). 1) Prune bottom infected leaves. 2) Spray Mancozeb 75% WP @ 2g/L or Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1 ml/L. 3) For organic management, use Trichoderma harzianum @ 5g/L.",
        upvotes: 18,
        isUpvoted: false,
        createdAt: "1 hour ago",
      },
      {
        id: "ans-101-2",
        questionId: "q-tomato-early-blight-101",
        author: {
          name: "Suresh Patil",
          district: "Chikkaballapura",
          role: "farmer",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
        },
        content:
          "I faced this last season. Make sure not to do overhead sprinkler watering. Switching to drip irrigation and clearing bottom leaves gave me complete control.",
        upvotes: 9,
        isUpvoted: false,
        createdAt: "45 mins ago",
      },
    ],
  },
  {
    id: "q-ragi-blast-102",
    title: "Finger blast neck rot showing up during earhead emergence in ML-365 Ragi",
    description:
      "During the current panicle emergence stage, brownish spindle-shaped lesions appeared on the rachis and fingers. Weather has been cool and misty in Maddur. Need immediate curative advice.",
    crop: "Ragi",
    district: "Mandya",
    images: [
      "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800",
    ],
    author: {
      name: "Manjunatha K.",
      district: "Mandya",
      role: "farmer",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    },
    upvotes: 31,
    isUpvoted: false,
    answersCount: 1,
    createdAt: "5 hours ago",
    answers: [
      {
        id: "ans-102-1",
        questionId: "q-ragi-blast-102",
        author: {
          name: "Dr. Suma Murthy",
          district: "Mandya",
          role: "agronomist",
          verified: true,
          avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
        },
        content:
          "Spray Tricyclazole 75% WP @ 0.6 g/L or Kasugamycin 3% SL @ 2 ml/L at 50% earhead emergence. If practicing natural farming, apply Panchagavya 3% spray combined with Pseudomonas fluorescens 10g/L.",
        upvotes: 22,
        isUpvoted: false,
        createdAt: "3 hours ago",
      },
    ],
  },
  {
    id: "q-coconut-beetle-103",
    title: "V-shaped cuts on coconut fronds and bore holes at crown base in Tiptur",
    description:
      "Found multiple 5-year coconut palms with geometric V-cut leaflets and chewed fibrous frass outside the leaf axil. How to manage Rhinoceros beetle sustainably without toxic sprays?",
    crop: "Coconut",
    district: "Tumakuru",
    images: [
      "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800",
    ],
    author: {
      name: "Chethan Kumar",
      district: "Tumakuru",
      role: "progressive_farmer",
      verified: true,
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
    },
    upvotes: 19,
    isUpvoted: false,
    answersCount: 2,
    createdAt: "1 day ago",
    answers: [
      {
        id: "ans-103-1",
        questionId: "q-coconut-beetle-103",
        author: {
          name: "S. R. Lingaraju",
          district: "Tumakuru",
          role: "officer",
          verified: true,
          avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150",
        },
        content:
          "Pack the innermost 2-3 leaf axils with a mixture of Neem cake (200g) and sand (200g). Hook out beetles using a flexible iron hook. Install Rhinolure pheromone traps @ 2 traps per acre.",
        upvotes: 16,
        isUpvoted: false,
        createdAt: "20 hours ago",
      },
    ],
  },
]

let blogsStore: CommunityBlog[] = [
  {
    id: "blog-sugarcane-fertigation",
    title: "Complete Guide to Drip Fertigation & Water Scheduling in Sugarcane",
    content:
      "Subsurface drip irrigation in Karnataka's Cauvery and Krishna basins saves up to 40% water while increasing cane yield from 45 tonnes to 75 tonnes per acre. Apply Urea, White Potash, and 19-19-19 in split doses weekly along with irrigation cycles...",
    coverImage: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=900",
    crop: "Sugarcane",
    district: "Mandya",
    author: {
      name: "Dr. Mahadevaiah",
      district: "Mandya",
      role: "agronomist",
      verified: true,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    },
    readTime: "4 min read",
    likes: 88,
    isLiked: false,
    createdAt: "Yesterday",
  },
  {
    id: "blog-chilli-thrips-organic",
    title: "Organic Management of Sucking Pests & Leaf Curl in Chilli and Capsicum",
    content:
      "Upward curling of leaves indicates thrips attack, while downward curling is caused by mites. Installing 15 blue sticky traps for thrips and 15 yellow sticky traps for whiteflies per acre drastically curbs viral spread without toxic chemicals...",
    coverImage: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=900",
    crop: "Chilli",
    district: "Haveri",
    author: {
      name: "Smt. Roopa K.",
      district: "Haveri",
      role: "officer",
      verified: true,
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
    },
    readTime: "5 min read",
    likes: 64,
    isLiked: false,
    createdAt: "3 days ago",
  },
]

/**
 * GET /api/community/questions
 */
export function getCommunityQuestions(req: Request, res: Response) {
  const { crop, district, search, mobile } = req.query as Record<string, string>

  let results = [...questionsStore]

  if (crop && crop !== "All") {
    results = results.filter((q) => q.crop.toLowerCase() === crop.toLowerCase())
  }
  if (district && district !== "All") {
    results = results.filter((q) => q.district.toLowerCase() === district.toLowerCase())
  }
  if (search && search.trim()) {
    const s = search.toLowerCase()
    results = results.filter(
      (q) =>
        q.title.toLowerCase().includes(s) ||
        q.description.toLowerCase().includes(s) ||
        q.crop.toLowerCase().includes(s)
    )
  }
  if (mobile) {
    // If querying specific user's questions
    results = results.filter((q) => q.author.mobile === mobile)
  }

  return res.json({
    success: true,
    count: results.length,
    questions: results,
  })
}

/**
 * GET /api/community/questions/:id
 */
export function getCommunityQuestionById(req: Request, res: Response) {
  const { id } = req.params
  const found = questionsStore.find((q) => q.id === id)
  if (!found) {
    return res.status(404).json({
      success: false,
      error: "Question not found",
    })
  }
  return res.json({
    success: true,
    question: found,
  })
}

/**
 * POST /api/community/questions
 */
export function createCommunityQuestion(req: Request, res: Response) {
  const { title, description, crop, district, images, authorName, mobile, role } = req.body || {}

  if (!title || !description || !crop || !district) {
    return res.status(400).json({
      success: false,
      error: "Title, description, crop, and district are required",
    })
  }

  const newQuestion: CommunityQuestion = {
    id: `q-${Date.now()}`,
    title: String(title).trim(),
    description: String(description).trim(),
    crop: String(crop).trim(),
    district: String(district).trim(),
    images: Array.isArray(images) ? images : [],
    author: {
      name: authorName || "Farmer Member",
      district: String(district).trim(),
      role: role || "farmer",
      mobile: mobile,
      verified: false,
    },
    upvotes: 0,
    isUpvoted: false,
    answersCount: 0,
    answers: [],
    createdAt: "Just now",
  }

  questionsStore.unshift(newQuestion)

  return res.status(201).json({
    success: true,
    question: newQuestion,
  })
}

/**
 * POST /api/community/questions/:id/upvote
 */
export function upvoteCommunityQuestion(req: Request, res: Response) {
  const { id } = req.params
  const idx = questionsStore.findIndex((q) => q.id === id)
  if (idx < 0) {
    return res.status(404).json({ success: false, error: "Question not found" })
  }

  const q = questionsStore[idx]
  const nextIsUpvoted = !q.isUpvoted
  const nextVotes = nextIsUpvoted ? q.upvotes + 1 : Math.max(0, q.upvotes - 1)
  const updated = { ...q, isUpvoted: nextIsUpvoted, upvotes: nextVotes }
  questionsStore[idx] = updated

  return res.json({
    success: true,
    question: updated,
  })
}

/**
 * POST /api/community/questions/:id/answers
 */
export function createCommunityAnswer(req: Request, res: Response) {
  const { id } = req.params
  const { content, authorName, district, role, image, mobile } = req.body || {}

  const idx = questionsStore.findIndex((q) => q.id === id)
  if (idx < 0) {
    return res.status(404).json({ success: false, error: "Question not found" })
  }

  if (!content || !String(content).trim()) {
    return res.status(400).json({ success: false, error: "Answer content cannot be empty" })
  }

  const q = questionsStore[idx]
  const newAnswer: CommunityAnswer = {
    id: `ans-${Date.now()}`,
    questionId: id,
    content: String(content).trim(),
    author: {
      name: authorName || "Farmer",
      district: district || q.district,
      role: role || "farmer",
      mobile: mobile,
      verified: role === "agronomist" || role === "officer",
    },
    image: image,
    upvotes: 0,
    isUpvoted: false,
    createdAt: "Just now",
  }

  const updatedAnswers = [...(q.answers || []), newAnswer]
  questionsStore[idx] = {
    ...q,
    answers: updatedAnswers,
    answersCount: updatedAnswers.length,
  }

  return res.status(201).json({
    success: true,
    answer: newAnswer,
    question: questionsStore[idx],
  })
}

/**
 * POST /api/community/answers/:answerId/upvote
 */
export function upvoteCommunityAnswer(req: Request, res: Response) {
  const { answerId } = req.params
  const { questionId } = req.body || {}

  for (let i = 0; i < questionsStore.length; i++) {
    const q = questionsStore[i]
    if (questionId && q.id !== questionId) continue

    const aIdx = (q.answers || []).findIndex((a) => a.id === answerId)
    if (aIdx >= 0) {
      const ans = q.answers[aIdx]
      const nextUpvoted = !ans.isUpvoted
      const nextVotes = nextUpvoted ? ans.upvotes + 1 : Math.max(0, ans.upvotes - 1)
      const updatedAns = { ...ans, isUpvoted: nextUpvoted, upvotes: nextVotes }

      const newAnswers = [...q.answers]
      newAnswers[aIdx] = updatedAns
      questionsStore[i] = { ...q, answers: newAnswers }

      return res.json({
        success: true,
        answer: updatedAns,
      })
    }
  }

  return res.status(404).json({ success: false, error: "Answer not found" })
}

/**
 * GET /api/community/blogs
 */
export function getCommunityBlogs(req: Request, res: Response) {
  const { crop, district } = req.query as Record<string, string>
  let results = [...blogsStore]

  if (crop && crop !== "All") {
    results = results.filter((b) => b.crop.toLowerCase() === crop.toLowerCase())
  }
  if (district && district !== "All") {
    results = results.filter((b) => b.district.toLowerCase() === district.toLowerCase())
  }

  return res.json({
    success: true,
    count: results.length,
    blogs: results,
  })
}

/**
 * POST /api/community/blogs/:id/like
 */
export function likeCommunityBlog(req: Request, res: Response) {
  const { id } = req.params
  const idx = blogsStore.findIndex((b) => b.id === id)
  if (idx < 0) {
    return res.status(404).json({ success: false, error: "Blog not found" })
  }

  const b = blogsStore[idx]
  const nextIsLiked = !b.isLiked
  const nextLikes = nextIsLiked ? b.likes + 1 : Math.max(0, b.likes - 1)
  const updated = { ...b, isLiked: nextIsLiked, likes: nextLikes }
  blogsStore[idx] = updated

  return res.json({
    success: true,
    blog: updated,
  })
}
