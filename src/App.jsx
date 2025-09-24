import { useState, useEffect } from 'react';
import PunchButton from './components/PunchButton';
import PunchLogList from './components/PunchLogList';
import './index.css';
import { listPunchLogs } from './graphql/queries';
import { generateClient } from 'aws-amplify/api';

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

  // 初回のみ履歴取得
  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="w-screen min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4 text-blue-600">勤怠管理アプリ</h1>
        <p className="text-gray-600 mb-6">顔認証とGPSで打刻できます</p>
        {/* 打刻後に履歴も再取得 */}
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