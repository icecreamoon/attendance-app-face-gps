import { useState, useEffect } from 'react';
import PunchButton from './components/PunchButton';
import PunchLogList from './components/PunchLogList';
import './index.css';
import { listPunchLogs } from './graphql/queries';
import { generateClient } from 'aws-amplify/api';
import FaceVerify from './components/FaceVerify';
import { createPunchLog } from './graphql/mutations';

const client = generateClient();

function App() {
  const [timestamp, setTimestamp] = useState(null);
  const [logs, setLogs] = useState([]);

    // 履歴取得関数を外に定義
  const fetchLogs = async () => {
    try {
      const result = await client.graphql({
        query: listPunchLogs,
        variables: {
          filter: { userId: { eq: 'sachiyo001' } },
          limit: 50
        }
      });
      const items = result.data?.listPunchLogs?.items || [];

      // 🔽 新しい順に並び替え
      const sortedItems = items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      setLogs(sortedItems);
      console.log('打刻履歴取得（並び替え済）:', sortedItems);
    } catch (error) {
      console.error('履歴取得失敗:', error);
    }
  };

  const punch = async () => {
  try {
    const now = new Date().toISOString();
    const result = await client.graphql({
      query: createPunchLog,
      variables: {
        input: {
          userId: 'sachiyo001',
          timestamp: now,
          method: 'face',
        }
      }
    });

    console.log('GraphQLレスポンス:', result); // ✅ ここで構造確認！

    const ts =
      result?.data?.createPunchLog?.timestamp ||
      result?.createPunchLog?.timestamp ||
      now;

    if (!ts) {
      throw new Error('timestampが取得できませんでした');
    }

    setTimestamp(ts);
    fetchLogs();
    console.log('打刻成功:', ts);
  } catch (error) {
    console.error('打刻に失敗しました:', error);
    alert(`打刻に失敗しました: ${error.message || '詳細不明'}`);
  }
};

  // 初回のみ履歴取得
  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="w-screen min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4 text-blue-600">勤怠管理アプリ</h1>
        <p className="text-gray-600 mb-6">顔認証とGPSで打刻できます</p>
        {/* 🔽 顔認証セクションをここに追加 */}
        <FaceVerify
          onVerified={(result) => {
            if (result.match && result.confidence >= 0.7) {
              console.log('顔認証成功:', result);
              punch(); // ✅ ここで打刻処理を呼び出す！
            } else {
              alert('顔認証に失敗しました');
            }
          }}
        />

        {/* 打刻ボタン */}
        
        <PunchButton
          onPunched={(ts) => {
           setTimestamp(ts);
           fetchLogs();
          }}
        />
        {timestamp && (
          <p className="text-green-600 font-medium">
            打刻日時：{timestamp}
          </p>
        )}
      </div>

      {/* 履歴表示セクション */}
      <div className="w-full max-w-md mt-8 text-center">
        <h2 className="text-xl font-bold mb-4 text-gray-700">打刻履歴</h2>
        <PunchLogList logs={logs} />
      </div>
    </div>
  );
}

export default App;