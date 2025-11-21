import { useState, useEffect } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import { createPunchLog } from './graphql/mutations';
import { listPunchLogs } from './graphql/queries';
import FaceVerify from './components/FaceVerify';

Amplify.configure(awsExports);
const client = generateClient();

function AppContent({ signOut }) {
  const [displayName, setDisplayName] = useState('');
  const [cameraReady, setCameraReady] = useState(false);
  const [timestamp, setTimestamp] = useState(null);
  const [punchLogs, setPunchLogs] = useState([]);

  useEffect(() => {
    const loadAttributes = async () => {
      try {
        const attributes = await fetchUserAttributes();
        const name =
          attributes.preferred_username ||
          attributes.name ||
          attributes.email ||
          'ユーザー';
        setDisplayName(name);
      } catch (error) {
        console.error('ユーザー属性の取得に失敗しました:', error);
        setDisplayName('ユーザー');
      }
    };
    loadAttributes();
  }, []);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const result = await client.graphql({
          query: listPunchLogs,
          authMode: 'userPool'
        });
        const items = result.data.listPunchLogs.items;
        const sorted = items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setPunchLogs(sorted);
      } catch (error) {
        console.error('打刻履歴の取得に失敗:', error);
      }
    };
    fetchLogs();
  }, [timestamp]);

  const punch = async (type) => {
    try {
      const now = new Date().toISOString();
      await client.graphql({
        query: createPunchLog,
        variables: {
          input: {
            timestamp: now,
            method: type,
            latitude: 35.0,
            longitude: 135.0,
            address: '名古屋市',
          }
        },
        authMode: 'userPool'
      });
      setTimestamp(now);
      alert(`${type === 'in' ? '出勤' : type === 'out' ? '退勤' : '顔認証'} 打刻成功：${now}`);
    } catch (error) {
      console.error(`${type} 打刻失敗:`, JSON.stringify(error, null, 2));
      alert(`${type} 打刻に失敗しました`);
    }
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
        <h1>勤怠管理アプリ</h1>
        <p
          style={{
            fontFamily: '"M PLUS Rounded 1c", "Noto Sans JP", sans-serif',
            fontSize: '1.5rem',
            color: '#777'
          }}
        >
          お疲れ様です、{displayName} さん
        </p>

        {/* サインアウトボタン */}
        <button
          onClick={signOut}
          style={{
            marginTop: '1rem',
            backgroundColor: '#888',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          サインアウト
        </button>

        {/* 顔認証開始ボタン */}
        <button
          onClick={() => setCameraReady(true)}
          style={{
            marginTop: '1rem',
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
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

        {/* 出勤・退勤ボタンを横並び */}
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

        {/* 履歴を左右に分ける */}
        <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', width: '100%' }}>
          <div style={{ flex: 1, backgroundColor: '#fafafa', padding: '1rem', borderRadius: '8px' }}>
            <h3 style={{ textAlign: 'center' }}>出勤履歴</h3>
            <ul style={{ listStyle: 'none', padding: 0, textAlign: 'center' }}>
              {punchLogs
                .filter(log => log.method === 'in')
                .map(log => (
                  <li key={log.id}>
                    {new Date(log.timestamp).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}
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
  return (
    <Authenticator>
      {({ signOut }) => (
        <AppContent signOut={signOut} />
      )}
    </Authenticator>
  );
}

