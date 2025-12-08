import { useState } from 'react';
import FaceVerify from './components/FaceVerify';

function AppContent() {
  const [displayName] = useState('ゲスト'); // 認証なしなので固定表示
  const [cameraReady, setCameraReady] = useState(false);
  const [timestamp, setTimestamp] = useState(null);
  const [punchLogs, setPunchLogs] = useState([]);

  const punch = (type) => {
    const now = new Date().toISOString();
    // ダミーデータを追加（API呼び出しは削除）
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
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#fff',
        minHeight: '100vh',
        width: '100vw',
        margin: 0,
        overflowY: 'auto'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '2rem',
          width: '100%',
          maxWidth: '1000px'
        }}
      >
        <h1>勤怠管理アプリ（ポートフォリオ用）</h1>
        <p
          style={{
            fontFamily: '"M PLUS Rounded 1c", "Noto Sans JP", sans-serif',
            fontSize: '1.5rem',
            color: '#777'
          }}
        >
          お疲れ様です、{displayName} さん
        </p>

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

        {/* 出勤・退勤ボタン */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', width: '100%', maxWidth: '500px' }}>
          <button
            onClick={() => punch('in')}
            style={{
              flex: 1,
              backgroundColor: '#2196F3',
              color: 'white',
              padding: '1rem',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            出勤打刻
          </button>
          <button
            onClick={() => punch('out')}
            style={{
              flex: 1,
              backgroundColor: '#f44336',
              color: 'white',
              padding: '1rem',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem'
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
        <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', width: '100%' }}>
          <div style={{ flex: 1, backgroundColor: '#fafafa', padding: '1rem', borderRadius: '8px' }}>
            <h3 style={{ textAlign: 'center' }}>出勤履歴</h3>
            <ul style={{ listStyle: 'none', padding: 0, textAlign: 'center' }}>
              {punchLogs
                .filter(log => log.method === 'in')
                .map(log => (
                  <li key={log.id}>
                    {new Date(log.timestamp).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}
                    <br />
                    📍 {log.address}
                  </li>
                ))}
            </ul>
          </div>
          <div style={{ flex: 1, backgroundColor: '#fafafa', padding: '1rem', borderRadius: '8px' }}>
            <h3 style={{ textAlign: 'center' }}>退勤履歴</h3>
            <ul style={{ listStyle: 'none', padding: 0, textAlign: 'center' }}>
              {punchLogs
                .filter(log => log.method === 'out')
                .map(log => (
                  <li key={log.id}>
                    {new Date(log.timestamp).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}
                    <br />
                    📍 {log.address}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return <AppContent />;
}


