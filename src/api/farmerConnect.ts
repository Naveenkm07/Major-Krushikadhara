import { API_BASE } from "./config"

export type CommunityRole = "farmer" | "progressive_farmer" | "agronomist" | "officer"

export interface CommunityAuthor {
  name: string
  district: string
  role: CommunityRole
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

// ---------------- SEED DATA (Authentic Karnataka Agriculture) ----------------

const SEED_QUESTIONS: CommunityQuestion[] = [
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
          "This is characteristic Early Blight (Alternaria solani). 1) Immediately prune and destroy bottom infected leaves to stop spore splash. 2) Spray Mancozeb 75% WP @ 2g/L or Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1 ml/L. 3) For organic management, foliar spray Trichoderma harzianum @ 5g/L with 0.5% neem oil.",
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
          "Finger blast spreads very quickly in cool humid conditions. Spray Tricyclazole 75% WP @ 0.6 g/L or Kasugamycin 3% SL @ 2 ml/L at 50% earhead emergence. If practicing natural farming, apply Panchagavya 3% spray combined with Pseudomonas fluorescens 10g/L.",
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
          "1) Pack the innermost 2-3 leaf axils with a mixture of Neem cake (200g) and sand (200g) or Naphthalene balls (3-4 balls covered with sand). 2) Hook out beetles using a flexible iron hook. 3) Install Rhinolure pheromone traps @ 2 traps per acre.",
        upvotes: 16,
        isUpvoted: false,
        createdAt: "20 hours ago",
      },
      {
        id: "ans-103-2",
        questionId: "q-coconut-beetle-103",
        author: {
          name: "Basavaraju",
          district: "Hassan",
          role: "farmer",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
        },
        content:
          "The neem cake + sand mix in leaf axils works wonders. We also treated nearby cow-dung pits with Metarhizium anisopliae fungus which destroyed all beetle grubs before they flew out.",
        upvotes: 11,
        isUpvoted: false,
        createdAt: "18 hours ago",
      },
    ],
  },
  {
    id: "q-rice-stemborer-104",
    title: "Dead hearts in vegetative stage and white ears in reproductive stage in Jyothi Paddy",
    description:
      "Central leaf whorls are withering and pull out easily with pinholes at the base. Infestation is noticed across 4 acres in Bhadravathi belt. What is the immediate threshold treatment?",
    crop: "Rice",
    district: "Shivamogga",
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
    ],
    author: {
      name: "Anand Hegde",
      district: "Shivamogga",
      role: "farmer",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150",
    },
    upvotes: 27,
    isUpvoted: false,
    answersCount: 1,
    createdAt: "2 days ago",
    answers: [
      {
        id: "ans-104-1",
        questionId: "q-rice-stemborer-104",
        author: {
          name: "Dr. Girish Kumar",
          district: "Shivamogga",
          role: "agronomist",
          verified: true,
          avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
        },
        content:
          "Classic Yellow Stem Borer (Scirpophaga incertulas). Clip seedling leaf tips before transplanting to discard egg masses. Install pheromone traps @ 8 traps/ha for monitoring. If dead hearts exceed 10%, apply Chlorantraniliprole 0.4% G @ 4 kg/acre or Cartap Hydrochloride 4G @ 8 kg/acre.",
        upvotes: 19,
        isUpvoted: false,
        createdAt: "1 day ago",
      },
    ],
  },
  {
    id: "q-maize-faw-105",
    title: "Severe leaf scraping and window-paning on whorls of 25-day Maize crop",
    description:
      "Deep irregular holes inside central whorl with moist sawdust-like frass. Caterpillar has inverted Y mark on head. Fall armyworm spread in Harihar.",
    crop: "Maize",
    district: "Davanagere",
    images: [
      "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800",
    ],
    author: {
      name: "Basavaraj K.",
      district: "Davanagere",
      role: "farmer",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    },
    upvotes: 21,
    isUpvoted: false,
    answersCount: 1,
    createdAt: "2 days ago",
    answers: [
      {
        id: "ans-105-1",
        questionId: "q-maize-faw-105",
        author: {
          name: "Dr. Prakash Naik",
          district: "Dharwad",
          role: "agronomist",
          verified: true,
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
        },
        content:
          "For Fall Armyworm at 25-day stage: Direct spray into the central whorls using Emamectin Benzoate 5% SG @ 0.4 g/L or Spinetoram 11.7% SC @ 0.5 ml/L. Intercropping with cowpea or sunhemp helps attract beneficial predators.",
        upvotes: 14,
        isUpvoted: false,
        createdAt: "1 day ago",
      },
    ],
  },
]

const SEED_BLOGS: CommunityBlog[] = [
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
  {
    id: "blog-organic-jeevamrutha",
    title: "Preparation & Field Application Protocol for Desi Cow Jeevamrutha",
    content:
      "Take 200 liters of water, 10 kg fresh desi cow dung, 5-10 liters cow urine, 2 kg jaggery, 2 kg pulse flour, and a handful of fertile soil. Ferment in shade for 48 hours stirring twice daily. Apply 200 liters per acre with irrigation water...",
    coverImage: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=900",
    crop: "General",
    district: "Mysuru",
    author: {
      name: "Shivanna Nanjappa",
      district: "Mysuru",
      role: "progressive_farmer",
      verified: true,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    },
    readTime: "3 min read",
    likes: 112,
    isLiked: false,
    createdAt: "4 days ago",
  },
]

