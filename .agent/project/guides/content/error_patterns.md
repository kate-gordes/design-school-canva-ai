## Error Message Patterns

Scenario-based patterns for writing helpful error messages. Each pattern shows trigger → what to say → how to fix.

Every error message must have two parts:

1. **What happened** (in simple terms, no jargon)
2. **How to fix it** (specific, actionable steps)

Never blame the user. Never use: error, failed, invalid, wrong, fault, unfortunately, sorry, oops.

### Form Validation Errors

#### Email Validation

**Trigger**: User submits form without email or with invalid format  
**Pattern**: "Please enter [what's needed]"

- Empty field: "Please enter your email address"
- Invalid format: "Please enter a valid email address"
- Email not found: "We couldn't find that email. Try another or create an account"

**Why this works**: Direct, no blame, clear next step

#### Password Validation

**Trigger**: Password doesn't meet requirements or doesn't match confirmation  
**Pattern**: "[What's wrong with password]. [Requirement or fix]"

- Empty field: "Please enter your password"
- Too short: "Password must be at least 8 characters"
- Doesn't match: "Passwords don't match. Try again"
- Wrong password: "That password isn't correct. Try again or reset your password"

**Why this works**: States the rule clearly, suggests fix

#### Required Fields

**Trigger**: User tries to submit with empty required fields  
**Pattern**: "Please [complete action]" or "[Field name] is required"

- Generic: "Please complete all required fields"
- Specific: "Please enter your name"
- Multiple: "Please enter your email address and password"

**Why this works**: Tells exactly what to do

### Network and Connection Errors

#### Connection Lost

**Trigger**: Network drops or can't reach Canva servers  
**Pattern**: "We couldn't connect to [service]. [Check/action]"

- Lost connection: "We couldn't connect to Canva. Check your internet connection and try again"
- Can't reach server: "We're having trouble connecting. Check your internet and try again"
- No internet: "You're offline. Check your connection to use Canva"

**Why this works**: Doesn't assume blame, suggests practical check

#### Timeout Errors

**Trigger**: Request takes too long to complete  
**Pattern**: "This is taking longer than usual. [What to try]"

- Slow loading: "This is taking longer than usual. Try again or check back later"
- Upload timeout: "Your upload is taking a while. Check your connection and try again"
- Save timeout: "Saving is taking longer than usual. Give it a moment or try again"

**Why this works**: Acknowledges the wait, offers options

#### Server Errors

**Trigger**: Something breaks on Canva's end  
**Pattern**: "Something went wrong on our end. [When to try again]"

- General server error: "Something went wrong on our end. Try again in a moment"
- Service unavailable: "Canva is updating to serve you better. Check back in [time]"
- Scheduled maintenance: "We're making improvements. Canva will be back at [time]"

**Why this works**: Takes responsibility, sets expectations

### File and Upload Errors

#### File Type Not Supported

**Trigger**: User tries to upload unsupported file format  
**Pattern**: "This file type isn't supported. Try [supported types]"

- Image format: "This file type isn't supported. Try JPG, PNG, or PDF"
- Video format: "This file type isn't supported. Try MP4 or MOV"
- Document format: "This file type isn't supported. Try PDF, DOCX, or PPTX"

**Why this works**: Names what's supported, clear alternatives

#### File Too Large

**Trigger**: File exceeds size limit  
**Pattern**: "This file is too large. [State limit or suggest fix]"

- Generic: "This file is too large. Files must be under 25MB"
- Image: "This image is too large. Try a smaller file or compress it"
- Video: "This video is too large. Files must be under 500MB"

**Why this works**: States the limit, suggests action

#### Upload Failed

**Trigger**: Upload fails for any reason  
**Pattern**: "We couldn't upload [item]. [What to check/try]"

- General: "We couldn't upload your file. Check your connection and try again"
- Multiple files: "We couldn't upload some files. Check your connection and try again"
- Corrupted file: "This file appears damaged. Try uploading a different version"

**Why this works**: Clear about what failed, what to try

### Permission and Access Errors

#### No Access to Resource

**Trigger**: User tries to open something they don't have permission for  
**Pattern**: "You don't have access to [item]. [How to get access]"

- Design: "You don't have access to this design. Ask the owner to share it with you"
- Folder: "You don't have access to this folder. Ask the owner for permission"
- Team: "You don't have access to this team. Contact your team admin"

**Why this works**: Explains who can help

#### Link Expired

**Trigger**: User clicks expired share link  
**Pattern**: "This link has expired. [How to get new one]"

- Share link: "This link has expired. Request a new one from the sender"
- Invitation: "This invitation has expired. Ask for a new invite"
- Reset link: "This reset link has expired. Request a new one"

**Why this works**: Clear about status, how to resolve

#### Session Expired

