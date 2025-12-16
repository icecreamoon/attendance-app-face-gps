import React, { useState } from 'react';

// ダミーデータ（後で GraphQL API から取得する想定）
const dummyData = [
  { id: 1, name: '山田太郎', method: 'in', timestamp: '2025-12-01T09:05:00Z', address: '名古屋市', photoUrl: '/images/yamada_in.jpg' },
  { id: 2, name: '山田太郎', method: 'out', timestamp: '2025-12-01T18:10:00Z', address: '名古屋市', photoUrl: '/images/yamada_out.jpg' },
  { id: 3, name: '佐藤花子', method: 'in', timestamp: '2025-12-01T08:55:00Z', address: '東京', photoUrl: '/images/sato_in.jpg' },
  { id: 4, name: '佐藤花子', method: 'out', timestamp: '2025-12-01T17:45:00Z', address: '東京', photoUrl: '/images/sato_out.jpg' },
  { id: 5, name: '鈴木一郎', method: 'in', timestamp: '2025-12-02T09:15:00Z', address: '大阪', photoUrl: '/images/suzuki_in.jpg' },
];

function AttendanceList() {
  const [searchName, setSearchName] = useState('');
  const [searchDate, setSearchDate] = useState('');

  // フィルタ処理
  const filteredData = dummyData.filter((log) => {
    const matchName = searchName ? log.name.includes(searchName) : true;
    const matchDate = searchDate
      ? new Date(log.timestamp).toLocaleDateString('ja-JP') ===
        new Date(searchDate).toLocaleDateString('ja-JP')
      : true;
    return matchName && matchDate;
  });

  return (
    <div style={{ padding: '2rem' }}>
      <h2>勤怠データ一覧</h2>

      {/* 検索フォーム */}
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
        <input
          type="text"
          placeholder="社員名で検索"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
      </div>

      {/* 一覧テーブル */}
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'center',
        }}
      >
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>社員名</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>打刻種別</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>日時</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>場所</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>顔写真</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((log) => (
            <tr key={log.id}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{log.name}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                {log.method === 'in' ? '出勤' : log.method === 'out' ? '退勤' : 'その他'}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                {new Date(log.timestamp).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{log.address}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                {log.photoUrl ? (
                  <img
                    src={log.photoUrl}
                    alt="顔写真"
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                  />
                ) : 'なし'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AttendanceList;