// In-Memory store for instant responsiveness & offline fallback
let questionsStore: CommunityQuestion[] = JSON.parse(JSON.stringify(SEED_QUESTIONS))
let blogsStore: CommunityBlog[] = JSON.parse(JSON.stringify(SEED_BLOGS))

const questionListeners = new Set<(questions: CommunityQuestion[]) => void>()

function notifyQuestionListeners() {
  const snapshot = [...questionsStore]
  questionListeners.forEach((fn) => fn(snapshot))
}

export function subscribeQuestions(listener: (questions: CommunityQuestion[]) => void) {
  questionListeners.add(listener)
  listener([...questionsStore])
  return () => {
    questionListeners.delete(listener)
  }
}

// ---------------- API CLIENT FUNCTIONS ----------------

/**
 * Fetch community questions with filters
 */
export async function fetchQuestions(params?: {
  crop?: string
  district?: string
  search?: string
  mobile?: string
}): Promise<CommunityQuestion[]> {
  try {
    const url = new URL(`${API_BASE}/community/questions`)
    if (params?.crop && params.crop !== "All") url.searchParams.append("crop", params.crop)
    if (params?.district && params.district !== "All") url.searchParams.append("district", params.district)
    if (params?.search) url.searchParams.append("search", params.search)
    if (params?.mobile) url.searchParams.append("mobile", params.mobile)

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 3500)

    const res = await fetch(url.toString(), { credentials: "omit", signal: controller.signal })
    clearTimeout(timer)

    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data?.questions) && data.questions.length > 0) {
        questionsStore = data.questions
        notifyQuestionListeners()
        return data.questions
      }
    }
  } catch {
    // Graceful offline fallback
  }

  // Filter in-memory questions
  let filtered = [...questionsStore]
  if (params?.crop && params.crop !== "All") {
    filtered = filtered.filter((q) => q.crop.toLowerCase() === params.crop!.toLowerCase())
  }
  if (params?.district && params.district !== "All") {
    filtered = filtered.filter((q) => q.district.toLowerCase() === params.district!.toLowerCase())
  }
  if (params?.search && params.search.trim()) {
    const s = params.search.toLowerCase()
    filtered = filtered.filter(
      (q) =>
        q.title.toLowerCase().includes(s) ||
        q.description.toLowerCase().includes(s) ||
        q.crop.toLowerCase().includes(s)
    )
  }
  return filtered
}

/**
 * Fetch a single question with its answers
 */
export async function fetchQuestionById(id: string): Promise<CommunityQuestion | null> {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 3000)

    const res = await fetch(`${API_BASE}/community/questions/${encodeURIComponent(id)}`, {
      credentials: "omit",
      signal: controller.signal,
    })
    clearTimeout(timer)

    if (res.ok) {
      const data = await res.json()
      if (data?.question) {
        // update local cache
        const idx = questionsStore.findIndex((q) => q.id === id)
        if (idx >= 0) questionsStore[idx] = data.question
        else questionsStore.unshift(data.question)
        return data.question
      }
    }
  } catch {
    // Offline fallback
  }

  const found = questionsStore.find((q) => q.id === id)
  return found || null
}

/**
 * Ask a new Question
 */
export async function createQuestion(data: {
  title: string
  description: string
  crop: string
  district: string
  images: string[]
  authorName?: string
  mobile?: string
  role?: CommunityRole
}): Promise<CommunityQuestion> {
  const newQuestion: CommunityQuestion = {
    id: `q-user-${Date.now()}`,
    title: data.title.trim(),
    description: data.description.trim(),
    crop: data.crop,
    district: data.district,
    images: data.images || [],
    author: {
      name: data.authorName || "Farmer Member",
      district: data.district,
      role: data.role || "farmer",
      mobile: data.mobile,
      verified: false,
    },
    upvotes: 0,
    isUpvoted: false,
    answersCount: 0,
    answers: [],
    createdAt: "Just now",
  }

  // Prepend to local memory store immediately for instant UI response
  questionsStore = [newQuestion, ...questionsStore]
  notifyQuestionListeners()

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 4000)

    const res = await fetch(`${API_BASE}/community/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      signal: controller.signal,
    })
    clearTimeout(timer)

    if (res.ok) {
      const serverData = await res.json()
      if (serverData?.question) {
        // Swap temp id if server returned one
        const idx = questionsStore.findIndex((q) => q.id === newQuestion.id)
        if (idx >= 0) {
          questionsStore[idx] = serverData.question
          notifyQuestionListeners()
          return serverData.question
        }
      }
    }
  } catch {
    // Kept in local state
  }

  return newQuestion
}

/**
 * Post an answer to a question
 */
export async function postAnswer(
  questionId: string,
  data: {
    content: string
    authorName?: string
    district?: string
    role?: CommunityRole
    image?: string
    mobile?: string
  }
): Promise<CommunityAnswer> {
  const newAnswer: CommunityAnswer = {
    id: `ans-user-${Date.now()}`,
    questionId,
    content: data.content.trim(),
    author: {
      name: data.authorName || "Krushika User",
      district: data.district || "Karnataka",
      role: data.role || "farmer",
      mobile: data.mobile,
      verified: data.role === "agronomist" || data.role === "officer",
    },
    image: data.image,
    upvotes: 0,
    isUpvoted: false,
    createdAt: "Just now",
  }

  // Update in local question
  const qIdx = questionsStore.findIndex((q) => q.id === questionId)
  if (qIdx >= 0) {
    const q = questionsStore[qIdx]
    const updatedAnswers = [...(q.answers || []), newAnswer]
    questionsStore[qIdx] = {
      ...q,
      answers: updatedAnswers,
      answersCount: updatedAnswers.length,
    }
    notifyQuestionListeners()
  }

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 4000)

    const res = await fetch(`${API_BASE}/community/questions/${encodeURIComponent(questionId)}/answers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      signal: controller.signal,
    })
    clearTimeout(timer)

    if (res.ok) {
      const serverData = await res.json()
      if (serverData?.answer) {
        return serverData.answer
      }
    }
  } catch {
    // Offline fallback retained
  }

  return newAnswer
}

