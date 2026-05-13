# Mobile Design Testing Checklist

Canva's mission is to make design accessible to anyone, regardless of ability, device, or internet. In line with this mission, Canva strives to create mobile-first experiences that are simple, touch-friendly, and focused on core user tasks. This checklist outlines key areas and tests to ensure new features or designs work effectively on mobile devices. Not all tests apply to every project, so include the relevant ones for your "test party" (i.e. the scope of features under test). By incorporating these checks, you help ensure an optimal mobile experience for all users.

## 1. Mobile-First Design Principles

Your design should prioritize mobile users and enforce simplicity before adapting to larger screens. **What to do:** Start every design process with mobile considerations and work your way up to desktop:

- **Design mobile-first:** Begin with the smallest screen size and progressively enhance for larger screens. This ensures that core functionality works on mobile devices where most users interact with your product.
- **Use appropriate tap targets:** Ensure all interactive elements meet mobile accessibility standards with 44px+ tap targets. Don't just shrink desktop designs - create touch-friendly interfaces from the ground up.
- **Prioritize core user tasks:** Identify the primary actions users want to accomplish and make these prominent. Use progressive disclosure to reduce visual noise and cognitive load.
- **Leverage familiar patterns:** Use proven interaction patterns from popular mobile apps. Replace desktop-only actions (like hover states) with mobile-friendly alternatives like long-press or swipe gestures.
- **Design for real-world usage:** Test on actual devices, design for interruptions, and ensure resilience with auto-saving and offline capabilities.

_Expected result:_ The mobile experience feels native and intuitive. Users can accomplish their primary tasks quickly and efficiently without struggling with desktop-oriented interactions. The interface adapts gracefully from mobile to desktop without losing functionality or usability.

## 2. Touch Interaction and User Behavior

All mobile interactions should account for how users actually hold and use their devices. **What to do:** Design interfaces that work with natural touch patterns and grip positions:

- **Understand grip patterns:** 49% of users hold their phone one-handed, 36% cradle and tap with finger/thumb, and 15% use two hands. Thumbs drive 75% of all touch interactions, so design for thumb navigation.
- **Respect reach zones:** The center of the screen is easiest to reach and where people look first. Edges require more accuracy and effort. Place core actions in the center and bottom two-thirds of the screen.
- **Design for one-handed use:** Ensure that primary actions can be reached with a thumb when holding the device in one hand. Secondary actions can be placed in harder-to-reach areas.
- **Use appropriate gesture patterns:** Implement standard mobile gestures like swipe, pinch-to-zoom, and pull-to-refresh. Avoid custom gestures that users won't discover naturally.
- **Provide touch feedback:** Give immediate visual or haptic feedback for all touch interactions to confirm user actions.

_Why it matters:_ Mobile users have different physical constraints and expectations than desktop users. By designing for natural touch patterns and grip positions, you create interfaces that feel comfortable and efficient to use, reducing user frustration and improving task completion rates.

## 3. Layout and Information Architecture

Your mobile layout should organize information hierarchically and provide clear navigation paths. **What to do:** Structure content to support mobile user workflows:

- **Implement action zones:** Place core actions in the middle of the screen, secondary actions at the edges, and tertiary actions in corners. This follows natural thumb movement patterns.
- **Enable single-tap access:** Give users easy access to core tasks with single taps. Use off-canvas panels, bottom sheets, or modal overlays for secondary options.
- **Use progressive disclosure:** Show just enough information in the moment, offering more detail on request. This reduces cognitive load and improves focus on primary tasks.
- **Layer instead of stacking:** Use layered screens to elevate actions, create previews, break long flows into steps, and introduce different modes. Avoid deep navigation hierarchies.
- **Implement predictive interaction:** Show controls when users need them (copy/paste on text selection, contextual actions on swipe, navigation hints on scroll).

_Expected result:_ Users can quickly find and access the information and actions they need. The interface feels organized and purposeful, with clear visual hierarchy and logical information flow. Users don't get lost in complex navigation structures.

## 4. Technical Specifications and Constraints

