import { appendText } from './ChaonimaBody.signal';
import { fetchTextStream } from './utils/fetch.utils';

export async function getChaonima(text: string) {
  const sp = new URLSearchParams({ text });
  const url = `${import.meta.env.VITE_API_BASE_URL}/api/v2ex/streamGenerateContent?${sp}`;
  fetchTextStream(url, {
    method: 'GET',
    onmessage: (t) => {
      appendText(t);
    },
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_API_JWT}`,
    },
  });
}
