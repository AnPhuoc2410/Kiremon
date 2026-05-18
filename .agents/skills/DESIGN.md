# Pokemon Detail Page - UI Design & Architecture Document

This document provides a comprehensive technical and visual breakdown of the Pokemon Detail Page to guide an AI agent in generating an exact replica of the UI and interaction flows.

## 1. Overall Structure and Layout

The page (`DetailPokemon`) is structured into three main visual layers:
1. **Modals Layer:** Overlays for the "Catching" process (Throwing, Catch Result, and Nicknaming).
2. **Main Page Content:** The scrolling content area containing the Pokemon's visual data, stats, and tabbed information.
3. **Sticky Bottom Navigation:** A fixed `Navbar` at the bottom of the screen housing the primary call-to-action (CTA) button ("Catch").

The main page (`T.Page`) has a bottom margin dynamically set to the height of the sticky `Navbar` to prevent content from being obscured.

## 2. Main Page Content (`<T.Page>`)

### 2.1 Background
- Contains a large, semi-transparent background image (`/static/pokeball-transparent.png`), positioned absolutely to serve as a watermark behind the content.

### 2.2 Header (`<T.PokeName>`)
- **Background:** Uses a dynamic `linear-gradient` based on the Pokemon's primary type color. It fades from a semi-transparent white at the top to transparent at the bottom, and from the type color (e.g., `#A8A77A` fallback) on the left to transparent on the right.
- **Title (H1):** The localized Pokemon name, displayed with an "outlined" variant of the `<Text>` component and extra-large size (`xl`).
- **Audio Button:** A button (`.cry-btn`) to play the Pokemon's cry. It toggles its SVG icon between an "idle" speaker and an "active/playing" speaker with animated sound waves (`<animate>` tag).
- **Subtitle (H2):** The localized genus/category of the Pokemon, displayed with an "outlined" variant and base size.

### 2.3 Pokemon Showcase (`<T.PokemonContainer>`)
This section is split into two parts: Visuals and Basic Info.

#### Visuals (Left/Top)
- **Classification Badge:** If the Pokemon is Legendary or Mythical, a special badge (`<T.ClassificationText>`) appears above the image.
- **Pokemon Image (`<T.PokemonImageWrapper>`):** Uses a `<LazyLoadImage>` (pixelated rendering via styled component `PokemonAvatar`). Implements a fallback mechanism on error: Default Sprite -> Showdown GIF -> Substitute Doll image. Dimensions are `256x256`.
- **Type Icons:** A flex container displaying the Pokemon's type icons (`<TypeIcon>`) with a gap of `8px` and top margin of `16px`.
- **Flavor Text (`<T.FlavorTextBox>`):** A stylized box displaying the Pokedex entry text.
- **Loading State:** If data is loading, shows a `<Loading>` spinner inside a `<T.ImageLoadingWrapper>`.

#### Basic Info (Right/Bottom)
- **Container (`<T.InfoSection>`):** Displays a grid or list of basic stats.
- **Items:** Height (m), Weight (kg), Base Experience, Capture Rate (with percentage calculation text below it), and Base Happiness.
- Each item (`.info-item`) has a label (`.info-label`) and a value (`.info-value`).

### 2.4 Tabbed Content (`<T.Content>`)
- **Top Margin:** `30px`.
- **Tab Bar (`<T.TabsContainer>`):** A horizontally scrollable list of tabs: About, Stats, Training, Breeding, Evolution, Moves, Sprites, Varieties, and TCG Cards.
- **Active State:** The active tab receives an `.active` class.
- **Tab Content:** Renders specific child components based on the `activeTab` state (e.g., `<AboutTab>`, `<StatsTab>`).

## 3. Sticky Navigation (`<Navbar>`)
- A bottom-fixed navigation bar fading in from the bottom (`fadeHeight={224}`).
- **CTA Button:** A large (`size="xl"`) dark-variant button (`<Button variant="dark">`).
- **Button States:**
  - **Not Authenticated:** "Login to Catch" (links to `/login`).
  - **Pokemon Fled:** "Pokémon Fled" (disabled state).
  - **Already Saved/Caught:** "Find Another" (links to `/pokemons`).
  - **Default Catchable:** "Catch" (triggers `throwPokeball` flow).
  - **Catching in Progress:** "Catching..." (disabled state).
