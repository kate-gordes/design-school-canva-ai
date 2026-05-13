## Content Design Guide

Quick, pragmatic guidance for writing Canva UI copy. This guide keeps your prototype content human, empowering, and inspiring.

If you're writing UI copy, start here. If you're fixing specific issues, check docs/content_tasks.md. For error messages, see docs/error_patterns.md.

### Voice: Human, Empowering, Inspiring

Every piece of copy should feel like a helpful human talking, not a robot. Check your work against these three principles:

**Human**

- Write like you speak (use contractions: it's, can't, don't)
- Stay warm and professional, not overly familiar
- Be conversational but skip the cutesy stuff

**Empowering**

- Use simple words everyone knows
- Focus on what users can achieve
- Skip jargon and intimidating technical terms

**Inspiring**

- Highlight what users accomplish, not what Canva does
- Use action-oriented language
- Keep it positive and supportive

**Quick check**: Read it aloud. Would you say this to a friend asking for help?

### Sentence Structure

Keep it simple and scannable:

- One idea per sentence
- Under 25 words per sentence
- Lead with verbs when possible
- Use active voice by default

**Good**: "Choose a template to start designing"  
**Avoid**: "To begin the design process, a template selection should be made"

### Word Choice

Pick clear, specific words:

- Use common words over fancy ones
- Skip modifiers (quite, very, really)
- Choose specific over vague
- Cut unnecessary words

**Good**: "Save your design"  
**Avoid**: "Save your really amazing design creation"

### Navigation Language

**Use "select" for any interaction**  
Works across desktop, mobile, and tablets.

- **Good**: "Select the Templates tab"
- **Avoid**: "Click/Tap the Templates tab"

**Use "go to" for moving between containers**  
Containers include: screens, folders, tabs, flyouts, menus, modals

**Examples**:

- "Go to ✨ Magic Studio"
- "Go to Projects, then select your design"
- "Go to File menu, then select Download"

### Button Labels

Buttons are verbs. Keep them short and clear:

- Use action verbs (Save, Delete, Download, Create)
- Keep to 3-4 words maximum
- Use sentence case (first word capitalized only)
- No punctuation unless it's a question

**Good examples**:

- "Get started"
- "Try it free"
- "Save changes"
- "Delete photo?"

**Avoid**:

- "Click Here!"
- "Submit Now"
- "DOWNLOAD"

**Quick check**: Cover everything else on screen. Does the button label alone tell you what happens when you click?

### Form Fields and Labels

Keep forms simple and helpful:

- Use sentence case for labels
- Be specific about requirements ("Password must be at least 8 characters")
- Keep placeholder text minimal
- Provide helpful feedback when things go wrong

### Empty States

Turn empty spaces into encouraging next steps:

- Be positive and helpful
- Suggest what to do next
- Keep it brief

**Example**: "This folder is full of potential. Add your first design to get started."

### Success Messages

Celebrate user achievements, not Canva's features:

- Focus on what they accomplished
- Keep excitement balanced (no excessive exclamation marks)
- Be specific about what happened

**Example**: "Design saved! You can find it in your Projects."

### Accessibility in Copy

**Alt text guidelines**:

- Be specific and contextual
- Keep under 125 characters
- End with a period (helps screen readers pause)
- Skip "image of" (screen readers announce this automatically)
- Note special types when relevant: "illustration," "icon," etc.

**Good**: "Team collaboration on whiteboard. Illustration."  
**Avoid**: "Image of people working"

**Icon labels**:

- Always include text labels with icons
- Add aria-labels for icon-only buttons
- Describe function, not appearance

**Example**: "Select ➕ (Add element)" not just "Select ➕"

### Tone Variations by Context

**Celebratory** (for achievements):

- Excited but not ecstatic
- Focus on user success
- "Congratulations on creating 100 designs!"

**Encouraging** (for next steps):

- Enthusiastic but not patronizing
- Highlight benefits
- "Ready to share your design with the world?"

**Supportive** (for help/errors):

- Understanding but not over-apologetic
- Solution-focused
- "Let's fix this together. Try..."

**Informative** (for instructions):

- Direct but not bossy
- Clear and educational
- "To add text, select the Text tab"

### Mobile Copy Adjustments

Mobile screens have less space, so be even more concise:

- Front-load important information
- Use "tap" instead of "select" for mobile-only contexts
- Character limits:
  - Push notification title: 30 characters
  - Push notification body: 70 characters
  - In-app message header: 30 characters
  - In-app message body: 130 characters

### Canva Terminology Standards

**Always use these terms**:

- **design** (not project, file, or document)
- **template** (pre-made content to customize)
- **Brand Kit** (central repository for brand assets)
- **select** (for interactions)
- **folder** (for organizing designs)

**Never use these**:

- Technical jargon (doctype, editor, object panel)
- Multiple words for the same concept
- Directional cues (left, right, above, below)
- "Click here" or "tap here"

### Writing for Translation

Make content easy to translate:

- Use standard US English
- Avoid idioms, slang, and cultural references
- Keep sentence structure simple (subject-verb-object)
- Repeat subjects and verbs for clarity
- Include articles (a, an, the)

**Good for translation**: "If you don't have an account, then you'll need to sign up."  
**Hard to translate**: "No account? You'll wanna sign up!"

### AI-Generated Content Disclaimers

For any AI feature that generates text, include a visible disclaimer:
"[Feature name] can make mistakes. Please check for accuracy."

Always provide a way to report issues:

- "Report"
- "Give feedback"
- "Let us know if this isn't right"

### Quick Verification Checklist

Before finalizing copy, check:

- [ ] Sentences under 25 words
- [ ] Active voice used
- [ ] No jargon or technical terms
- [ ] Clear call-to-action
- [ ] Device-agnostic language (use "select" not "click/tap")
- [ ] Follows Canva terminology
- [ ] Translation-friendly structure
- [ ] Appropriate tone for context
- [ ] Icons have text labels or aria-labels

### Resources

- Content help: #pd-content-design-help
- For common content fixes: docs/content_tasks.md
- For error message patterns: docs/error_patterns.md
- For AI review workflow: docs/CONTENT_AGENT.md
