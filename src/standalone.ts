/**
 * Standalone entry point for non-React environments.
 *
 * This build bundles Preact internally (via preact/compat) so consumers
 * get a single file with zero external dependencies.
 *
 * Usage (script tag):
 *   <script src="feedback-collector.standalone.js"></script>
 *   <script>
 *     FeedbackCollector.init(document.body, { clientId: 'your-id' });
 *     // or register the web component:
 *     FeedbackCollector.registerFeedbackCollector();
 *   </script>
 *   <feedback-collector client-id="your-id"></feedback-collector>
 *
 * Usage (ES module):
 *   import { FeedbackCollector, registerFeedbackCollector } from 'react-feedback-collector/standalone';
 *   FeedbackCollector.init('#app', { clientId: 'your-id' });
 */

export { FeedbackCollector } from "./vanilla";
export type { FeedbackCollectorOptions } from "./vanilla";
export {
  FeedbackCollectorElement,
  registerFeedbackCollector,
} from "./web-component";
export { DARK_THEME, DEFAULT_THEME } from "./styles/themes";
export type {
  FeedbackData,
  FeedbackRating,
  WidgetPosition,
  WidgetTheme,
} from "./types";
