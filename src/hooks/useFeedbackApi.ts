import { useState, useCallback, useMemo } from 'react';
import { FeedbackSubmission, UseFeedbackApiReturn, SubmissionResponse } from '../types';
import { FeedbackApiClient } from '../utils/api';
import { validateFeedbackSubmission } from '../utils/validation';

export function useFeedbackApi(baseUrl?: string): UseFeedbackApiReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const client = useMemo(() => new FeedbackApiClient(baseUrl), [baseUrl]);

  const submitFeedback = useCallback(async (data: FeedbackSubmission): Promise<SubmissionResponse> => {
    setError(null);
    try {
      const validation = validateFeedbackSubmission(data);
      if (!validation.isValid) {
        const err = new Error(validation.errors.join(', '));
        setError(err);
        return { success: false, error: err.message };
      }
      setIsLoading(true);
      const response = await client.submitFeedback(data);
      if (!response.success) {
        setError(new Error(response.error || "Error occurred. Try again."));
      }
      return response;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error occurred. Try again.";
      setError(new Error(msg));
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  }, [client]);

  return { submitFeedback, isLoading, error };
}

