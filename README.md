# Kevin Lin — Personal Website

A personal portfolio website built with **Next.js 16**, **React 19**, and **Tailwind CSS v4**, managed in an [Nx](https://nx.dev) monorepo.

## ✨ Features

- Seasonal theme switcher (Winter, Spring, Summer, Autumn) with dynamic CSS custom properties and matching favicon
- Animated hero section with season-specific SVG bird animations
- Smooth-scroll single-page navigation with a collapsible drawer menu
- Sections: About, Experience, Projects, Skills, Languages, Education, Contact
- Resume download
- Loading screen with progress indicator

## 🗂️ Project Structure

```
apps/
  my-website/        # Next.js application (main portfolio)
  my-website-e2e/    # Playwright end-to-end tests
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install dependencies

```sh
npm install
```

### Start the development server

```sh
npm run start:my-website
# or
npx nx run my-website:dev -- --port 4200
```

Open [http://localhost:4200](http://localhost:4200) in your browser.

## 🔧 Available Scripts

| Command | Description |
|---|---|
| `npm run start:my-website` | Start dev server on port 4200 |
| `npm run build:my-website` | Production build |
| `npm run test:my-website` | Run unit tests |

Or use Nx directly:

```sh
npx nx run my-website:dev
npx nx run my-website:build
npx nx run my-website:test
npx nx run my-website-e2e:e2e
```

## 🧪 Testing

Unit tests use **Jest** + **React Testing Library**:

```sh
npx nx run my-website:test
```

End-to-end tests use **Playwright**:

```sh
npx nx run my-website-e2e:e2e
```

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16 |
| UI Library | React 19 |
| Styling | Tailwind CSS v4 |
| Language | TypeScript 5.9 |
| Monorepo | Nx 22 |
| Testing | Jest 30, Playwright |
| Linting | ESLint 9, Prettier |

## 📁 Key Source Directories

```
apps/my-website/
  pages/             # Next.js pages (entry point)
  src/
    app/             # Root App component
    display/
      components/    # Reusable UI components (ThemePicture, ScrollNavigation, Content sections…)
      pages/         # Page-level components (MainPage)
    helpers/         # Utility functions
    hooks/           # Custom React hooks
  components/        # Shared base components (Button, Typography, Dialog…)
  public/            # Static assets (SVGs, images, resume PDF)
  styles/            # Global CSS
```