/**
 * Toggle question upvote
 */
export async function toggleQuestionUpvote(questionId: string, mobile?: string): Promise<CommunityQuestion | null> {
  const qIdx = questionsStore.findIndex((q) => q.id === questionId)
  if (qIdx >= 0) {
    const q = questionsStore[qIdx]
    const nextState = !q.isUpvoted
    const nextVotes = nextState ? q.upvotes + 1 : Math.max(0, q.upvotes - 1)
    const updated = { ...q, isUpvoted: nextState, upvotes: nextVotes }
    questionsStore[qIdx] = updated
    notifyQuestionListeners()

    // Send to backend in background
    fetch(`${API_BASE}/community/questions/${encodeURIComponent(questionId)}/upvote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile }),
    }).catch(() => {})

    return updated
  }
  return null
}

/**
 * Toggle answer upvote
 */
export async function toggleAnswerUpvote(
  questionId: string,
  answerId: string,
  mobile?: string
): Promise<CommunityAnswer | null> {
  const qIdx = questionsStore.findIndex((q) => q.id === questionId)
  if (qIdx >= 0) {
    const q = questionsStore[qIdx]
    const aIdx = (q.answers || []).findIndex((a) => a.id === answerId)
    if (aIdx >= 0) {
      const ans = q.answers[aIdx]
      const nextState = !ans.isUpvoted
      const nextVotes = nextState ? ans.upvotes + 1 : Math.max(0, ans.upvotes - 1)
      const updatedAns = { ...ans, isUpvoted: nextState, upvotes: nextVotes }

      const newAnswers = [...q.answers]
      newAnswers[aIdx] = updatedAns
      questionsStore[qIdx] = { ...q, answers: newAnswers }
      notifyQuestionListeners()

      fetch(`${API_BASE}/community/answers/${encodeURIComponent(answerId)}/upvote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, questionId }),
      }).catch(() => {})

      return updatedAns
    }
  }
  return null
}

/**
 * Fetch agronomy guides and blogs
 */
export async function fetchBlogs(params?: { crop?: string; district?: string }): Promise<CommunityBlog[]> {
  try {
    const url = new URL(`${API_BASE}/community/blogs`)
    if (params?.crop && params.crop !== "All") url.searchParams.append("crop", params.crop)
    if (params?.district && params.district !== "All") url.searchParams.append("district", params.district)

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 3000)

    const res = await fetch(url.toString(), { signal: controller.signal })
    clearTimeout(timer)

    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data?.blogs) && data.blogs.length > 0) {
        blogsStore = data.blogs
        return data.blogs
      }
    }
  } catch {
    // Offline
  }

  let filtered = [...blogsStore]
  if (params?.crop && params.crop !== "All") {
    filtered = filtered.filter((b) => b.crop.toLowerCase() === params.crop!.toLowerCase())
  }
  if (params?.district && params.district !== "All") {
    filtered = filtered.filter((b) => b.district.toLowerCase() === params.district!.toLowerCase())
  }
  return filtered
}

/**
 * Toggle blog like
 */
export async function toggleBlogLike(blogId: string): Promise<CommunityBlog | null> {
  const idx = blogsStore.findIndex((b) => b.id === blogId)
  if (idx >= 0) {
    const b = blogsStore[idx]
    const nextState = !b.isLiked
    const nextLikes = nextState ? b.likes + 1 : Math.max(0, b.likes - 1)
    const updated = { ...b, isLiked: nextState, likes: nextLikes }
    blogsStore[idx] = updated

    fetch(`${API_BASE}/community/blogs/${encodeURIComponent(blogId)}/like`, {
      method: "POST",
    }).catch(() => {})

    return updated
  }
  return null
}
