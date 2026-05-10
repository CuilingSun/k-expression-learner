# PRD — K-Expression Learner (MVP)

## 1. Product Overview

**Product Name:** K-Expression Learner

**Positioning:**
A flexible Korean expression learning tool that helps intermediate learners master natural, native-like expressions from K-dramas through structured yet self-paced learning with AI-powered feedback.

**Core Value:**
From passive listening → active understanding → confident expression

**Target User:**
- Intermediate Korean learners (like me) with some foundation
- Passionate about K-dramas and Korean culture
- Want to learn naturally from content, not textbooks
- Seek clear feedback on naturalness and usage

**Non-target:**
- Complete beginners
- Test-focused learners (TOPIK prep)
- Users wanting scheduled daily lessons

---

## 2. Problem Statement

**Current Frustration:**
When watching K-dramas with subtitles, I hear expressions I don't fully understand. I want to:
1. Quickly learn the natural way to express something
2. Understand nuances and when/where to use it
3. Know why it's better than textbook alternatives
4. Actually retain and use it

**Gap:**
Existing tools are either too rigid (classroom-like) or too passive (no feedback). There's no system that says: "Learn whenever you want, but here's a smart pathway and deep feedback."

---

## 3. Core Concept

**Expression-Based Learning**
- **Expression** = Scenario + Tone + Grammar + Cultural Context
- Not just "learn vocabulary," but "learn to express naturally"
- Each expression has 3 layers: Understanding → Using → Explaining

---

## 4. MVP Features

### 4.1 Learning Pathways (Dual Mode)

**A. Recommended Sequence (Main Path)**
- 20-30 curated expressions organized by level
- Level 1: Most common everyday expressions
- Level 2: Emotional/situational nuances  
- Level 3: Advanced/subtle differences
- Level 4: Idioms and cultural references
- User can follow order OR jump around
- Progress tracked: Not Started → Learning → Mastered

**B. Free Exploration (Self-directed)**
- Search by Korean text, Chinese meaning, or theme
- Browse by K-drama or topic
- Add custom expressions to learning list
- Randomize learning for variety

### 4.2 Expression Card (Core Learning Unit)

Each expression card contains:

1. **K-drama Context**
   - 10-15s video clip
   - Scene description + emotional tone

2. **Deep Explanation (AI-generated)**
   - Natural usage with nuances
   - 2-3 similar expressions + how they differ
   - Grammar structure (why it's natural)
   - Cultural/contextual background

3. **Rewrite Task**
   - Given a scenario, user writes a sentence using the expression
   - AI provides feedback: Better phrasing → Explanation → Alternative answers

4. **Personal Notes**
   - User can save their own examples or understanding

### 4.3 Mastery Framework

User masters an expression when they:
- ✓ Understand its meaning and nuances
- ✓ Successfully use it in Rewrite tasks
- ✓ Know when/where to use it (scenario + tone)
- ✓ Can explain why it's better than alternatives
- ✓ Mark it as "Mastered" (user confirms)

### 4.4 Spaced Repetition System

- Expressions flagged for review reappear on configurable intervals
- Visual progress: mastery timeline showing which expressions need reinforcement
- Rewrite tasks with different scenarios each time

### 4.5 Progress Tracking

- Total expressions learned
- Mastery breakdown (pie chart: Beginner / Intermediate / Advanced)
- Streak counter (consecutive days learning)
- Personalized stats

---

## 5. AI Design

**Three Roles of AI:**

### Role 1: Explainer
- Generate detailed breakdown for each expression
- Input: {Korean expression, K-drama scene, English translation}
- Output: {Natural usage explanation, 2-3 variants, comparison to similar expressions, cultural context}
- Tone: Conversational, encouraging

### Role 2: Feedback Provider
- Evaluate user's Rewrite attempts
- Input: {User's Korean sentence, Target expression, Scenario}
- Output: {More natural version, Why explanation, 1-2 alternatives, Tip for future}
- Focus on: Tone, naturalness, grammar appropriateness

### Role 3: Smart Recommender
- Suggest next expression based on user history
- Consider: Difficulty progression, relatedness, user's mastery level
- Optional: Time-aware (suggest review-needed expressions periodically)

---

## 6. MVP Scope (Weeks 1-2)

### Content
- 20-30 hand-picked expressions from 5-10 favorite K-dramas
- Each with K-drama clip, AI explanation, one Rewrite task

### Features
- Simple card interface (Korean + meaning + K-drama context)
- Basic learning sequence (by difficulty)
- Rewrite task + AI feedback
- Progress tracker (3 states: Not started / Learning / Mastered)
- SQLite local storage

### Tech Stack
- **Frontend:** React or Vue.js
- **Backend:** Node.js or Python
- **Database:** SQLite (local)
- **AI:** Claude API (for explanations + feedback)
- **Video:** Embedded clips or external links

### Cost Estimate
- **Development:** 0 (your time)
- **Infrastructure:** $0 (local)
- **AI (Claude):** $0-5/month during development (using free trial)

---

## 7. User Flow

### Scenario A: Following Recommended Path
1. Open app → See "Today's suggestion: 안녕하세요 alternatives"
2. Watch K-drama clip (8 seconds)
3. Read AI explanation
4. Attempt Rewrite task
5. Get AI feedback
6. Mark as "Learned" or "Need review"
7. System suggests next expression

### Scenario B: Free Exploration
1. Remember hearing a phrase → Search it
2. See AI explanation + variants
3. Do optional Rewrite task
4. Save to "My expressions" list

### Scenario C: Reviewing
1. App shows "Time to review 그렇구나"
2. See your previous notes
3. Do a new Rewrite scenario
4. Strengthen memory

---

## 8. UI Principles

- **Input-first:** Rewrite task is primary (not passive video watching)
- **One focus per screen:** Don't overwhelm with too much info
- **Clear comparisons:** Show side-by-side similar expressions
- **Minimal chrome:** Remove unnecessary UI elements
- **Instant feedback:** User sees results immediately after Rewrite

---

## 9. Personalization (Phase 2+)

Personalization based on:
- User's mastery history (what they struggle with)
- Grammar patterns (systematic weaknesses)
- K-drama preferences (recommend expressions from shows they like)

Used for:
- Next expression recommendation
- Difficulty adjustment
- Content suggestions

---

## 10. Success Metrics

- **Usage:** Days active per week
- **Engagement:** Expressions reviewed per session
- **Learning:** % of expressions mastered (80%+ accuracy on Rewrite)
- **Retention:** How often user returns after initial use

---

## 11. Roadmap

**Phase 1 (MVP, Weeks 1-2):**
- Recommended sequence + Free search
- Basic Rewrite + AI feedback
- Progress tracking

**Phase 2 (Weeks 3-6):**
- Spaced repetition system
- Personalized recommendations
- Import custom expressions

**Phase 3 (Future):**
- Conversation mode (speaking practice)
- Community (share expressions, see others' examples)
- Mobile app
- More K-dramas integrated

---

## 12. Differentiation

This is not a typical language learning app because:
1. **Expression-focused**, not grammar/vocabulary-focused
2. **Self-paced with structure**, not rigid curriculum
3. **K-drama context**, making learning engaging, not obligation
4. **Three-layer mastery** (understand + use + explain), not just recognition
5. **Made for me**, optimized for my learning style (not compromised for mass market)
