# FeedbackWidget Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `clientId` | `string` | **Required** | Your unique client identifier. |
| `variant` | `'slide'` \| `'popup'` | `'slide'` | Display style of the feedback widget. |
| `position` | `'right'` \| `'left'` | `'right'` | Position of the feedback button. |
| `button` | `'speechBubble'` \| `'semiCircle'` | `'semiCircle'` | Style of the trigger button. |
| `theme` | `WidgetTheme` | `{}` | Custom theme object to override default styles. See [Theming](#theming) for details. |
| `title` | `string` | `'Share Your Feedback'` | Header title for the feedback form. |
| `placeholder` | `string` | `'Tell us what you think...'` | Placeholder text for the comment textarea. |
| `showEmailOption` | `boolean` | `true` | Whether to show the "Share your email" checkbox. |
| `showScreenshotOption` | `boolean` | `true` | Whether to show the screenshot upload option. |
| `autoClose` | `boolean` | `true` | Whether to automatically close the widget after successful submission. |
| `debug` | `boolean` | `false` | Enable debug logging to the console. |
| `environment` | `string` | `undefined` | Custom environment tag for your feedback (e.g., 'development', 'staging'). |
| `baseUrl` | `string` | `https://feedbee.willsmithte.com` | The base URL for the feedback API. |
| `onSubmit` | `(feedback: FeedbackData) => void` | `undefined` | Callback function triggered on successful submission. |
| `onError` | `(error: Error) => void` | `undefined` | Callback function triggered on any error. |
| `onOpen` | `() => void` | `undefined` | Callback function triggered when the widget opens. |
| `onClose` | `() => void` | `undefined` | Callback function triggered when the widget closes. |

## Using Your Own Backend

You can use this component with your own backend by providing the `baseUrl` prop. The widget will send a `POST` request to `{baseUrl}/api/feedback` with the feedback data.

### API Contract

Your backend must expose an endpoint that accepts a `POST` request with a JSON body conforming to the `FeedbackSubmission` type.

#### `FeedbackSubmission` Type

```typescript
interface FeedbackSubmission {
  clientId: string;
  rating: 1 | 2 | 3 | 4;
  comment?: string;
  shareEmail: boolean;
  userEmail?: string;
  pageUrl: string;
  pageTitle: string;
  referrer?: string;
  environment?: string;
  screenshots?: ScreenshotData[];
}

interface ScreenshotData {
  fileName: string;
  url: string;
  fileSize: number;
  width?: number;
  height?: number;
  mimeType: string;
}
```

Your endpoint should return a JSON response with the following structure:

**On success:**

```json
{
  "success": true,
  "data": { ... } // Your data
}
```

**On failure:**

```json
{
  "success": false,
  "error": "Error message"
}
```

### A Note on CORS

Your backend will need to be configured to handle Cross-Origin Resource Sharing (CORS) to accept requests from the feedback widget, just like any other public-facing API.

### Example Backend (Node.js/Express)

Here is a simple example of an Express server that implements the required endpoint:

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/api/feedback', (req, res) => {
  const feedbackData = req.body;

  // Your logic to save the feedback
  console.log('Feedback received:', feedbackData);

  // Send a success response
  res.json({ success: true, data: { id: '123' } });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```
