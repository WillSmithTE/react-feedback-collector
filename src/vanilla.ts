import React from "react";
import ReactDOM from "react-dom/client";
import { FeedbackWidget } from "./components/FeedbackWidget";
import type { FeedbackWidgetProps } from "./types";

/**
 * Options for the vanilla JS FeedbackCollector.
 * Same as FeedbackWidgetProps but without React-specific types in the signature.
 */
export type FeedbackCollectorOptions = FeedbackWidgetProps;

interface MountedInstance {
  root: ReactDOM.Root;
  wrapper: HTMLDivElement;
}

const instances = new Map<Element | string, MountedInstance>();

function resolveContainer(target: string | Element): Element {
  if (typeof target === "string") {
    const el = document.querySelector(target);
    if (!el) {
      throw new Error(
        `FeedbackCollector: No element found for selector "${target}"`
      );
    }
    return el;
  }
  return target;
}

/**
 * Mount the feedback widget into a DOM element.
 *
 * @example
 * // Mount into a specific container
 * FeedbackCollector.init('#feedback-root', { clientId: 'your-id' });
 *
 * // Mount into document.body (appends a container)
 * FeedbackCollector.init(document.body, { clientId: 'your-id' });
 *
 * // With full options
 * FeedbackCollector.init('#app', {
 *   clientId: 'your-id',
 *   position: 'left',
 *   theme: { primary: '#e11d48' },
 *   onSubmit: (data) => console.log('Feedback:', data),
 * });
 */
function init(
  target: string | Element,
  options: FeedbackCollectorOptions
): void {
  const container = resolveContainer(target);
  const key = typeof target === "string" ? target : container;

  // Destroy existing instance if re-initializing on the same target
  if (instances.has(key)) {
    destroy(target);
  }

  const wrapper = document.createElement("div");
  wrapper.setAttribute("data-feedback-collector", "");
  container.appendChild(wrapper);

  const root = ReactDOM.createRoot(wrapper);
  root.render(React.createElement(FeedbackWidget, options));

  instances.set(key, { root, wrapper });
}

/**
 * Unmount the feedback widget from a DOM element.
 */
function destroy(target: string | Element): void {
  const container = resolveContainer(target);
  const key = typeof target === "string" ? target : container;
  const instance = instances.get(key);

  if (instance) {
    instance.root.unmount();
    instance.wrapper.remove();
    instances.delete(key);
  }
}

/**
 * Unmount all feedback widget instances.
 */
function destroyAll(): void {
  instances.forEach((instance) => {
    instance.root.unmount();
    instance.wrapper.remove();
  });
  instances.clear();
}

export const FeedbackCollector = { init, destroy, destroyAll };
