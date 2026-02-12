# React Feedback Collector

[![npm version](https://img.shields.io/npm/v/react-feedback-collector.svg)](https://www.npmjs.com/package/react-feedback-collector)

A lightweight React component for collecting user feedback with emoji ratings. Hook up your own backend or use [Usero](https://usero.io) for tracking and insights out of the box.

![Screenshot](https://raw.githubusercontent.com/willsmithte/react-feedback-collector/main/screenshots/both-devices-without-background.png)

## Features

- 🎭 **4-emoji rating system** (😞 😐 😊 🤩) with optional comments
- 🚀 **Zero setup** - no backend required
- 📱 **Mobile responsive** with accessible design

## Getting Started

### 1. Get Your Client Id

Visit **[usero.io](https://usero.io)** to get your unique `clientId` for **free**

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

All feedback appears instantly in your dashboard at **[usero.io](https://usero.io)**

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

### With Metadata

Attach arbitrary data to each feedback submission, such as user info or session context:

```tsx
<FeedbackWidget
  clientId="your-client-id"
  metadata={{
    userId: user.id,
    plan: "pro",
    sessionId: "abc-123",
  }}
/>
```

## Props

| Prop       | Type                  | Default                 | Description                         |
| ---------- | --------------------- | ----------------------- | ----------------------------------- |
| `clientId` | `string`              | **Required**            | Your unique client identifier.      |
| `position` | `'right'` \| `'left'` | `'right'`               | Position of the feedback button.    |
| `title`    | `string`              | `'Share Your Feedback'` | Header title for the feedback form. |
| `metadata` | `Record<string, unknown>` | `undefined`         | Arbitrary key-value data attached to each feedback submission (e.g., user ID, plan, session). |

For a full list of available props, see the [Props documentation](https://github.com/willsmithte/react-feedback-collector/blob/main/docs/PROPS.md).

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for release notes.
