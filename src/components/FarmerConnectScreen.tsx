import React, { useEffect, useState, useCallback, useMemo } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  RefreshControl,
  ActivityIndicator,
  Share,
  Alert,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import {
  ChevronLeft,
  Search,
  X,
  Plus,
  ThumbsUp,
  MessageSquare,
  Share2,
  MapPin,
  Calendar,
  Sparkles,
  Award,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  Filter,
} from "lucide-react-native"
import { useNav } from "../nav"
import { useLang } from "../i18n"
import { useProfile } from "../profile"
import {
  type CommunityQuestion,
  type CommunityBlog,
  fetchQuestions,
  fetchBlogs,
  toggleQuestionUpvote,
  toggleBlogLike,
  subscribeQuestions,
} from "../api/farmerConnect"
import { BlogReaderModal } from "./FarmerConnectSubflows"
import { ScalePressable, FadeSlideIn } from "./Motion"

const CROP_FILTER_CHIPS = [
  "All",
  "Tomato",
  "Ragi",
  "Rice",
  "Coconut",
  "Maize",
  "Chilli",
  "Sugarcane",
  "Arecanut",
  "Groundnut",
  "Cotton",
]

const DISTRICT_FILTER_CHIPS = [
  "All",
  "Mandya",
  "Mysuru",
  "Ramanagara",
  "Kolar",
  "Tumakuru",
  "Hassan",
  "Shivamogga",
  "Chikkaballapura",
  "Davanagere",
  "Belagavi",
  "Ballari",
]

