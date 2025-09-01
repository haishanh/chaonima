import { ChaonimaLogo } from 'preview/react';

function App() {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <ChaonimaLogo />
      </div>
      <p>访问 v2ex 话题页</p>
      <p>点击页面的“他们在吵什么”按钮开始</p>
      <footer style={{ textAlign: 'right' }}>
        <a target="_blank" href="https://github.com/haishanh/chaonima">
          码子
        </a>
      </footer>
    </>
  );
}

export default App;