Your design should meet mobile platform requirements and work across different device sizes. **What to do:** Test and validate your design against mobile technical standards:

- **Target appropriate screen sizes:** Design for iOS iPhone 13 mini (375x812) and Android 360x800 as baseline sizes, but keep older devices in mind for broader compatibility.
- **Respect safe areas:** Account for iOS status bar (47px) and home indicator (34px), and Android status bar (40px) and navigation indicator (28px). Ensure content doesn't get hidden behind system UI.
- **Use consistent margins:** Apply 16px margins from left and right edges for consistent spacing and readability.
- **Meet tap target requirements:** Use 48px as the baseline tap target size with 44px as the minimum. Avoid using `pointer:coarse`/`pointer:fine` media queries as they can be unreliable.
- **Test on actual devices:** Always test your design on real mobile devices, not just browser developer tools, to catch issues that only appear in real-world usage.

_Expected result:_ The design works consistently across different mobile devices and screen sizes. All interactive elements are easily tappable, content is properly spaced, and the interface respects platform conventions and constraints.

## 5. Design Laws and UX Principles

Your mobile design should follow established UX principles that improve usability and user satisfaction. **What to do:** Apply key design laws to create better mobile experiences:

- **Apply Hick's Law:** Reduce choices to essential options only. Fewer options lead to faster decisions and reduced cognitive load on mobile devices.
- **Follow Occam's Razor:** Choose simplicity over complexity. Remove unnecessary UI elements that don't serve a clear purpose.
- **Implement Fitt's Law:** Make critical actions prominent and within easy reach. Larger, more accessible targets are easier to tap accurately.
- **Use Chunking:** Organize information into manageable units. Break complex tasks into smaller steps and use progressive disclosure.
- **Apply Jakob's Law:** Use familiar patterns from popular mobile apps. Don't reinvent navigation or interaction patterns that users already know.

_Why it matters:_ These design laws are based on human psychology and behavior patterns. By following them, you create interfaces that feel intuitive and reduce the learning curve for users. This is especially important on mobile where screen real estate is limited and user attention is often divided.

## 6. Testing and Validation

Your mobile design should be thoroughly tested before launch to ensure it works in real-world conditions. **What to do:** Conduct comprehensive testing across different scenarios:

- **Before you start:** Define your mobile target device, identify core user tasks, and consider real-world usage context (one-handed use, interruptions, varying network conditions).
- **During design:** Test mobile-first approaches, verify 44px+ tap targets, place core actions in center/bottom areas, implement progressive disclosure, use familiar patterns, and test on actual devices.
- **Before launch:** Test on older devices, verify tap targets work properly, check safe areas are respected, test one-handed usage scenarios, validate core task completion rates, and ensure graceful degradation for edge cases.

_Expected result:_ The mobile experience is robust and reliable across different devices, usage scenarios, and user contexts. Users can successfully complete their primary tasks without encountering usability issues or technical problems.

## Additional Resources and Help

Mobile design is a complex topic that requires ongoing learning and adaptation. Here are additional resources and support channels available:

- **Mobile UX Research:** Key research on [How users hold mobile devices](https://www.uxmatters.com/mt/archives/2013/02/how-do-users-really-hold-mobile-devices.php), [Interaction media features](https://css-tricks.com/interaction-media-features-and-their-potential-for-incorrect-assumptions/), and [Training Wheels UI](https://www.nngroup.com/articles/training-wheels-user-interface/).
- **Design Laws:** Learn more about [Hick's Law](https://lawsofux.com/hicks-law/), [Occam's Razor](https://lawsofux.com/occams-razor), [Fitt's Law](https://lawsofux.com/fittss-law/), [Chunking](https://lawsofux.com/chunking/), and [Jakob's Law](https://lawsofux.com/jakobs-law/).

By utilizing these resources and following this checklist, you can continuously improve your mobile design skills. **Remember, mobile design is an ongoing process** – stay updated with new devices, user behaviors, and platform changes. Every improvement you make using this checklist brings Canva closer to its mission of empowering everyone to design and collaborate seamlessly across all devices.
