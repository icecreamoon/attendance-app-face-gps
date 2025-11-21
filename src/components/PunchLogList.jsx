const PunchLogList = ({ logs }) => {
  if (!logs || logs.length === 0) {
    return (
      <div className="text-gray-500 text-center mt-4">
        打刻履歴はまだありません。
      </div>
    );
  }

  return (
    <ul className="space-y-4 mt-4">
      {logs.map((log) => (
        <li key={log.id} className="bg-white p-4 rounded shadow-md border border-gray-200 max-w-sm mx-auto">
          <p className="text-sm text-gray-600">
            <strong>日時:</strong> {new Date(log.timestamp).toLocaleString("ja-JP")}
          </p>
          <p className="text-sm text-gray-600">
            <strong>位置:</strong> {' '}
            {log.address
              ? log.address
              : log.latitude && log.longitude
              ? `${log.latitude}, ${log.longitude}`
              : '位置情報なし'}
          </p>
          {log.photoUrl && (
            <img
              src={log.photoUrl}
              alt="打刻写真"
              className="mt-2 w-full max-w-xs rounded"
            />
          )}
        </li>
      ))}
    </ul>
  );
};

export default PunchLogList;