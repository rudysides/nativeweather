import { BASE_URL } from './fetchLocation';

export type FeedbackType = 'bug' | 'feature' | 'message' | 'question';

const FEEDBACK_URL = `${BASE_URL}/feedback`;

/** Resolves to whether the feedback was accepted. */
export const sendFeedback = async (type: FeedbackType, message: string): Promise<boolean> => {
	try {
		const response = await fetch(FEEDBACK_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ type, message }),
		});

		return response.ok;
	} catch (error) {
		console.error('Failed to send feedback:', error);
		return false;
	}
};
