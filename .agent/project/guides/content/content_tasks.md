## Content Design Tasks

Short, pragmatic playbooks for common content edits. Each task lists where to change content and what to check.

### Review button copy for clarity

- Files: Any component with `<Button>` elements
- Steps:
  - Find all button labels in the file
  - Check each label follows: verb + object pattern, sentence case, 3-4 words max
  - Verify aria-labels describe function, not appearance
  - Remove any punctuation (except question marks for confirmations)
- Test: Cover the button. Read just the label. Is the action 100% clear?

**Example fixes**:

- "SAVE NOW" → "Save design"
- "Click Here" → "Get started"
- "Delete Design?" → "Delete design?" (question mark is OK for destructive actions)

### Fix error message to be helpful

- Files: Form validation, API error handlers, file upload components
- Steps:
  - Identify where error text displays
  - Rewrite to follow 2-part structure: "[What happened]. [How to fix it]"
  - Remove blame words: error, failed, invalid, wrong, fault
  - Remove over-apologies: unfortunately, sorry, oops
  - Add specific next steps (what exactly should they do?)
- Test: If you saw this error, would you know exactly what to do next? Would a 10-year-old understand it?

**Example fixes**:

- "Error: Invalid email!" → "Please enter a valid email address"
- "Upload failed" → "We couldn't upload your file. Check your connection and try again"
- "Oops! Something went wrong!" → "We couldn't save your changes. Try again in a moment"

### Convert technical terms to plain language

- Files: Any user-facing copy (labels, tooltips, help text, navigation)
- Steps:
  - Scan for internal/technical terms
  - Replace with user-friendly equivalents (see table below)
  - Keep technical terms only in code comments and developer docs
- Test: Would someone outside Canva understand every word?

**Common replacements**:

- "doctype" → "design type"
- "object panel" → "tools panel" or just "tools"
- "canvas" → "workspace" or "design area"
- "editor" → "design editor" (first use) then "editor" (subsequent)
- "element" → be specific: "photo", "text", "shape"
- "asset" → "image", "file", "photo" (depending on context)

### Update navigation copy to be device-agnostic

- Files: Onboarding flows, help text, tooltips, instructions
- Steps:
  - Search for "click", "tap", "press", "hit"
  - Replace all with "select" (works across all devices)
  - Search for "click here" or "tap here" and replace with descriptive action
  - Use "go to" for navigation between containers (screens, tabs, menus)
- Test: Does the instruction work on desktop, tablet, and mobile?

**Example fixes**:

- "Click the Templates tab" → "Select the Templates tab"
- "Tap here to continue" → "Select Continue"
- "Click on File menu" → "Go to File menu"
- "Click Upload" → "Select Upload"

### Add helpful empty state copy

- Files: Empty folders, new projects, zero results, fresh boards
- Steps:
  - Identify what the empty container will hold
  - Write encouraging copy (1-2 sentences max)
  - Suggest a clear next action
  - Stay positive and brief
- Test: Does this make someone want to add their first item?

**Good patterns**:

- "This folder is full of potential. Add your first design to get started."
- "No templates yet. Create one to reuse your favorite designs."
- "Your Brand Kit is ready. Add your logo and colors to get started."

### Write clear form labels and helper text

- Files: Forms, input fields, settings pages
- Steps:
  - Label tells what goes in the field (sentence case)
  - Helper text explains requirements (if needed)
  - Placeholder shows format example (if helpful)
  - Error message tells what went wrong + how to fix
- Test: Can you fill out this form correctly without guessing?

**Good patterns**:

- Label: "Email address"
- Helper: "We'll use this to send you updates"
- Placeholder: "you@example.com"
- Error: "Please enter a valid email address"

### Create success message that celebrates user achievement

- Files: After save, publish, share, complete actions
- Steps:
  - Focus on what the user accomplished (not what Canva did)
  - Be specific about what happened
  - Include next step or location (if helpful)
  - Keep excitement balanced (one exclamation max)
