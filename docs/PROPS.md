# FeedbackWidget Props

| Prop                   | Type                               | Default                       | Description                                                                          |
| ---------------------- | ---------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------ |
| `clientId`             | `string`                           | **Required**                  | Your unique client identifier.                                                       |
| `position`             | `'right'` \| `'left'`              | `'right'`                     | Position of the feedback button.                                                     |
| `button`               | `'semiCircle'`                     | `'semiCircle'`                | Style of the trigger button.                                                         |
| `theme`                | `WidgetTheme`                      | `{}`                          | Custom theme object to override default styles. See [Theming](#theming) for details. |
| `title`                | `string`                           | `'Share Your Feedback'`       | Header title for the feedback form.                                                  |
| `placeholder`          | `string`                           | `'Tell us what you think...'` | Placeholder text for the comment textarea.                                           |
| `showEmailOption`      | `boolean`                          | `true`                        | Whether to show the "Share your email" checkbox.                                     |
| `showScreenshotOption` | `boolean`                          | `true`                        | Whether to show the screenshot upload option.                                        |
| `autoClose`            | `boolean`                          | `true`                        | Whether to automatically close the widget after successful submission.               |
| `debug`                | `boolean`                          | `false`                       | Enable debug logging to the console.                                                 |
| `environment`          | `string`                           | `undefined`                   | Custom environment tag for your feedback (e.g., 'development', 'staging').           |
| `baseUrl`              | `string`                           | `https://usero.io`            | The base URL for the feedback API.                                                   |
| `metadata`             | `Record<string, unknown>`          | `undefined`                   | Arbitrary key-value data attached to each feedback submission (e.g., user ID, plan, session). |
| `onSubmit`             | `(feedback: FeedbackData) => void` | `undefined`                   | Callback function triggered on successful submission.                                |
| `onError`              | `(error: Error) => void`           | `undefined`                   | Callback function triggered on any error.                                            |
| `onOpen`               | `() => void`                       | `undefined`                   | Callback function triggered when the widget opens.                                   |
| `onClose`              | `() => void`                       | `undefined`                   | Callback function triggered when the widget closes.                                  |

## Using Your Own Backend

You can use this component with your own backend by providing the `baseUrl` prop. The widget will send a `POST` request to `{baseUrl}/api/feedback` with the feedback data.

### API Contract

Your backend must expose two endpoints: one for feedback submission and one for screenshot uploads.

#### 1. Feedback Submission

Your backend must accept a `POST` request at `{baseUrl}/api/feedback` with a JSON body conforming to the `FeedbackSubmission` type.

##### `FeedbackSubmission` Type

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
  screenshots?: ScreenshotData[]; // Included if screenshots are uploaded
  metadata?: Record<string, unknown>; // Arbitrary key-value data from the metadata prop
}

interface ScreenshotData {
  fileName: string;
  url: string; // URL of the pre-uploaded screenshot
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

#### 2. Screenshot Uploads

If `showScreenshotOption` is true, you must also implement an endpoint to handle image uploads. The widget uploads screenshots _before_ the user submits the main feedback form.

When a user selects an image, the widget sends a `POST` request with `multipart/form-data` to `{baseUrl}/api/screenshots`.

Your endpoint must:

1.  Accept a `POST` request with `multipart/form-data`.
2.  The form data will contain two fields:
    - `screenshot`: The image file.
    - `clientId`: Your client ID.
3.  Process and store the image (e.g., save it to a cloud storage bucket).
4.  Return a JSON response containing the details of the uploaded file. This data will be included in the final feedback submission.

**On success:**

```json
{
  "success": true,
  "screenshot": {
    "fileName": "user-screenshot.png",
    "url": "https://your-cdn.com/path/to/image.png",
    "fileSize": 123456,
    "mimeType": "image/png"
  }
}
```

**On failure:**

```json
{
  "success": false,
  "error": "Invalid file type"
}
```

### A Note on CORS

Your backend will need to be configured to handle Cross-Origin Resource Sharing (CORS) to accept requests from the feedback widget, just like any other public-facing API.

---

Seed: 82
