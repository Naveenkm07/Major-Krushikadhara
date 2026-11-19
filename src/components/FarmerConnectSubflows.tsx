import React, { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import {
  ChevronLeft,
  Camera,
  Image as ImageIcon,
  X,
  ThumbsUp,
  MessageSquare,
  CheckCircle2,
  Award,
  Send,
  MapPin,
  Calendar,
  Share2,
  BookOpen,
  Sparkles,
} from "lucide-react-native"
import * as ImagePicker from "expo-image-picker"
import { useNav } from "../nav"
import { useLang } from "../i18n"
import { useProfile } from "../profile"
import {
  type CommunityQuestion,
  type CommunityAnswer,
  type CommunityBlog,
  createQuestion,
  fetchQuestionById,
  postAnswer,
  toggleQuestionUpvote,
  toggleAnswerUpvote,
  toggleBlogLike,
} from "../api/farmerConnect"
import { ScalePressable } from "./Motion"

const CROP_OPTIONS = [
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
  "Other",
]

const DISTRICT_OPTIONS = [
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
  "Dharwad",
  "Chitradurga",
]

// ----------------------------------------------------
// 1. ASK QUESTION SCREEN
// ----------------------------------------------------
export function AskQuestionScreen() {
  const { back } = useNav()
  const { lang } = useLang()
  const { profile } = useProfile()
  const insets = useSafeAreaInsets()
  const isKn = lang === "kn"

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedCrop, setSelectedCrop] = useState(
    profile.crops && profile.crops.length > 0 ? profile.crops[0] : "Tomato"
  )
  const [selectedDistrict, setSelectedDistrict] = useState(profile.district || "Mandya")
  const [images, setImages] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  const handlePickImage = async (useCamera: boolean) => {
    if (images.length >= 3) {
      Alert.alert(
        isKn ? "ಚಿತ್ರದ ಮಿತಿ" : "Image Limit",
        isKn ? "ನೀವು ಗರಿಷ್ಠ 3 ಚಿತ್ರಗಳನ್ನು ಮಾತ್ರ ಲಗತ್ತಿಸಬಹುದು." : "You can upload a maximum of 3 images."
      )
      return
    }

    try {
      if (useCamera) {
        const perm = await ImagePicker.requestCameraPermissionsAsync()
        if (!perm.granted) {
          Alert.alert(
            isKn ? "ಕ್ಯಾಮೆರಾ ಅನುಮತಿ ಅಗತ್ಯ" : "Camera Permission Required",
            isKn ? "ಫೋಟೋ ತೆಗೆಯಲು ದಯವಿಟ್ಟು ಕ್ಯಾಮೆರಾ ಪ್ರವೇಶ ನೀಡಿ." : "Please grant camera permission to take crop photos."
          )
          return
        }
        const res = await ImagePicker.launchCameraAsync({ quality: 0.8 })
        if (!res.canceled && res.assets?.[0]?.uri) {
          setImages((prev) => [...prev, res.assets[0].uri].slice(0, 3))
        }
      } else {
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (!perm.granted) {
          Alert.alert(
            isKn ? "ಗ್ಯಾಲರಿ ಅನುಮತಿ ಅಗತ್ಯ" : "Gallery Permission Required",
            isKn ? "ಚಿತ್ರ ಆಯ್ಕೆ ಮಾಡಲು ಗ್ಯಾಲರಿ ಪ್ರವೇಶ ನೀಡಿ." : "Please grant gallery permission to select photos."
          )
          return
        }
        const res = await ImagePicker.launchImageLibraryAsync({
          quality: 0.8,
          allowsMultipleSelection: false,
        })
        if (!res.canceled && res.assets?.[0]?.uri) {
          setImages((prev) => [...prev, res.assets[0].uri].slice(0, 3))
        }
      }
    } catch {
      Alert.alert(
        isKn ? "ದೋಷ" : "Error",
        isKn ? "ಚಿತ್ರ ಆಯ್ಕೆ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ." : "Could not select image. Please try again."
      )
    }
  }

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert(
        isKn ? "ಶೀರ್ಷಿಕೆ ಅಗತ್ಯ" : "Title Required",
        isKn ? "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯ ಶೀರ್ಷಿಕೆಯನ್ನು ನಮೂದಿಸಿ." : "Please enter a question title."
      )
      return
    }
    if (!description.trim()) {
      Alert.alert(
        isKn ? "ವಿವರಣೆ ಅಗತ್ಯ" : "Description Required",
        isKn ? "ದಯವಿಟ್ಟು ರೋಗ ಲಕ್ಷಣ ಅಥವಾ ಸಮಸ್ಯೆಯ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ." : "Please describe your question or crop symptoms."
      )
      return
    }

    setSubmitting(true)
    try {
      await createQuestion({
        title: title.trim(),
        description: description.trim(),
        crop: selectedCrop,
        district: selectedDistrict,
        images,
        authorName: profile.name || "Farmer",
        mobile: profile.mobile || "9591502209",
        role: "farmer",
      })

      Alert.alert(
        isKn ? "ಪ್ರಶ್ನೆ ಯಶಸ್ವಿಯಾಗಿ ಪ್ರಕಟವಾಯಿತು! 🎉" : "Question Posted! 🎉",
        isKn
          ? "ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ರೈತ ಸಮುದಾಯ ಮತ್ತು ಕೃಷಿ ತಜ್ಞರೊಂದಿಗೆ ಹಂಚಿಕೊಳ್ಳಲಾಗಿದೆ."
          : "Your question has been shared with farmers and agronomists across Karnataka.",
        [{ text: isKn ? "ಸರಿ" : "OK", onPress: () => back() }]
      )
    } catch {
      Alert.alert(
        isKn ? "ದೋಷ" : "Error",
        isKn ? "ಪ್ರಶ್ನೆ ಪ್ರಕಟಿಸಲು ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಪುನಃ ಪ್ರಯತ್ನಿಸಿ." : "Failed to post question. Please try again."
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top + 10, 42) }]}>
        <View style={styles.headerRow}>
          <ScalePressable onPress={back} scaleTo={0.9} style={styles.backButton}>
            <ChevronLeft size={22} color="#ffffff" />
          </ScalePressable>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.headerTitle}>
              {isKn ? "ಪ್ರಶ್ನೆ ಕೇಳಿ" : "Ask Question"}
            </Text>
            <Text style={styles.headerSubtitle}>
              {isKn ? "ಕೃಷಿ ತಜ್ಞರು ಮತ್ತು ರೈತರಿಂದ ಸಲಹೆ ಪಡೆಯಿರಿ" : "Get expert advice from agronomists & peers"}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.formContainer, { paddingBottom: insets.bottom + 40 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Title Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            {isKn ? "ಪ್ರಶ್ನೆಯ ಶೀರ್ಷಿಕೆ *" : "Question Title *"}
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder={
              isKn
                ? "ಉದಾ: 40 ದಿನದ ಟೊಮೆಟೊ ಎಲೆಗಳಲ್ಲಿ ಕಪ್ಪು ಚುಕ್ಕೆಗಳು..."
                : "e.g., Black spots and yellow rings on 40-day Tomato leaves..."
            }
            placeholderTextColor="#9ca3af"
            value={title}
            onChangeText={setTitle}
            maxLength={140}
          />
          <Text style={styles.charCount}>{title.length}/140</Text>
        </View>

        {/* Crop Selector */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            {isKn ? "ಬೆಳೆ ಆಯ್ಕೆಮಾಡಿ *" : "Select Crop *"}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            {CROP_OPTIONS.map((c) => {
              const active = selectedCrop === c
              return (
                <TouchableOpacity
                  key={c}
                  onPress={() => setSelectedCrop(c)}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{c}</Text>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>

        {/* District Selector */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            {isKn ? "ಜಿಲ್ಲೆ *" : "District *"}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            {DISTRICT_OPTIONS.map((d) => {
              const active = selectedDistrict === d
              return (
                <TouchableOpacity
                  key={d}
                  onPress={() => setSelectedDistrict(d)}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{d}</Text>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>

        {/* Detailed Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            {isKn ? "ಸಮಸ್ಯೆಯ ಪೂರ್ಣ ವಿವರಣೆ *" : "Detailed Description & Symptoms *"}
          </Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder={
              isKn
                ? "ರೋಗದ ಲಕ್ಷಣಗಳು, ಬೆಳೆಯ ವಯಸ್ಸು, ಹವಾಮಾನ ಪರಿಸ್ಥಿತಿ, ಬಳಸಿದ ಗೊಬ್ಬರ ಮುಂತಾದ ವಿವರಗಳನ್ನು ಬರೆಯಿರಿ..."
                : "Describe crop age, leaf symptoms, weather, recent rains, fertilizers or sprays applied..."
            }
            placeholderTextColor="#9ca3af"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>

        {/* Photos Attachment */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            {isKn ? "ಬೆಳೆಯ ಫೋಟೋಗಳು (ಗರಿಷ್ಠ 3)" : "Crop Photos (Max 3)"}
          </Text>
          <View style={styles.photoActionsRow}>
            <TouchableOpacity
              style={styles.photoActionButton}
              onPress={() => handlePickImage(true)}
            >
              <Camera size={18} color="#256428" />
              <Text style={styles.photoActionText}>{isKn ? "ಕ್ಯಾಮೆರಾ" : "Camera"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.photoActionButton}
              onPress={() => handlePickImage(false)}
            >
              <ImageIcon size={18} color="#256428" />
              <Text style={styles.photoActionText}>{isKn ? "ಗ್ಯಾಲರಿ" : "Gallery"}</Text>
            </TouchableOpacity>
          </View>

          {images.length > 0 && (
            <View style={styles.previewImagesRow}>
              {images.map((uri, idx) => (
                <View key={idx} style={styles.previewWrapper}>
                  <Image source={{ uri }} style={styles.previewImage} />
                  <TouchableOpacity
                    style={styles.removeImageBadge}
                    onPress={() => removeImage(idx)}
                  >
                    <X size={12} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Submit Button */}
        <ScalePressable
          onPress={handleSubmit}
          disabled={submitting}
          style={[styles.submitButton, submitting && { opacity: 0.7 }]}
        >
          {submitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Send size={18} color="#ffffff" />
              <Text style={styles.submitButtonText}>
                {isKn ? "ಪ್ರಶ್ನೆ ಪ್ರಕಟಿಸಿ" : "Post Question to Community"}
              </Text>
            </View>
          )}
        </ScalePressable>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

// ----------------------------------------------------
// 2. QUESTION DETAIL SCREEN
// ----------------------------------------------------
export function QuestionDetailScreen() {
  const { params, back } = useNav()
  const { lang } = useLang()
  const { profile } = useProfile()
  const insets = useSafeAreaInsets()
  const isKn = lang === "kn"

  const questionId = params?.id as string
  const [question, setQuestion] = useState<CommunityQuestion | null>(
    (params?.question as CommunityQuestion) || null
  )
  const [loading, setLoading] = useState(!question)
  const [answerText, setAnswerText] = useState("")
  const [submittingAnswer, setSubmittingAnswer] = useState(false)
  const [previewZoomImage, setPreviewZoomImage] = useState<string | null>(null)

  React.useEffect(() => {
    if (!questionId) return
    fetchQuestionById(questionId).then((q) => {
      if (q) setQuestion(q)
      setLoading(false)
    })
  }, [questionId])

  const handleUpvoteQuestion = async () => {
    if (!question) return
    const updated = await toggleQuestionUpvote(question.id, profile.mobile)
    if (updated) setQuestion(updated)
  }

  const handleUpvoteAnswer = async (ansId: string) => {
    if (!question) return
    const updatedAns = await toggleAnswerUpvote(question.id, ansId, profile.mobile)
    if (updatedAns) {
      setQuestion((prev) => {
        if (!prev) return null
        return {
          ...prev,
          answers: prev.answers.map((a) => (a.id === ansId ? updatedAns : a)),
        }
      })
    }
  }

  const handlePostAnswer = async () => {
    if (!answerText.trim()) {
      Alert.alert(
        isKn ? "ಉತ್ತರ ಅಗತ್ಯ" : "Answer Required",
        isKn ? "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪರಿಹಾರ ಅಥವಾ ಉತ್ತರವನ್ನು ಬರೆಯಿರಿ." : "Please type your answer or suggested remedy."
      )
      return
    }

    setSubmittingAnswer(true)
    try {
      const newAns = await postAnswer(question!.id, {
        content: answerText.trim(),
        authorName: profile.name || "Farmer",
        district: profile.district || "Karnataka",
        role: "farmer",
        mobile: profile.mobile || "9591502209",
      })

      setQuestion((prev) => {
        if (!prev) return null
        return {
          ...prev,
          answersCount: (prev.answersCount || 0) + 1,
          answers: [...prev.answers, newAns],
        }
      })
      setAnswerText("")
    } catch {
      Alert.alert(
        isKn ? "ದೋಷ" : "Error",
        isKn ? "ಉತ್ತರ ಸಲ್ಲಿಸಲು ವಿಫಲವಾಗಿದೆ." : "Failed to post answer."
      )
    } finally {
      setSubmittingAnswer(false)
    }
  }

  const renderRoleBadge = (role: string, verified?: boolean) => {
    if (role === "agronomist") {
      return (
        <View style={[styles.roleBadge, { backgroundColor: "#dcfce7" }]}>
          <Award size={12} color="#16a34a" />
          <Text style={[styles.roleBadgeText, { color: "#16a34a" }]}>
            {isKn ? "ಕೃಷಿ ವಿಜ್ಞಾನಿ (Agronomist)" : "Agronomist"}
          </Text>
        </View>
      )
    }
    if (role === "officer") {
      return (
        <View style={[styles.roleBadge, { backgroundColor: "#e0f2fe" }]}>
          <CheckCircle2 size={12} color="#0284c7" />
          <Text style={[styles.roleBadgeText, { color: "#0284c7" }]}>
            {isKn ? "ಕೃಷಿ ಅಧಿಕಾರಿ (Officer)" : "Agri Officer"}
          </Text>
        </View>
      )
    }
    if (role === "progressive_farmer") {
      return (
        <View style={[styles.roleBadge, { backgroundColor: "#fef3c7" }]}>
          <Sparkles size={12} color="#d97706" />
          <Text style={[styles.roleBadgeText, { color: "#d97706" }]}>
            {isKn ? "ಪ್ರಗತಿಪರ ರೈತ" : "Progressive Farmer"}
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top + 10, 42) }]}>
        <View style={styles.headerRow}>
          <ScalePressable onPress={back} scaleTo={0.9} style={styles.backButton}>
            <ChevronLeft size={22} color="#ffffff" />
          </ScalePressable>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.headerTitle}>
              {isKn ? "ಪ್ರಶ್ನೆ ವಿವರ" : "Question Discussion"}
            </Text>
            <Text style={styles.headerSubtitle}>
              {question ? `${question.crop} • ${question.district}` : ""}
            </Text>
          </View>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color="#256428" />
        </View>
      ) : !question ? (
        <View style={styles.loadingCenter}>
          <Text style={styles.emptyTitle}>
            {isKn ? "ಪ್ರಶ್ನೆ ಕಂಡುಬಂದಿಲ್ಲ" : "Question not found"}
          </Text>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 100 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Main Question Card */}
          <View style={styles.detailCard}>
            {/* Author Row */}
            <View style={styles.authorRow}>
              <View style={styles.avatarCircle}>
                {question.author.avatar ? (
                  <Image source={{ uri: question.author.avatar }} style={styles.avatarImg} />
                ) : (
                  <Text style={styles.avatarInitials}>
                    {question.author.name.charAt(0).toUpperCase()}
                  </Text>
                )}
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Text style={styles.authorName}>{question.author.name}</Text>
                  {renderRoleBadge(question.author.role, question.author.verified)}
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 2 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                    <MapPin size={11} color="#6b7280" />
                    <Text style={styles.metaSubText}>{question.district}</Text>
                  </View>
                  <Text style={styles.metaDot}>•</Text>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                    <Calendar size={11} color="#6b7280" />
                    <Text style={styles.metaSubText}>{question.createdAt}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Badges */}
            <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
              <View style={styles.cropBadge}>
                <Text style={styles.cropBadgeText}>{question.crop}</Text>
              </View>
              <View style={styles.districtBadge}>
                <Text style={styles.districtBadgeText}>{question.district}</Text>
              </View>
            </View>

            {/* Title & Description */}
            <Text style={styles.detailTitle}>{question.title}</Text>
            <Text style={styles.detailDescription}>{question.description}</Text>

            {/* Images */}
            {question.images && question.images.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: 14 }}
              >
                {question.images.map((imgUri, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => setPreviewZoomImage(imgUri)}
                    activeOpacity={0.85}
                  >
                    <Image source={{ uri: imgUri }} style={styles.detailThumb} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {/* Action Bar */}
            <View style={styles.detailActionBar}>
              <TouchableOpacity
                style={[styles.voteButton, question.isUpvoted && styles.voteButtonActive]}
                onPress={handleUpvoteQuestion}
              >
                <ThumbsUp
                  size={16}
                  color={question.isUpvoted ? "#16a34a" : "#4b5563"}
                  fill={question.isUpvoted ? "#16a34a" : "transparent"}
                />
                <Text
                  style={[
                    styles.voteButtonText,
                    question.isUpvoted && { color: "#16a34a", fontWeight: "700" },
                  ]}
                >
                  {question.upvotes} {isKn ? "ಉಪಯುಕ್ತ" : "Helpful"}
                </Text>
              </TouchableOpacity>

              <View style={styles.answersCountTag}>
                <MessageSquare size={16} color="#6b7280" />
                <Text style={styles.answersCountText}>
                  {question.answersCount} {isKn ? "ಉತ್ತರಗಳು" : "Answers"}
                </Text>
              </View>
            </View>
          </View>

          {/* Answers Header */}
          <View style={styles.answersSectionHeader}>
            <Text style={styles.answersSectionTitle}>
              {isKn
                ? `ಉತ್ತರಗಳು ಮತ್ತು ಪರಿಹಾರಗಳು (${question.answers?.length || 0})`
                : `Answers & Expert Solutions (${question.answers?.length || 0})`}
            </Text>
          </View>

          {/* Answers List */}
          {question.answers && question.answers.length > 0 ? (
            question.answers.map((ans) => {
              return (
                <View key={ans.id} style={styles.answerCard}>
                  <View style={styles.authorRow}>
                    <View style={styles.avatarCircleSmall}>
                      {ans.author.avatar ? (
                        <Image source={{ uri: ans.author.avatar }} style={styles.avatarImg} />
                      ) : (
                        <Text style={styles.avatarInitialsSmall}>
                          {ans.author.name.charAt(0).toUpperCase()}
                        </Text>
                      )}
                    </View>
                    <View style={{ flex: 1, marginLeft: 8 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                        <Text style={styles.answerAuthorName}>{ans.author.name}</Text>
                        {renderRoleBadge(ans.author.role, ans.author.verified)}
                      </View>
                      <Text style={styles.answerMetaText}>
                        {ans.author.district} • {ans.createdAt}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.answerContent}>{ans.content}</Text>

                  {ans.image && (
                    <TouchableOpacity onPress={() => setPreviewZoomImage(ans.image!)}>
                      <Image source={{ uri: ans.image }} style={styles.answerImage} />
                    </TouchableOpacity>
                  )}

                  <View style={styles.answerFooter}>
                    <TouchableOpacity
                      style={[styles.answerVoteBtn, ans.isUpvoted && styles.answerVoteBtnActive]}
                      onPress={() => handleUpvoteAnswer(ans.id)}
                    >
                      <ThumbsUp
                        size={14}
                        color={ans.isUpvoted ? "#16a34a" : "#6b7280"}
                        fill={ans.isUpvoted ? "#16a34a" : "transparent"}
                      />
                      <Text
                        style={[
                          styles.answerVoteText,
                          ans.isUpvoted && { color: "#16a34a", fontWeight: "700" },
                        ]}
                      >
                        {ans.upvotes}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )
            })
          ) : (
            <View style={styles.noAnswersBox}>
              <Text style={styles.noAnswersText}>
                {isKn
                  ? "ಇನ್ನೂ ಯಾವುದೇ ಉತ್ತರಗಳು ಬಂದಿಲ್ಲ. ಮೊದಲ ಪರಿಹಾರವನ್ನು ನೀವೇ ನೀಡಿ!"
                  : "No answers yet. Be the first to share advice or remedy!"}
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* Pinned Reply Box */}
      <View style={[styles.replyBoxContainer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TextInput
          style={styles.replyInput}
          placeholder={
            isKn
              ? "ನಿಮ್ಮ ಅನುಭವ ಅಥವಾ ಪರಿಹಾರವನ್ನು ಬರೆಯಿರಿ..."
              : "Share your solution or treatment remedy..."
          }
          placeholderTextColor="#9ca3af"
          value={answerText}
          onChangeText={setAnswerText}
          multiline
          maxLength={500}
        />
        <ScalePressable
          onPress={handlePostAnswer}
          disabled={submittingAnswer || !answerText.trim()}
          style={[
            styles.sendAnswerBtn,
            (!answerText.trim() || submittingAnswer) && { backgroundColor: "#9ca3af" },
          ]}
        >
          {submittingAnswer ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Send size={18} color="#ffffff" />
          )}
        </ScalePressable>
      </View>

      {/* Image Zoom Modal */}
      <Modal visible={!!previewZoomImage} transparent animationType="fade">
        <View style={styles.zoomModalBg}>
          <TouchableOpacity
            style={styles.zoomModalClose}
            onPress={() => setPreviewZoomImage(null)}
          >
            <X size={24} color="#ffffff" />
          </TouchableOpacity>
          {previewZoomImage && (
            <Image
              source={{ uri: previewZoomImage }}
              style={styles.zoomImageFull}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </KeyboardAvoidingView>
  )
}

// ----------------------------------------------------
// 3. BLOG READER MODAL
// ----------------------------------------------------
export function BlogReaderModal({
  blog,
  onClose,
  onLike,
}: {
  blog: CommunityBlog | null
  onClose: () => void
  onLike: (b: CommunityBlog) => void
}) {
  const insets = useSafeAreaInsets()
  const { lang } = useLang()
  const isKn = lang === "kn"

  if (!blog) return null

  return (
    <Modal visible={!!blog} animationType="slide">
      <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
        <View style={[styles.header, { paddingTop: Math.max(insets.top + 10, 42) }]}>
          <View style={styles.headerRow}>
            <ScalePressable onPress={onClose} scaleTo={0.9} style={styles.backButton}>
              <ChevronLeft size={22} color="#ffffff" />
            </ScalePressable>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.headerTitle} numberOfLines={1}>
                {isKn ? "ಕೃಷಿ ಲೇಖನ" : "Agronomy Guide"}
              </Text>
              <Text style={styles.headerSubtitle}>
                {blog.crop} • {blog.readTime}
              </Text>
            </View>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 40 }}
          showsVerticalScrollIndicator={false}
        >
          {blog.coverImage ? (
            <Image source={{ uri: blog.coverImage }} style={styles.blogDetailCover} />
          ) : null}

          <View style={{ flexDirection: "row", gap: 8, marginTop: 16 }}>
            <View style={styles.cropBadge}>
              <Text style={styles.cropBadgeText}>{blog.crop}</Text>
            </View>
            <View style={styles.districtBadge}>
              <Text style={styles.districtBadgeText}>{blog.district}</Text>
            </View>
          </View>

          <Text style={styles.blogDetailTitle}>{blog.title}</Text>

          <View style={styles.blogAuthorCard}>
            <View style={styles.avatarCircleSmall}>
              {blog.author.avatar ? (
                <Image source={{ uri: blog.author.avatar }} style={styles.avatarImg} />
              ) : (
                <Text style={styles.avatarInitialsSmall}>
                  {blog.author.name.charAt(0).toUpperCase()}
                </Text>
              )}
            </View>
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={styles.authorName}>{blog.author.name}</Text>
              <Text style={styles.metaSubText}>
                {blog.author.district} • {blog.createdAt}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.blogLikeBtn, blog.isLiked && styles.blogLikeBtnActive]}
              onPress={() => onLike(blog)}
            >
              <ThumbsUp
                size={16}
                color={blog.isLiked ? "#16a34a" : "#6b7280"}
                fill={blog.isLiked ? "#16a34a" : "transparent"}
              />
              <Text
                style={[
                  styles.blogLikeText,
                  blog.isLiked && { color: "#16a34a", fontWeight: "700" },
                ]}
              >
                {blog.likes}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.blogDetailBody}>{blog.content}</Text>
        </ScrollView>
      </View>
    </Modal>
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
    paddingBottom: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
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
    marginTop: 2,
  },
  formContainer: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111827",
  },
  textArea: {
    minHeight: 120,
  },
  charCount: {
    alignSelf: "flex-end",
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 4,
  },
  chipRow: {
    flexDirection: "row",
  },
  chip: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: "#256428",
    borderColor: "#256428",
  },
  chipText: {
    fontSize: 13,
    color: "#4b5563",
    fontWeight: "500",
  },
  chipTextActive: {
    color: "#ffffff",
    fontWeight: "600",
  },
  photoActionsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  photoActionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#256428",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  photoActionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#256428",
  },
  previewImagesRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  previewWrapper: {
    position: "relative",
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  removeImageBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#ef4444",
    alignItems: "center",
    justifyContent: "center",
  },
  submitButton: {
    backgroundColor: "#256428",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },

  // Detail Screen Styles
  loadingCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "600",
  },
  detailCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 16,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#dcfce7",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarCircleSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#dcfce7",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
  },
  avatarInitials: {
    fontSize: 16,
    fontWeight: "700",
    color: "#256428",
  },
  avatarInitialsSmall: {
    fontSize: 14,
    fontWeight: "700",
    color: "#256428",
  },
  authorName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  answerAuthorName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  metaSubText: {
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  cropBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#059669",
  },
  districtBadge: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  districtBadgeText: {
    fontSize: 12,
    color: "#4b5563",
  },
  detailTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    marginTop: 12,
    lineHeight: 24,
  },
  detailDescription: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 22,
    marginTop: 8,
  },
  detailThumb: {
    width: 140,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  detailActionBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    marginTop: 16,
    paddingTop: 12,
  },
  voteButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
  },
  voteButtonActive: {
    backgroundColor: "#dcfce7",
  },
  voteButtonText: {
    fontSize: 13,
    color: "#4b5563",
    fontWeight: "600",
  },
  answersCountTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  answersCountText: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "500",
  },
  answersSectionHeader: {
    marginBottom: 12,
  },
  answersSectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1f2937",
  },
  answerCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#256428",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  answerMetaText: {
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 1,
  },
  answerContent: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 21,
    marginTop: 8,
  },
  answerImage: {
    width: "100%",
    height: 160,
    borderRadius: 8,
    marginTop: 10,
  },
  answerFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  answerVoteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    backgroundColor: "#f3f4f6",
  },
  answerVoteBtnActive: {
    backgroundColor: "#dcfce7",
  },
  answerVoteText: {
    fontSize: 12,
    color: "#4b5563",
    fontWeight: "600",
  },
  noAnswersBox: {
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 14,
    alignItems: "center",
  },
  noAnswersText: {
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
  },
  replyBoxContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 8,
    gap: 8,
  },
  replyInput: {
    flex: 1,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    color: "#111827",
    maxHeight: 100,
  },
  sendAnswerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#256428",
    alignItems: "center",
    justifyContent: "center",
  },
  zoomModalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.92)",
    alignItems: "center",
    justifyContent: "center",
  },
  zoomModalClose: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  zoomImageFull: {
    width: "95%",
    height: "80%",
  },

  // Blog Reader Styles
  blogDetailCover: {
    width: "100%",
    height: 200,
    borderRadius: 14,
  },
  blogDetailTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginTop: 12,
    lineHeight: 28,
  },
  blogAuthorCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 12,
    marginVertical: 14,
  },
  blogLikeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  blogLikeBtnActive: {
    backgroundColor: "#dcfce7",
    borderColor: "#86efac",
  },
  blogLikeText: {
    fontSize: 13,
    color: "#4b5563",
    fontWeight: "600",
  },
  blogDetailBody: {
    fontSize: 15,
    lineHeight: 25,
    color: "#374151",
  },
})
