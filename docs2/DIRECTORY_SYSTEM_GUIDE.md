# JSON-Driven Directory System Guide

## Overview

This system enables you to create unlimited directory pages by providing keyword data in a standardized JSON format. The page automatically populates all sections—definitions, resources, YouTube videos, products, FAQs, and more—from the JSON data.

## How It Works

### 1. **Data Flow**
```
Your Keywords → JSON File → DirectoryPage Component → Rendered Page
```

- You supply keywords and content in a JSON file
- The `DirectoryPage` component reads this JSON
- React renders the page dynamically with all sections populated

### 2. **File Structure**

```
binoid-directory/
├── client/
│   └── src/
│       ├── components/
│       │   └── DirectoryPage.tsx       # Generic page component
│       ├── data/
│       │   └── binoid.json             # Your content data
│       └── pages/
│           └── Home.tsx                # Loads JSON and renders DirectoryPage
```

## JSON Schema Breakdown

### Root Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `metadata` | object | Yes | Page SEO and title info |
| `hero` | object | No | Hero section config |
| `features` | array | No | 3-4 key benefits |
| `main_sections` | array | Yes | Core content sections |
| `resources` | object | No | Videos, products, links |
| `faq` | array | No | Q&A section |
| `cta_section` | object | No | Call-to-action |
| `footer_links` | object | No | Footer navigation |

### Metadata Object

```json
{
  "metadata": {
    "title": "Page H1 heading",
    "slug": "url-friendly-slug",
    "description": "Meta description & hero subtitle",
    "keywords": ["keyword1", "keyword2"],
    "category": "Display name in header",
    "badge": "Hero badge text"
  }
}
```

### Hero Object

```json
{
  "hero": {
    "headline": "Main headline",
    "subheadline": "Supporting text",
    "cta_primary": {
      "text": "Button text",
      "link": "https://example.com",
      "color": "green"
    },
    "cta_secondary": {
      "text": "Secondary button",
      "link": "#section-id"
    }
  }
}
```

### Features Array

```json
{
  "features": [
    {
      "icon": "award",
      "title": "Feature Title",
      "description": "Feature description"
    }
  ]
}
```

**Available icons:** `award`, `zap`, `shopping-cart`, `leaf`, `book`, `video`, `star`, `check`

### Main Sections Array

Sections can be of type: `tabs`, `cards`, `accordion`, `list`, `comparison`

#### Tabs Example (for Cannabinoids)
```json
{
  "main_sections": [
    {
      "id": "cannabinoids",
      "title": "Understanding Cannabinoids",
      "subtitle": "Learn what sets them apart",
      "type": "tabs",
      "content": [
        {
          "id": "delta9",
          "title": "Delta 9 THC",
          "subtitle": "The Primary Psychoactive",
          "description": "Full description...",
          "highlights": ["Product 1", "Product 2"],
          "steps": [
            {
              "number": 1,
              "title": "Step title",
              "description": "Step description"
            }
          ]
        }
      ]
    }
  ]
}
```

#### Cards Example (for Product Types)
```json
{
  "type": "cards",
  "content": [
    {
      "title": "Gummies",
      "subtitle": "Edibles with precise dosing",
      "description": "Description...",
      "highlights": ["Benefit 1", "Benefit 2"]
    }
  ]
}
```

#### Accordion Example (for Guides)
```json
{
  "type": "accordion",
  "content": [
    {
      "title": "Step 1: Identify Your Goal",
      "description": "Full description of this step..."
    }
  ]
}
```

### Resources Object

```json
{
  "resources": {
    "youtube_videos": [
      {
        "title": "Video Title",
        "video_id": "dQw4w9WgXcQ",
        "channel": "Channel Name",
        "duration": "8:42",
        "description": "What the video is about"
      }
    ],
    "related_products": [
      {
        "name": "Product Name",
        "image_url": "https://...",
        "price": "$49.99",
        "link": "https://...",
        "description": "Product description"
      }
    ],
    "external_links": [
      {
        "title": "Link Title",
        "url": "https://...",
        "description": "What this link is about",
        "icon": "globe"
      }
    ]
  }
}
```

### FAQ Array

```json
{
  "faq": [
    {
      "question": "Is this legal?",
      "answer": "Yes, because..."
    }
  ]
}
```

### CTA Section

```json
{
  "cta_section": {
    "headline": "Ready to get started?",
    "description": "Browse our full collection...",
    "button_text": "Shop Now",
    "button_link": "https://...",
    "background_color": "green"
  }
}
```

### Footer Links

```json
{
  "footer_links": {
    "columns": [
      {
        "title": "Column Title",
        "links": [
          {
            "text": "Link text",
            "url": "https://..."
          }
        ]
      }
    ]
  }
}
```

## Creating a New Directory Page

### Step 1: Create Your JSON File

Create a new file in `client/src/data/your-niche.json`:

```json
{
  "metadata": {
    "title": "Your Niche Directory",
    "slug": "your-niche",
    "description": "Description for your niche",
    "keywords": ["keyword1", "keyword2"],
    "category": "Your Niche",
    "badge": "Your Badge"
  },
  "hero": { ... },
  "features": [ ... ],
  "main_sections": [ ... ],
  "resources": { ... },
  "faq": [ ... ],
  "cta_section": { ... },
  "footer_links": { ... }
}
```

### Step 2: Create a New Route

Edit `client/src/App.tsx` to add a new route:

```tsx
import YourNichePage from "@/pages/YourNiche";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/your-niche"} component={YourNiche} />
      <Route component={NotFound} />
    </Switch>
  );
}
```

### Step 3: Create the Page Component

Create `client/src/pages/YourNiche.tsx`:

```tsx
import { useState, useEffect } from "react";
import DirectoryPage from "@/components/DirectoryPage";
import yourNicheData from "@/data/your-niche.json";

export default function YourNiche() {
  const [data, setData] = useState(yourNicheData);

  useEffect(() => {
    setData(yourNicheData);
  }, []);

  return <DirectoryPage data={data} />;
}
```

### Step 4: Deploy

The page is now live at `/your-niche` with all content automatically populated!

## Best Practices

### 1. **SEO Optimization**
- Include target keywords in `metadata.keywords`
- Use descriptive titles and subtitles
- Add detailed descriptions for each section
- Include long-tail keywords in FAQ questions

### 2. **Content Structure**
- Start with broad definitions (tabs section)
- Move to specific products/types (cards section)
- End with guides and FAQs
- Always include external resources

### 3. **YouTube Videos**
- Find 3-5 relevant videos on the topic
- Extract video IDs from YouTube URLs (e.g., `dQw4w9WgXcQ` from `https://www.youtube.com/watch?v=dQw4w9WgXcQ`)
- Include accurate durations and descriptions

### 4. **Product Links**
- Use affiliate links where applicable
- Include real product images
- Add accurate pricing
- Link to official product pages

### 5. **FAQ Content**
- Answer common user questions
- Include 5-8 FAQs minimum
- Use natural language
- Provide actionable answers

## Workflow for Scaling

### To create 100 directory pages:

1. **Gather Keywords** - Compile lists of 100 keywords across niches
2. **Research Content** - For each keyword, gather:
   - Definitions and explanations
   - Related products/services
   - YouTube video recommendations
   - External resources
   - Common questions
3. **Generate JSON** - Create JSON files for each keyword/niche
4. **Create Routes** - Add routes in App.tsx
5. **Deploy** - All pages go live automatically

### Automation Potential

You can automate this further with a script that:
- Takes a keyword list as input
- Searches for definitions (Wikipedia, industry sites)
- Finds YouTube videos via API
- Searches for related products
- Generates JSON automatically
- Creates routes and components

## Component Features

The `DirectoryPage` component automatically handles:

✓ Responsive design (mobile, tablet, desktop)
✓ Sticky navigation with section links
✓ Tab interfaces for complex topics
✓ Card grids for product types
✓ Accordion for step-by-step guides
✓ YouTube video embeds with thumbnails
✓ Product showcase with links
✓ External resource links
✓ FAQ section
✓ Call-to-action section
✓ Footer with organized links
✓ Smooth scrolling
✓ Hover effects and transitions

## Customization

### Changing Colors

Edit `client/src/index.css` to modify the green color scheme:

```css
:root {
  --primary: oklch(0.577 0.245 27.325); /* Change this */
}
```

### Adding New Icons

Edit the `iconMap` in `DirectoryPage.tsx`:

```tsx
const iconMap: Record<string, React.ReactNode> = {
  award: <Award className="w-8 h-8 text-green-600 mb-2" />,
  // Add more icons here
};
```

### Modifying Layouts

Each section type (`tabs`, `cards`, `accordion`) can be customized in `DirectoryPage.tsx` by editing the corresponding render logic.

## Troubleshooting

### JSON Won't Load
- Ensure the file path is correct: `client/src/data/filename.json`
- Check JSON syntax with a JSON validator
- Restart the dev server: `pnpm dev`

### Styling Issues
- Check that all required fields are present in JSON
- Verify icon names are in the `iconMap`
- Clear browser cache (Ctrl+Shift+Delete)

### Missing YouTube Videos
- Verify video IDs are correct (11 characters)
- Check that videos are public/not age-restricted
- YouTube thumbnail URLs may take time to load

## Next Steps

1. **Create your first niche JSON file** using the schema
2. **Test the page** at `/your-niche`
3. **Iterate and refine** based on user feedback
4. **Scale to 100+ pages** using the workflow above
5. **Automate** with scripts for faster generation

---

**Need Help?** Refer to `binoid_directory_data.json` as a complete working example.