- Test: Does this feel like celebrating the user, not Canva?

**Good examples**:

- "Design saved! You can find it in your Projects."
- "Published! Your design is now live."
- "Shared with 5 team members."

**Avoid**:

- "Canva successfully saved your file!" (makes it about Canva)
- "Woohoo!!! Amazing job!!!" (too excited)
- "Operation completed successfully" (too robotic)

### Add accessible alt text to images

- Files: Any component rendering images, icons, illustrations
- Steps:
  - Describe what's in the image (be specific and contextual)
  - Keep under 125 characters
  - End with a period (helps screen readers pause)
  - Skip "image of" or "picture of" (screen readers announce this)
  - Add type when helpful: "Illustration.", "Icon.", "Screenshot."
  - For decorative images, use empty alt: `alt=""`
- Test: If you couldn't see the image, would the alt text give you the same information?

**Good examples**:

- `alt="Team collaboration on whiteboard. Illustration."`
- `alt="Upload icon."`
- `alt="Monthly analytics showing 40% growth."`
- `alt=""` (for purely decorative images)

**Avoid**:

- `alt="Image of people"` (too vague)
- `alt="Picture showing a team working together on a whiteboard"` (redundant "picture showing")
- `alt="img_1234.png"` (filename not helpful)

### Fix mobile copy to be more concise

- Files: Mobile-specific screens, responsive components
- Steps:
  - Find copy that displays on mobile
  - Cut it down: front-load important info, remove fluff
  - Check character limits (see below)
  - Use "tap" only in mobile-specific contexts (otherwise use "select")
- Test: Does this fit on a small screen and still make sense?

**Character limits for mobile**:

- Push notification title: 30 characters
- Push notification body: 70 characters
- In-app message header: 30 characters
- In-app message body: 130 characters

**Example fixes**:

- "Would you like to share your design with your team members?" → "Share with team?"
- "To begin customizing your template, tap the Edit button" → "Tap Edit to customize"

### Check button labels use sentence case

- Files: All buttons across the app
- Steps:
  - Find all button labels (look for `<Button>` components)
  - Change to sentence case: first word capitalized, rest lowercase
  - Exception: proper nouns stay capitalized (e.g., "Save to Brand Kit")
- Test: Do all buttons follow consistent capitalization?

**Example fixes**:

- "Save Design" → "Save design"
- "CREATE NEW" → "Create new"
- "Try It Free" → "Try it free"
- "DOWNLOAD NOW" → "Download"

### Add AI disclaimer to AI-generated content

- Files: Any feature that uses AI to generate text, images, or designs
- Steps:
  - Add visible disclaimer near the generated content
  - Use this exact pattern: "[Feature name] can make mistakes. Please check for accuracy."
  - Add a way to report issues: "Report", "Give feedback", or "Let us know if this isn't right"
- Test: Is it clear to users that AI generated this and they should verify it?

**Good examples**:

- "Magic Write can make mistakes. Please check for accuracy."
- "Magic Design can make mistakes. Please check for accuracy."
- "This was generated by AI. Please verify before using."

### Review copy for translation readiness

- Files: Any user-facing copy that will be translated
- Steps:
  - Use standard US English (no regional slang)
  - Avoid idioms ("piece of cake", "hit the nail on the head")
  - Keep sentence structure simple: subject-verb-object
  - Include articles: a, an, the
  - Repeat subjects and verbs (don't drop them for brevity)
  - Avoid cultural references
- Test: Could this be translated word-for-word and still make sense?

**Translation-friendly**:

- "If you don't have an account, then you'll need to sign up."
- "To add text to your design, select the Text tab."
- "Your design is ready. Download it now."

**Hard to translate**:

- "No account? You'll wanna sign up!" (slang, dropped subject)
- "It's a piece of cake to add text!" (idiom)
- "Your design's ready—grab it!" (informal, unclear verb)
