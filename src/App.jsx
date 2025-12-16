import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import FaceVerify from './components/FaceVerify';
import AttendanceList from './components/AttendanceList';

function AppContent() {
  const [displayName] = useState('ゲスト');
  const [cameraReady, setCameraReady] = useState(false);
  const [timestamp, setTimestamp] = useState(null);
  const [punchLogs, setPunchLogs] = useState([]);

  const punch = (type) => {
    const now = new Date().toISOString();
    const newLog = {
      id: punchLogs.length + 1,
      method: type,
      timestamp: now,
      address: '名古屋市'
    };
    setPunchLogs([newLog, ...punchLogs]);
    setTimestamp(now);
    alert(`${type === 'in' ? '出勤' : type === 'out' ? '退勤' : '顔認証'} 打刻成功：${now}`);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>勤怠管理アプリ（ポートフォリオ用）</h1>
      <p style={{ textAlign: 'center' }}>お疲れ様です、{displayName} さん</p>

      {/* ナビゲーション */}
      <nav style={{ marginBottom: '1rem', textAlign: 'center' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>ホーム</Link>
        <Link to="/admin">管理者ページ</Link>
      </nav>

      <Routes>
        {/* ホーム画面 */}
        <Route
          path="/"
          element={
            <div style={{ textAlign: 'center' }}>
              {/* カメラ起動ボタン */}
              <button
                onClick={() => setCameraReady(true)}
                style={{
                  marginTop: '1rem',
                  backgroundColor: '#9C27B0',
                  color: 'white',
                  padding: '0.7rem 1.2rem',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                顔認証を開始
              </button>

              {cameraReady && (
                <div style={{ marginTop: '2rem', width: '100%' }}>
                  <FaceVerify
                    onVerified={(result) => {
                      if (result.status === 'verified' && result.confidence >= 0.7) {
                        alert('顔認証成功！打刻処理へ進みます');
                        punch('face');
                      } else {
                        alert('顔認証に失敗しました');
                      }
                    }}
                  />
                </div>
              )}

              {/* 出勤・退勤ボタン（中央寄せ） */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
                <button
                  onClick={() => punch('in')}
                  style={{
                    backgroundColor: '#2196F3',
                    color: 'white',
                    padding: '1rem',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    minWidth: '120px'
                  }}
                >
                  出勤打刻
                </button>
                <button
                  onClick={() => punch('out')}
                  style={{
                    backgroundColor: '#f44336',
                    color: 'white',
                    padding: '1rem',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    minWidth: '120px'
                  }}
                >
                  退勤打刻
                </button>
              </div>

              {timestamp && (
                <p style={{ marginTop: '1rem', color: 'green' }}>
                  最終打刻日時（日本時間）：{new Date(timestamp).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}
                </p>
              )}

              {/* 履歴表示 */}
              <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', justifyContent: 'center' }}>
                <div style={{ flex: 1, maxWidth: '400px', backgroundColor: '#fafafa', padding: '1rem', borderRadius: '8px' }}>
                  <h3 style={{ textAlign: 'center' }}>出勤履歴</h3>
                  <ul style={{ listStyle: 'none', padding: 0, textAlign: 'center' }}>
                    {punchLogs.filter(log => log.method === 'in').map(log => (
                      <li key={log.id}>
                        {new Date(log.timestamp).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}
                        <br />📍 {log.address}
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{ flex: 1, maxWidth: '400px', backgroundColor: '#fafafa', padding: '1rem', borderRadius: '8px' }}>
                  <h3 style={{ textAlign: 'center' }}>退勤履歴</h3>
                  <ul style={{ listStyle: 'none', padding: 0, textAlign: 'center' }}>
                    {punchLogs.filter(log => log.method === 'out').map(log => (
                      <li key={log.id}>
                        {new Date(log.timestamp).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}
                        <br />📍 {log.address}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          }
        />

        {/* 管理者ページ */}
        <Route path="/admin" element={<AttendanceList />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}


