# NEXUS Portfolio Template

A premium, enterprise-grade personal portfolio website template with a professional corporate look, smooth animations, and modern UI/UX. Built for software engineers, developers, architects, and IT professionals.

## Features

- **Modern Design** — Glassmorphism, subtle neumorphism, gradient accents, premium typography
- **Responsive** — Optimized for mobile, tablet, and desktop
- **Dark / Light Mode** — System preference detection with manual toggle
- **12 Complete Sections** — Hero, About, Skills, Experience, Projects, Certifications, Services, Testimonials, Blog, Contact, Analytics Dashboard
- **Dynamic CMS** — All content managed via `src/data.ts` (single source of truth)
- **Interactive** — Project/blog filtering & search, testimonial slider, project detail modal
- **Analytics Dashboard** — Chart.js visualizations for portfolio metrics
- **SEO Optimized** — Meta tags, Open Graph, Twitter Cards, JSON-LD structured data
- **Accessible** — ARIA labels, keyboard navigation, reduced motion support
- **Performance** — Lazy-loaded images, minimal dependencies, optimized animations

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 |
| Styling | CSS3, Bootstrap 5, Custom Design System |
| Scripting | TypeScript (compiled to ES2020 modules) |
| Charts | Chart.js 4 |
| Icons | Bootstrap Icons |
| Fonts | Inter, Plus Jakarta Sans |

## Quick Start

### Option 1: Open directly

Open `index.html` in a browser. For full module support, use a local server (Option 2).

### Option 2: Local development server

```bash
npm install
npm run build    # Compile TypeScript
npm run serve    # Start local server at http://localhost:3000
```

### Option 3: Watch mode

```bash
npm install
npm run watch    # Auto-compile TypeScript on changes
```

## Customization

### 1. Update your content

Edit `src/data.ts` — this file contains all portfolio content:

- Profile information and social links
- Statistics, about section, skills
- Experience, projects, certifications
- Services, pricing, testimonials, blog posts
- Analytics dashboard data

After editing, run `npm run build` to recompile.

### 2. Replace images

Update image URLs in `src/data.ts` or add files to `assets/img/`.

### 3. Add your resume

Place your resume PDF at `assets/resume/resume.pdf`.

### 4. Branding

- Change the logo text "NEXUS" in `index.html`
- Adjust colors in `assets/css/main.css` (`:root` CSS variables)
- Update SEO meta tags in `index.html` `<head>`

### 5. Contact form

The contact form currently shows a success toast on valid submission. Connect it to your backend by updating the form handler in `src/main.ts` (`initContactForm`).

### 6. Google Maps

Update the `mapEmbed` URL in `src/data.ts` → `contact.mapEmbed`.

## Project Structure

```
portfolio-master/
├── index.html              # Main HTML (all sections)
├── package.json            # Build scripts
├── tsconfig.json           # TypeScript config
├── src/
│   ├── types.ts            # TypeScript interfaces
│   ├── data.ts             # Portfolio content (CMS)
│   └── main.ts             # Application logic
├── assets/
│   ├── css/
│   │   └── main.css        # Premium styles + dark mode
│   ├── js/                 # Compiled TypeScript output
│   ├── img/
│   │   └── favicon.svg
│   └── resume/
│       └── resume.pdf      # Your resume (add this)
└── README.md
```

## Sections Overview

| Section | Features |
|---------|----------|
| **Hero** | Profile image, typed designation, CTA buttons, social links, resume download |
| **Stats** | Animated counter cards (experience, projects, clients, certs) |
| **About** | Summary, personal info cards, achievements, career & education timelines |
| **Skills** | Categorized tabs, animated progress bars, interactive skill cards |
| **Experience** | Detailed cards with responsibilities, achievements, project tags |
| **Projects** | Grid layout, category filters, search, detail modal with demo/source links |
| **Certifications** | Gallery with view/download actions |
| **Services** | Service cards + pricing packages with feature comparison |
| **Testimonials** | Auto-scrolling slider with star ratings |
| **Blog** | Featured articles, category filters, search |
| **Contact** | Validated form, Google Maps, contact info cards |
| **Analytics** | Dashboard with line, doughnut, and bar charts |

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

Free to use for personal and commercial projects. Attribution appreciated but not required.