export default function FarmerConnectScreen() {
  const { open, back } = useNav()
  const { lang } = useLang()
  const { profile } = useProfile()
  const insets = useSafeAreaInsets()
  const isKn = lang === "kn"

  const [activeTab, setActiveTab] = useState<"questions" | "blogs" | "myPosts">("questions")
  const [selectedCrop, setSelectedCrop] = useState("All")
  const [selectedDistrict, setSelectedDistrict] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchVisible, setIsSearchVisible] = useState(false)

  const [questions, setQuestions] = useState<CommunityQuestion[]>([])
  const [blogs, setBlogs] = useState<CommunityBlog[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState<CommunityBlog | null>(null)

  // Load initial data
  const loadData = useCallback(async () => {
    try {
      const [qs, bs] = await Promise.all([
        fetchQuestions({
          crop: selectedCrop,
          district: selectedDistrict,
          search: searchQuery,
        }),
        fetchBlogs({
          crop: selectedCrop,
          district: selectedDistrict,
        }),
      ])
      setQuestions(qs)
      setBlogs(bs)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [selectedCrop, selectedDistrict, searchQuery])

  useEffect(() => {
    setLoading(true)
    loadData()
  }, [loadData])

  // Subscribe to live questions updates
  useEffect(() => {
    const unsub = subscribeQuestions((updatedQs) => {
      let filtered = updatedQs
      if (selectedCrop !== "All") {
        filtered = filtered.filter((q) => q.crop.toLowerCase() === selectedCrop.toLowerCase())
      }
      if (selectedDistrict !== "All") {
        filtered = filtered.filter((q) => q.district.toLowerCase() === selectedDistrict.toLowerCase())
      }
      if (searchQuery.trim()) {
        const s = searchQuery.toLowerCase()
        filtered = filtered.filter(
          (q) =>
            q.title.toLowerCase().includes(s) ||
            q.description.toLowerCase().includes(s) ||
            q.crop.toLowerCase().includes(s)
        )
      }
      setQuestions(filtered)
    })
    return unsub
  }, [selectedCrop, selectedDistrict, searchQuery])

  const onRefresh = () => {
    setRefreshing(true)
    loadData()
  }

  const handleUpvote = async (questionId: string) => {
    const updated = await toggleQuestionUpvote(questionId, profile.mobile)
    if (updated) {
      setQuestions((prev) => prev.map((q) => (q.id === questionId ? updated : q)))
    }
  }

  const handleLikeBlog = async (blog: CommunityBlog) => {
    const updated = await toggleBlogLike(blog.id)
    if (updated) {
      setBlogs((prev) => prev.map((b) => (b.id === blog.id ? updated : b)))
      if (selectedBlog?.id === blog.id) setSelectedBlog(updated)
    }
  }

  const handleShare = async (q: CommunityQuestion) => {
    try {
      await Share.share({
        title: q.title,
        message: `🌱 KrushikaDhara FarmerConnect:\n\n"${q.title}"\nCrop: ${q.crop} | District: ${q.district}\n\nJoin the discussion on KrushikaDhara app!`,
      })
    } catch {
      // Ignored
    }
  }

  const myQuestions = useMemo(() => {
    const userPhone = profile.mobile || "9591502209"
    const userName = (profile.name || "").toLowerCase()
    return questions.filter(
      (q) =>
        q.author.mobile === userPhone ||
        (userName && q.author.name.toLowerCase() === userName)
    )
  }, [questions, profile.mobile, profile.name])

  const renderRoleBadge = (role: string, verified?: boolean) => {
    if (role === "agronomist") {
      return (
        <View style={[styles.roleBadge, { backgroundColor: "#dcfce7" }]}>
          <Award size={11} color="#16a34a" />
          <Text style={[styles.roleBadgeText, { color: "#16a34a" }]}>
            {isKn ? "ಕೃಷಿ ವಿಜ್ಞಾನಿ" : "Agronomist"}
          </Text>
        </View>
      )
    }
    if (role === "officer") {
      return (
        <View style={[styles.roleBadge, { backgroundColor: "#e0f2fe" }]}>
          <CheckCircle2 size={11} color="#0284c7" />
          <Text style={[styles.roleBadgeText, { color: "#0284c7" }]}>
            {isKn ? "ಕೃಷಿ ಅಧಿಕಾರಿ" : "Agri Officer"}
          </Text>
        </View>
      )
    }
    if (role === "progressive_farmer") {
      return (
        <View style={[styles.roleBadge, { backgroundColor: "#fef3c7" }]}>
          <Sparkles size={11} color="#d97706" />
          <Text style={[styles.roleBadgeText, { color: "#d97706" }]}>
            {isKn ? "ಪ್ರಗತಿಪರ ರೈತ" : "Prog. Farmer"}
          </Text>
        </View>
      )
    }
    return (
      <View style={[styles.roleBadge, { backgroundColor: "#f3f4f6" }]}>
        <Text style={[styles.roleBadgeText, { color: "#4b5563" }]}>
          {isKn ? "ರೈತ" : "Farmer"}
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top + 10, 42) }]}>
        <View style={styles.headerRow}>
          <ScalePressable onPress={back} scaleTo={0.9} style={styles.headerIconBtn}>
            <ChevronLeft size={22} color="#ffffff" />
          </ScalePressable>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.headerTitle}>
              {isKn ? "ರೈತ ಸಂಪರ್ಕ" : "FarmerConnect"}
            </Text>
            <Text style={styles.headerSubtitle}>
              {isKn
                ? "ರೈತ ಸಮುದಾಯ ಮತ್ತು ಕೃಷಿ ತಜ್ಞರ ಜಾಲ"
                : "Farmer Community & Agronomist Network"}
            </Text>
          </View>
          <ScalePressable
            onPress={() => setIsSearchVisible((v) => !v)}
            scaleTo={0.9}
            style={[styles.headerIconBtn, isSearchVisible && { backgroundColor: "rgba(255,255,255,0.3)" }]}
          >
            <Search size={20} color="#ffffff" />
          </ScalePressable>
          <ScalePressable
            onPress={() => open("askQuestion")}
            scaleTo={0.9}
            style={[styles.headerAskBtn, { marginLeft: 8 }]}
          >
            <Plus size={16} color="#256428" />
            <Text style={styles.headerAskText}>{isKn ? "ಪ್ರಶ್ನೆ ಕೇಳಿ" : "Ask"}</Text>
          </ScalePressable>
        </View>

        {/* Expandable Search Input */}
        {isSearchVisible && (
          <View style={styles.searchBarRow}>
            <Search size={16} color="#6b7280" />
            <TextInput
              style={styles.searchInput}
              placeholder={
                isKn
                  ? "ಬೆಳೆ, ರೋಗ ಅಥವಾ ಪರಿಹಾರವನ್ನು ಹುಡುಕಿ..."
                  : "Search crops, leaf spots, treatments..."
              }
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <X size={16} color="#6b7280" />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Tab Switcher */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "questions" && styles.tabButtonActive]}
            onPress={() => setActiveTab("questions")}
          >
            <HelpCircle size={15} color={activeTab === "questions" ? "#256428" : "#ffffff"} />
            <Text
              style={[
                styles.tabButtonText,
                activeTab === "questions" && styles.tabButtonTextActive,
              ]}
            >
              {isKn ? "ಪ್ರಶ್ನೋತ್ತರ" : "Q&A Feed"} ({questions.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === "blogs" && styles.tabButtonActive]}
            onPress={() => setActiveTab("blogs")}
          >
            <BookOpen size={15} color={activeTab === "blogs" ? "#256428" : "#ffffff"} />
            <Text
              style={[
                styles.tabButtonText,
                activeTab === "blogs" && styles.tabButtonTextActive,
              ]}
            >
              {isKn ? "ಕೃಷಿ ಮಾರ್ಗದರ್ಶಿ" : "Guides"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === "myPosts" && styles.tabButtonActive]}
            onPress={() => setActiveTab("myPosts")}
          >
            <Sparkles size={15} color={activeTab === "myPosts" ? "#256428" : "#ffffff"} />
            <Text
              style={[
                styles.tabButtonText,
                activeTab === "myPosts" && styles.tabButtonTextActive,
              ]}
            >
              {isKn ? "ನನ್ನ ಪ್ರಶ್ನೆಗಳು" : "My Posts"} ({myQuestions.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Chips Bar (Crops & Districts) */}
      <View style={styles.filtersWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8, alignItems: "center" }}
        >
          <View style={styles.filterLead}>
            <Filter size={13} color="#256428" />
            <Text style={styles.filterLeadText}>{isKn ? "ಬೆಳೆ:" : "Crop:"}</Text>
          </View>
          {CROP_FILTER_CHIPS.map((crop) => {
            const active = selectedCrop === crop
            return (
              <TouchableOpacity
                key={crop}
                onPress={() => setSelectedCrop(crop)}
                style={[styles.filterChip, active && styles.filterChipActive]}
              >
                <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                  {crop}
                </Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>

      {/* Content Area */}
      {loading ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color="#256428" />
          <Text style={styles.centerLoadingText}>
            {isKn ? "ಮಾಹಿತಿಯನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ..." : "Loading farmer community discussions..."}
          </Text>
        </View>
      ) : activeTab === "questions" ? (
        <ScrollView
          contentContainerStyle={[styles.listContainer, { paddingBottom: insets.bottom + 80 }]}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#256428"]} />}
          showsVerticalScrollIndicator={false}
        >
          {questions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <HelpCircle size={48} color="#9ca3af" />
              <Text style={styles.emptyTitle}>
                {isKn ? "ಯಾವುದೇ ಪ್ರಶ್ನೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ" : "No Questions Found"}
              </Text>
              <Text style={styles.emptySub}>
                {isKn
                  ? "ಈ ಬೆಳೆ ಅಥವಾ ಜಿಲ್ಲೆಗೆ ಮೊದಲ ಪ್ರಶ್ನೆಯನ್ನು ನೀವೇ ಕೇಳಿ!"
                  : "Be the first to ask a question for this crop or district!"}
              </Text>
              <TouchableOpacity
                style={styles.emptyAskBtn}
                onPress={() => open("askQuestion")}
              >
                <Plus size={16} color="#ffffff" />
                <Text style={styles.emptyAskBtnText}>
                  {isKn ? "ಪ್ರಶ್ನೆ ಕೇಳಿ" : "Ask a Question"}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            questions.map((q, idx) => (
              <FadeSlideIn key={q.id} delay={idx * 40} style={styles.questionCard}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => open("questionDetail", { id: q.id, question: q })}
                >
                  {/* Author Header */}
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.avatarCircle}>
                      {q.author.avatar ? (
                        <Image source={{ uri: q.author.avatar }} style={styles.avatarImg} />
                      ) : (
                        <Text style={styles.avatarText}>
                          {q.author.name.charAt(0).toUpperCase()}
                        </Text>
                      )}
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                        <Text style={styles.cardAuthorName}>{q.author.name}</Text>
                        {renderRoleBadge(q.author.role, q.author.verified)}
                      </View>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                          <MapPin size={11} color="#6b7280" />
                          <Text style={styles.cardMeta}>{q.district}</Text>
                        </View>
                        <Text style={styles.metaDot}>•</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                          <Calendar size={11} color="#6b7280" />
                          <Text style={styles.cardMeta}>{q.createdAt}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.cropBadge}>
                      <Text style={styles.cropBadgeText}>{q.crop}</Text>
                    </View>
                  </View>

                  {/* Title & Description Snippet */}
                  <Text style={styles.cardTitle}>{q.title}</Text>
                  <Text style={styles.cardDescription} numberOfLines={3}>
                    {q.description}
                  </Text>

                  {/* Image thumbnails */}
                  {q.images && q.images.length > 0 && (
                    <View style={styles.imageStrip}>
                      {q.images.slice(0, 3).map((uri, i) => (
                        <Image key={i} source={{ uri }} style={styles.cardThumb} />
                      ))}
                      {q.images.length > 3 && (
                        <View style={styles.moreImagesOverlay}>
                          <Text style={styles.moreImagesText}>+{q.images.length - 3}</Text>
                        </View>
                      )}
                    </View>
                  )}
                </TouchableOpacity>

                {/* Footer Actions */}
                <View style={styles.cardFooter}>
                  <TouchableOpacity
                    style={[styles.footerBtn, q.isUpvoted && styles.footerBtnActive]}
                    onPress={() => handleUpvote(q.id)}
                  >
                    <ThumbsUp
                      size={15}
                      color={q.isUpvoted ? "#16a34a" : "#4b5563"}
                      fill={q.isUpvoted ? "#16a34a" : "transparent"}
                    />
                    <Text
                      style={[
                        styles.footerBtnText,
                        q.isUpvoted && { color: "#16a34a", fontWeight: "700" },
                      ]}
                    >
                      {q.upvotes} {isKn ? "ಉಪಯುಕ್ತ" : "Helpful"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.footerBtn}
                    onPress={() => open("questionDetail", { id: q.id, question: q })}
                  >
                    <MessageSquare size={15} color="#4b5563" />
                    <Text style={styles.footerBtnText}>
                      {q.answersCount} {isKn ? "ಉತ್ತರಗಳು" : "Answers"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.footerBtnIconOnly}
                    onPress={() => handleShare(q)}
                  >
                    <Share2 size={15} color="#6b7280" />
                  </TouchableOpacity>
                </View>
              </FadeSlideIn>
            ))
          )}
        </ScrollView>
      ) : activeTab === "blogs" ? (
        <ScrollView
          contentContainerStyle={[styles.listContainer, { paddingBottom: insets.bottom + 80 }]}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#256428"]} />}
          showsVerticalScrollIndicator={false}
        >
          {blogs.map((b, idx) => (
            <FadeSlideIn key={b.id} delay={idx * 50} style={styles.blogCard}>
              <TouchableOpacity activeOpacity={0.9} onPress={() => setSelectedBlog(b)}>
                <Image source={{ uri: b.coverImage }} style={styles.blogCover} />
                <View style={{ padding: 14 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View style={styles.cropBadge}>
                      <Text style={styles.cropBadgeText}>{b.crop}</Text>
                    </View>
                    <Text style={styles.cardMeta}>{b.readTime}</Text>
                  </View>
                  <Text style={styles.blogCardTitle}>{b.title}</Text>
                  <Text style={styles.cardDescription} numberOfLines={2}>
                    {b.content}
                  </Text>

                  <View style={styles.blogFooterRow}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                      <Text style={styles.cardAuthorName}>{b.author.name}</Text>
                      {renderRoleBadge(b.author.role, b.author.verified)}
                    </View>
                    <TouchableOpacity
                      style={[styles.footerBtn, b.isLiked && styles.footerBtnActive]}
                      onPress={() => handleLikeBlog(b)}
                    >
                      <ThumbsUp
                        size={14}
                        color={b.isLiked ? "#16a34a" : "#4b5563"}
                        fill={b.isLiked ? "#16a34a" : "transparent"}
                      />
                      <Text style={[styles.footerBtnText, b.isLiked && { color: "#16a34a", fontWeight: "700" }]}>
                        {b.likes}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </FadeSlideIn>
          ))}
        </ScrollView>
      ) : (
        /* My Posts Tab */
        <ScrollView
          contentContainerStyle={[styles.listContainer, { paddingBottom: insets.bottom + 80 }]}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#256428"]} />}
          showsVerticalScrollIndicator={false}
        >
          {myQuestions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Sparkles size={44} color="#9ca3af" />
              <Text style={styles.emptyTitle}>
                {isKn ? "ನೀವಿನ್ನೂ ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಿಲ್ಲ" : "You Haven't Asked Questions Yet"}
              </Text>
              <Text style={styles.emptySub}>
                {isKn
                  ? "ನಿಮ್ಮ ತೋಟ ಅಥವಾ ಹೊಲದಲ್ಲಿನ ಸಮಸ್ಯೆಗಳನ್ನು ಕೃಷಿ ಸಮುದಾಯದೊಂದಿಗೆ ಹಂಚಿಕೊಳ್ಳಿ."
                  : "Ask a question about crop pests, fertilizer scheduling, or irrigation advice."}
              </Text>
              <TouchableOpacity
                style={styles.emptyAskBtn}
                onPress={() => open("askQuestion")}
              >
                <Plus size={16} color="#ffffff" />
                <Text style={styles.emptyAskBtnText}>
                  {isKn ? "ಈಗ ಪ್ರಶ್ನೆ ಕೇಳಿ" : "Ask Question Now"}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            myQuestions.map((q, idx) => (
              <FadeSlideIn key={q.id} delay={idx * 40} style={styles.questionCard}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => open("questionDetail", { id: q.id, question: q })}
                >
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.cropBadge}>
                      <Text style={styles.cropBadgeText}>{q.crop}</Text>
                    </View>
                    <Text style={styles.cardMeta}>{q.createdAt}</Text>
                  </View>
                  <Text style={styles.cardTitle}>{q.title}</Text>
                  <Text style={styles.cardDescription} numberOfLines={2}>
                    {q.description}
                  </Text>
                  <View style={[styles.cardFooter, { borderTopWidth: 0, paddingTop: 6 }]}>
                    <View style={styles.answersCountTag}>
                      <MessageSquare size={14} color="#16a34a" />
                      <Text style={[styles.answersCountText, { color: "#16a34a" }]}>
                        {q.answersCount} {isKn ? "ಉತ್ತರಗಳು ಬಂದಿವೆ" : "Answers Received"}
                      </Text>
                    </View>
                    <Text style={styles.viewDiscussionText}>
                      {isKn ? "ವೀಕ್ಷಿಸಿ →" : "View Discussion →"}
                    </Text>
                  </View>
                </TouchableOpacity>
              </FadeSlideIn>
            ))
          )}
        </ScrollView>
      )}

      {/* Floating Action Button (FAB) */}
      <ScalePressable
        onPress={() => open("askQuestion")}
        scaleTo={0.92}
        style={[styles.fab, { bottom: Math.max(insets.bottom + 20, 24) }]}
      >
        <Plus size={22} color="#ffffff" />
        <Text style={styles.fabText}>{isKn ? "ಪ್ರಶ್ನೆ ಕೇಳಿ" : "Ask Question"}</Text>
      </ScalePressable>

      {/* Blog Detail Reader Modal */}
      <BlogReaderModal
        blog={selectedBlog}
        onClose={() => setSelectedBlog(null)}
        onLike={handleLikeBlog}
      />
    </View>
  )
}

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#f7f8ec",
    zIndex: 100,
  },
  header: {
    backgroundColor: "#256428",
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#dcfce7",
    marginTop: 1,
  },
  headerAskBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
  },
  headerAskText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#256428",
  },
  searchBarRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
    paddingVertical: 0,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.15)",
    borderRadius: 14,
    padding: 3,
    marginTop: 14,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    borderRadius: 12,
  },
  tabButtonActive: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ffffff",
  },
  tabButtonTextActive: {
    color: "#256428",
    fontWeight: "700",
  },
  filtersWrapper: {
    paddingVertical: 10,
    backgroundColor: "#f7f8ec",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  filterLead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginRight: 4,
  },
  filterLeadText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#256428",
  },
  filterChip: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  filterChipActive: {
    backgroundColor: "#256428",
    borderColor: "#256428",
  },
  filterChipText: {
    fontSize: 12,
    color: "#4b5563",
    fontWeight: "500",
  },
  filterChipTextActive: {
    color: "#ffffff",
    fontWeight: "600",
  },
  listContainer: {
    padding: 16,
  },
  centerLoading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  centerLoadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6b7280",
  },
  emptyContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 28,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
    marginTop: 12,
  },
  emptySub: {
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
  },
  emptyAskBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#256428",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 16,
  },
  emptyAskBtnText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  questionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#dcfce7",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
  },
  avatarText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#256428",
  },
  cardAuthorName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 10,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: "600",
  },
  cardMeta: {
    fontSize: 11,
    color: "#6b7280",
  },
  metaDot: {
    fontSize: 10,
    color: "#9ca3af",
  },
  cropBadge: {
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#a7f3d0",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  cropBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#059669",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginTop: 10,
    lineHeight: 21,
  },
  cardDescription: {
    fontSize: 13,
    color: "#4b5563",
    marginTop: 4,
    lineHeight: 19,
  },
  imageStrip: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
    position: "relative",
  },
  cardThumb: {
    width: 76,
    height: 76,
    borderRadius: 8,
  },
  moreImagesOverlay: {
    position: "absolute",
    right: 0,
    width: 76,
    height: 76,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  moreImagesText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    marginTop: 12,
    paddingTop: 10,
  },
  footerBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: "#f9fafb",
  },
  footerBtnActive: {
    backgroundColor: "#dcfce7",
  },
  footerBtnText: {
    fontSize: 12,
    color: "#4b5563",
    fontWeight: "500",
  },
  footerBtnIconOnly: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: "#f9fafb",
  },
  blogCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  blogCover: {
    width: "100%",
    height: 150,
  },
  blogCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginTop: 8,
    lineHeight: 22,
  },
  blogFooterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  answersCountTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  answersCountText: {
    fontSize: 12,
    fontWeight: "600",
  },
  viewDiscussionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#256428",
  },
  fab: {
    position: "absolute",
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#256428",
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  fabText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
})
