# AI Town Roadmap

## Phase 1: Atmosphere & Polish

### Day/Night Cycle
- Animate sky color transitioning over time (dark navy → sunrise → blue → sunset → night)
- Window glow intensity tied to time of day (more windows lit at night, fewer during day)
- Warm lamp glow at night, subtle shadows during day
- Optional: tie to user's real local time

### Weather Effects
- Rain: pixel droplets falling + puddle reflections on roads
- Snow: falling flakes + white accumulation on rooftops
- Clouds: drifting across the sky layer
- Could be random per visit or tied to real weather API

### Animated Smoke/Chimneys
- Pixel smoke puffs rising from tower rooftops
- Subtle particle animation, dissipates as it rises

### Town Controls (Action Menu)
- Floating action button (FAB) or toolbar overlay on the canvas
- On click/tap, expands into a radial or list menu with actions:
  - **Center Town** — reset camera to the center of the town
  - **Zoom In / Zoom Out** — explicit buttons (in addition to scroll wheel)
  - **Fit to Screen** — auto-zoom to show the entire town
  - **Toggle Cinematic Mode** — switch between interactive and auto-pan
  - **Fullscreen** — enter/exit browser fullscreen
  - **Toggle Grid** — show/hide tile grid overlay (debug/fun)
  - **Toggle Peeps** — show/hide animated peeps
- Keyboard shortcuts for power users (C = center, +/- = zoom, F = fullscreen)
- Responsive: works as bottom bar on mobile, floating menu on desktop

### Sound Design
- Ambient lo-fi background soundtrack
- Footstep sounds for peeps
- Door chime when clicking a building
- Weather-specific SFX (rain patter, wind)
- Volume control / mute toggle

---

## Phase 2: Town Life & Interactivity

### Peep Interactions
- Two peeps near each other stop and show speech bubbles (a "conversation")
- Human + assistant peep pairs interact more frequently
- Idle peeps sit on benches or lean against buildings

### Vehicles
- Small pixel cars/bikes moving along roads
- Frequency scales with town size
- Stop at intersections, park near buildings

### Pets & Animals
- Birds perched on rooftops, occasionally fly between buildings
- Cats wandering independently
- Dogs following peeps

### Building Interiors
- Click a building → zoom into a simple interior view
- Shows conversation summary, word cloud, or message timeline
- Smooth zoom-in/zoom-out transition

---

## Phase 3: Town Structure & Meaning

### Districts & Neighborhoods
- Group buildings by topic using conversation title clustering (coding, writing, research, etc.)
- Different ground textures or color tints per district
- District name labels on the map

### Parks & Green Spaces
- Long idle conversations become parks/gardens instead of buildings
- Adds visual variety beyond just buildings
- Benches, fountains, flower beds

### Landmarks
- Longest conversation → special landmark (castle, lighthouse, monument)
- First conversation → town hall at the center
- Most active month → a plaza or market square

### Connected Roads
- Buildings with related topics linked by highlighted paths
- Shows how your thinking connects across conversations
- Subtle animated glow on connected paths

### Seasonal Themes
- Trees change with seasons (spring blossoms, summer green, autumn leaves, winter bare)
- Could tie to conversation dates (buildings from winter have snowy roofs)
- Seasonal decorations (holiday lights, falling leaves)

---

## Phase 4: Social & Sharing

### Visitor Peeps
- When someone visits your town URL, a unique visitor peep appears walking around
- Visitor peep has a distinct color/hat
- Ephemeral — disappears when they leave

### Screenshot / Poster Mode
- One-click export of your town as a high-res PNG
- Shareable card with stats overlay (conversation count, message count, date range)
- Optional: poster layout with town + stats for printing

### Download as GIF
- Export a short animated loop of your town (peeps walking, windows flickering, day/night)
- Configurable duration and zoom level
- Perfect for sharing on social media / Discord

### Download as Wallpaper (?)
- Export your town as a desktop/mobile wallpaper
- Multiple resolution presets (1080p, 1440p, 4K, phone)
- Might not implement — depends on demand

### Town Comparisons
- Side-by-side view of two users' towns
- Compare: size, activity level, building types, total messages
- Fun visual diff

### Guestbook
- Visitors can leave a pixel sticky note on a bulletin board in the town
- Bulletin board structure placed near the town center
- Notes visible to the town owner

---

## Phase 5: Gamification & Progression

### Town Level & Badges
- Milestones displayed as banners or statues in the town:
  - "100 Conversations" — bronze statue
  - "Night Owl" — lots of late-night chats → owl perched on a building
  - "Prolific" — 10k+ messages → golden mailbox
  - "Veteran" — 1+ year of conversations → clock tower

### Building Upgrades
- Revisiting a conversation (more messages over time) visually upgrades the building
- small house → cottage → mansion → tower
- Re-upload detects growth and shows upgrade animations

### Growth Over Time
- Re-upload shows your town expanding with new buildings
- New buildings get a "new!" sparkle animation
- Timeline slider to see your town at different points in time

### Easter Eggs
- Hidden pixel art triggered by conversation patterns:
  - Conversation about cats → tiny cat on that building's roof
  - Conversation about music → musical notes floating out
  - Conversation about food → smoke from a chimney shaped like a fork
  - Very long conversation → a flag on the rooftop