- All buttons feature a Pokeball icon (`icon="/static/pokeball.png"`).

## 4. Modal Interactions (Catching Flow)

The Catching Flow utilizes the `<Modal>` component with various overlays.

### 4.1 Catching Modal (`isCatching = true`)
- **Wrapper:** `<T.CatchingModal>`
- Displays the Pokemon's image (`320x320`).
- Displays a Pokeball image (`128x128`) that applies a `.shaking` CSS class when `shakeCount > 0`.
- **Shake Indicators:** 3 horizontal dots representing the 3 shakes. Color transitions from gray (`#374151`) to green (`#4ade80`) with a green glow box-shadow as the `shakeCount` increases.
- **Text:** "Throwing..." or "Shake X...".

### 4.2 Post-Catch Result Modal (`isEndPhase = true`)
- **Success (`isCaught = true`):**
  - Uses `overlay="light"`.
  - Shows Pokemon image (Shiny sprite if applicable).
  - Text: "✨ Gotcha! [NAME] was caught!"
  - Subtext: Level and Rank display in blue (`#60A5FA`).
- **Failure (`!isCaught`):**
  - Uses `overlay="error"`.
  - Shows Pokemon image.
  - Text: "[NAME] fled!" or "[NAME] broke free!".
  - Subtext: Displays the exact catch rate percentage in gray (`#9CA3AF`).

### 4.3 Nicknaming Modal (`nicknameModal = true`)
- **Wrapper:** `<T.NicknamingModal>`
- Uses `overlay="light"` and `solid`.
- **Layout:** Pokemon image on top (with "✨ SHINY! ✨" text in gold `#FBBF24` if applicable).
- **Form View (`!isSaved`):**
  - `<T.NicknamingForm>`
  - Details Box (`.pxl-border`): Congratulatory text, Level, Rank, Best Stat + IVs (blue `#60A5FA`), and IV Verdict (gray `#9CA3AF`).
  - Input field (`<Input>`) for the nickname.
  - Submit Button: "Save with Nickname", "Keep Original Name", or "Saving...".
- **Success View (`isSaved = true`):**
  - `<T.AnotherWrapper>`
  - Details Box (`.pxl-border`): "Whoosh! [NAME] is now in your Pokémon list!". Shows Rank, IV Total, Trainer XP Gained (green `#34D399`), and New Species indicator (gold `#FBBF24`).
  - Action Buttons: "See My Pokémon" (`variant="light"`, links to `/my-pokemon`) and "Catch Another" (links to `/pokemons`).

## 5. UI Component Library Usage
The AI should utilize the existing design system components imported from `@/components/ui`:
- `<Button>`: Variants include standard, `dark`, `light`. Supports `size`, `icon`, `disabled`.
- `<Input>`: Standard text input.
- `<Loading>`: Spinner or skeleton loader.
- `<Modal>`: Supports `open` boolean, `overlay` ("error", "light"), and `solid` boolean props.
- `<Navbar>`: Fixed bottom bar. Supports `fadeHeight`.
- `<Text>`: Typography component. Supports `as` (html tag), `variant` ("outlined"), `size` ("sm", "base", "xl"), and custom styles.
- `<TypeIcon>`: Renders the visual badge for a Pokemon type.

## 6. Styling approach
- Use `@emotion/styled` to create local styled components (e.g., `T.Page`, `T.PokeName`).
- Rely heavily on the `styled` wrapper around standard HTML elements or external components like `LazyLoadImage`.
- Utilize inline styles only for dynamic values (like the type gradient background or dynamic shake dot colors).
- Rely on defined CSS classes for specific behaviors (`.shaking` animation, `.active` tab state, `.pxl-border` for stylized borders).
- Images should use `image-rendering: pixelated` for that retro game feel, as demonstrated in the `PokemonAvatar` component.