**Trigger**: User's login session times out  
**Pattern**: "Your session has expired. [What to do next]"

- General: "Your session has expired. Sign in again to continue"
- During action: "Your session expired while saving. Sign in and try again"

**Why this works**: Minimal disruption, clear fix

### Payment and Billing Errors

#### Payment Failed

**Trigger**: Payment doesn't process  
**Pattern**: "We couldn't process your payment. [What to check]"

- Card declined: "We couldn't process your payment. Check your card details and try again"
- Expired card: "Your card has expired. Update your payment method and try again"
- Insufficient funds: "We couldn't process your payment. Check your account balance and try again"

**Why this works**: Respectful, suggests checks without assuming

#### Billing Issue

**Trigger**: Problem with subscription or billing  
**Pattern**: "There's an issue with [billing aspect]. [What to do]"

- Can't update: "We couldn't update your billing info. Try again or contact support"
- Plan change failed: "We couldn't change your plan. Try again or contact support"

**Why this works**: Names the issue, offers help path

### Save and Sync Errors

#### Can't Save

**Trigger**: Save operation fails  
**Pattern**: "We couldn't save [item]. [What happened / what to try]"

- Network issue: "We couldn't save your changes. Check your connection and try again"
- Server issue: "We couldn't save your design. Try again in a moment"
- Offline: "Changes saved to your device. We'll sync when you're back online"

**Why this works**: Transparent about what happened, preserves work when possible

#### Sync Conflict

**Trigger**: Multiple people edit at once  
**Pattern**: "[What changed]. [What to do]"

- Conflicting edits: "Someone else edited this design. Reload to see the latest version"
- Version mismatch: "This design was updated. Refresh to see the latest changes"

**Why this works**: Explains situation, clear resolution

### Feature Limit Errors

#### Quota Reached

**Trigger**: User hits plan limit  
**Pattern**: "You've reached the [limit] ([number]). [How to proceed]"

- Font limit: "You've reached the font limit (100). Remove fonts to add new ones"
- Storage limit: "You've reached your storage limit (5GB). Delete designs or upgrade your plan"
- Team limit: "You've reached the team member limit. Upgrade to add more people"

**Why this works**: States limit clearly, offers solutions

#### Feature Not Available

**Trigger**: User tries to use feature not in their plan  
**Pattern**: "This feature is available in [plan]. [How to get it]"

- Premium feature: "This feature is available in Canva Pro. Upgrade to unlock it"
- Team feature: "This feature is available for teams. Contact your admin"

**Why this works**: No blame, clear upgrade path

### Search and Filter Errors

#### No Results

**Trigger**: Search returns nothing  
**Pattern**: "No results for '[query]'. [What to try next]"

- Search: "No results for '[search term]'. Try different keywords or browse templates"
- Filter: "No designs match these filters. Try different options or clear filters"
- Empty: "Nothing here yet. Create your first design to get started"

**Why this works**: Acknowledges effort, suggests alternatives

### Special Cases

#### Account Verification Required

**Trigger**: Account needs verification before proceeding  
**Pattern**: "We need to verify [what]. [How to verify]"

- Email: "We need to verify your email. Check your inbox for a verification link"
- Account: "We need to verify your account. Contact support for help"

**Why this works**: Clear what's needed, who can help

#### Rate Limiting

**Trigger**: User makes too many requests too quickly  
**Pattern**: "You're moving fast! [When to try again]"

- API limit: "You're moving fast! Take a break and try again in a moment"
- Export limit: "You've downloaded a lot today. Try again in [time]"

**Why this works**: Light tone, clear when to retry

#### Account Restricted

**Trigger**: Account has been blocked or restricted  
**Pattern**: "[What happened]. [Who to contact]"

- Suspended: "Your account has been suspended. Contact support for help"
- Restricted: "Some features are restricted. Contact support to learn more"

**Why this works**: Serious but not alarming, clear help path

### Writing Error Messages: Quick Checklist

Before you ship an error message, verify:

- [ ] States what went wrong (no jargon)
- [ ] Says how to fix it (specific steps)
- [ ] Doesn't blame the user
- [ ] Skips these words: error, failed, invalid, wrong, oops, unfortunately, sorry
- [ ] No exclamation marks (except for critical security warnings)
- [ ] Would a 10-year-old know what to do?
- [ ] Is it translation-friendly?

### When to Include Error Codes

Only include error codes if:

- User needs to contact support
- The code helps support identify the issue

**Format**: "Contact us with error code [ABC123] for help"

Never show error codes alone without context. Always include human-readable explanation first.

### When to Link to Help

Link to help articles when:

- The solution requires multiple steps
- Additional context would be helpful
- The issue is complex to explain

**Format**: "Visit our Help Center" (link the text)

Keep the error message self-contained when possible. Only link if truly needed.
