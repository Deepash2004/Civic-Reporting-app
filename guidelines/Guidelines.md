# CitySaathi Design System Guidelines

## Typography
- **Font Family**: Poppins (modern, geometric, and highly readable across devices)
- **Weights Used**: Regular (400), Medium (500), Semi-bold (600), Bold (700)
- **Usage**:
  - Headings → Bold (700), all caps optional
  - Body → Regular (400) / Medium (500), easy line spacing
  - Labels & Buttons → Semi-bold (600), small caps optional

## Core Colors
- **Primary Background**: Alice Blue → #EBF4FF
- **White**: #FBFEFF  
- **Primary Accent**: Crayola Blue → #1B7AFF

## Text Colors
- **Navy** → #0D1B52 (primary headings, high contrast)
- **Blue** → #1B7AFF (links, highlights) 
- **Gray** → #848DA8 (secondary, descriptions)

## Semantic Colors (Status / Alerts)
- **Error/Danger**: Red → #EF4444
- **Warning**: Yellow → #EDD81E
- **Success**: Green → #3EB751
- **Success Background**: Light Green → #C5FFD7
- **Info Background**: Sky Blue → #D6E8FF

## UI Guidance
- **Buttons**: Rounded corners (12–16px radius), Crayola Blue background, white text
- **Cards**: White or Alice Blue background, light shadow, rounded corners
- **Alerts/Notifications**: Use semantic backgrounds (e.g., Light Green card with Green icon for success)
- **Icons**: Consistent line icons (Lucide or Material)
- **Accessibility**: Ensure minimum color contrast ratio (WCAG 2.1 AA) — Navy on Alice Blue/White

## Implementation Rules
- Use Tailwind classes: `bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`
- For buttons: `bg-primary`, `text-primary-foreground`, `rounded-2xl`
- For semantic states: `bg-success`, `text-success-foreground`, `bg-success-background`
- Use `font-bold` for headings, `font-semibold` for buttons/labels, `font-medium` for body text
- Cards should use `bg-card`, `border-border`, `shadow-md`, `rounded-xl`
- Ensure proper spacing with `space-y-4`, `space-x-3`, `p-6`, `px-4 py-4`