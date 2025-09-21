# React Feedback Collector

A lightweight React component for collecting user feedback with emoji ratings. Hook up your own backend or use [Feedbee](https://feedbee.willsmithte.com) for tracking and insights out of the box.

![Screenshot](https://raw.githubusercontent.com/willsmithte/react-feedback-collector/main/screenshots/both-devices-without-background.png)

## Features

- 🎭 **3-emoji rating system** (😞 😐 😊) with optional comments
- 🚀 **Zero setup** - no backend required
- 📱 **Mobile responsive** with accessible design

## Getting Started

### 1. Get Your Client Id

Visit **[feedbee.willsmithte.com](https://feedbee.willsmithte.com)** to get your unique `clientId` for **free**

### 2. Install the Package

```bash
npm install react-feedback-collector
```

### 3. Add to Your React App

**Import the component:**

```tsx
import { FeedbackWidget } from "react-feedback-collector";
```

**Add to your app:**

```tsx
<FeedbackWidget clientId="your-client-id-from-dashboard" />
```

### 4. View Your Feedback

All feedback appears instantly in your dashboard at **[feedbee.willsmithte.com](https://feedbee.willsmithte.com)**

## Usage

### Basic Configuration

```tsx
<FeedbackWidget clientId="your-client-id" />
```

### With Options

```tsx
<FeedbackWidget
  clientId="your-client-id"
  position="right" // "right" | "left" (default: "right")
  title="Share Your Feedback"
  placeholder="Tell us what you think..."
  environment="prod"
/>
```

## Props

| Prop       | Type                  | Default                 | Description                         |
| ---------- | --------------------- | ----------------------- | ----------------------------------- |
| `clientId` | `string`              | **Required**            | Your unique client identifier.      |
| `position` | `'right'` \| `'left'` | `'right'`               | Position of the feedback button.    |
| `title`    | `string`              | `'Share Your Feedback'` | Header title for the feedback form. |

For a full list of available props, see the [Props documentation](https://github.com/willsmithte/react-feedback-collector/blob/main/docs/PROPS.md).
