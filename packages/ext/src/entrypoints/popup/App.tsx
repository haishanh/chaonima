import { browser } from '#imports';
import { useEffect, useState } from 'react';

function isTopicUrl(url: string | undefined) {
  if (!url) return false;
  return url.startsWith('https://v2ex.com/t/') || url.startsWith('https://www.v2ex.com/t/');
}

function App() {
  const [isTopicPage, setIsTopicPage] = useState(false);
  useEffect(() => {
    (async () => {
      const [tab] = await browser.tabs.query({ active: true, lastFocusedWindow: true });
      setIsTopicPage(isTopicUrl(tab?.url));
    })();
  }, []);

  return (
    <>
      {isTopicPage ? (
        <p>点击页面的“他们在吵什么”按钮开始</p>
      ) : (
        <>
          <h1>🤷‍♀️</h1>
          <p>这个页面看起来不像是 v2ex 的话题页面啊</p>
          <p>我啥也干不了</p>
        </>
      )}
      <footer style={{ textAlign: 'right' }}>
        <a href="https://github.com/haishanh/chaonima">source</a>
      </footer>
    </>
  );
}

export default App;
