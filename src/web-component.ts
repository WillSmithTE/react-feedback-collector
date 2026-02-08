import React from "react";
import ReactDOM from "react-dom/client";
import { FeedbackWidget } from "./components/FeedbackWidget";
import { FEEDBACK_CSS } from "./utils/styles";
import type { FeedbackData, FeedbackWidgetProps, WidgetTheme } from "./types";

// Attributes that map directly to string props
const STRING_ATTRS = [
  "client-id",
  "position",
  "title",
  "placeholder",
  "environment",
  "base-url",
] as const;

// Boolean attributes
const BOOLEAN_ATTRS = ["show-email-option", "show-screenshot-option"] as const;

// All observed attributes
const OBSERVED_ATTRIBUTES = [...STRING_ATTRS, ...BOOLEAN_ATTRS, "theme"];

/**
 * Convert kebab-case attribute names to camelCase prop names.
 */
function attrToProp(attr: string): string {
  return attr.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

/**
 * <feedback-collector> Web Component.
 *
 * Wraps the React FeedbackWidget in a custom element with Shadow DOM
 * for style isolation — ideal for Chrome extensions and non-React pages.
 *
 * @example
 * <feedback-collector
 *   client-id="your-id"
 *   position="right"
 *   show-email-option
 *   show-screenshot-option
 *   theme='{"primary":"#e11d48"}'
 * ></feedback-collector>
 *
 * @example
 * // Programmatic usage
 * const el = document.createElement('feedback-collector');
 * el.setAttribute('client-id', 'your-id');
 * document.body.appendChild(el);
 *
 * // Listen for events
 * el.addEventListener('feedback-submit', (e) => {
 *   console.log('Feedback:', e.detail);
 * });
 */
export class FeedbackCollectorElement extends HTMLElement {
  private root: ReactDOM.Root | null = null;
  private mountPoint: HTMLDivElement | null = null;

  static get observedAttributes(): string[] {
    return [...OBSERVED_ATTRIBUTES];
  }

  connectedCallback(): void {
    const shadow = this.attachShadow({ mode: "open" });

    // Inject styles into shadow DOM
    const style = document.createElement("style");
    style.textContent = FEEDBACK_CSS;
    shadow.appendChild(style);

    // Create mount point for React
    this.mountPoint = document.createElement("div");
    shadow.appendChild(this.mountPoint);

    this.root = ReactDOM.createRoot(this.mountPoint);
    this.renderWidget();
  }

  disconnectedCallback(): void {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
  }

  attributeChangedCallback(): void {
    this.renderWidget();
  }

  private buildProps(): FeedbackWidgetProps {
    const props: Record<string, unknown> = {};

    // Map string attributes
    for (const attr of STRING_ATTRS) {
      const value = this.getAttribute(attr);
      if (value !== null) {
        props[attrToProp(attr)] = value;
      }
    }

    // Map boolean attributes (presence = true)
    for (const attr of BOOLEAN_ATTRS) {
      props[attrToProp(attr)] = this.hasAttribute(attr);
    }

    // Parse theme JSON
    const themeAttr = this.getAttribute("theme");
    if (themeAttr) {
      try {
        props.theme = JSON.parse(themeAttr) as Partial<WidgetTheme>;
      } catch {
        // Ignore invalid JSON
      }
    }

    // Wire up event dispatching for callbacks
    props.onSubmit = (data: FeedbackData) => {
      this.dispatchEvent(
        new CustomEvent("feedback-submit", { detail: data, bubbles: true })
      );
    };
    props.onError = (error: Error) => {
      this.dispatchEvent(
        new CustomEvent("feedback-error", {
          detail: { message: error.message },
          bubbles: true,
        })
      );
    };
    props.onOpen = () => {
      this.dispatchEvent(new CustomEvent("feedback-open", { bubbles: true }));
    };
    props.onClose = () => {
      this.dispatchEvent(new CustomEvent("feedback-close", { bubbles: true }));
    };

    return props as unknown as FeedbackWidgetProps;
  }

  private renderWidget(): void {
    if (!this.root) return;
    const props = this.buildProps();
    this.root.render(React.createElement(FeedbackWidget, props));
  }
}

/**
 * Register the <feedback-collector> custom element.
 * Safe to call multiple times — will only register once.
 */
export function registerFeedbackCollector(
  tagName = "feedback-collector"
): void {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, FeedbackCollectorElement);
  }
}
