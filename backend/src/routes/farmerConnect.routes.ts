import { Router } from "express"
import {
  getCommunityQuestions,
  getCommunityQuestionById,
  createCommunityQuestion,
  upvoteCommunityQuestion,
  createCommunityAnswer,
  upvoteCommunityAnswer,
  getCommunityBlogs,
  likeCommunityBlog,
} from "../controllers/farmerConnect.controller.js"

const router = Router()

// Questions Feed & Details
router.get("/questions", getCommunityQuestions)
router.get("/questions/:id", getCommunityQuestionById)
router.post("/questions", createCommunityQuestion)
router.post("/questions/:id/upvote", upvoteCommunityQuestion)

// Answers
router.post("/questions/:id/answers", createCommunityAnswer)
router.post("/answers/:answerId/upvote", upvoteCommunityAnswer)

// Agronomy Guides / Blogs
router.get("/blogs", getCommunityBlogs)
router.post("/blogs/:id/like", likeCommunityBlog)

export default router
