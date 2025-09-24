import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import awsExports from '../aws-exports';
import { createPunchLog } from '../graphql/mutations';

Amplify.configure(awsExports);
const client = generateClient();

const PunchButton = ({ onPunched }) => {
  const getLocation = () => {
    return new Promise((resolve, reject) => {
      console.log('位置情報取得開始');
  
      if (!navigator.geolocation) {
        console.error('Geolocation APIが利用できません');
        reject(new Error('GPSがサポートされていません'));
      }
  
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('位置情報取得成功:', latitude, longitude);
          resolve(`${latitude},${longitude}`);
        },
        (error) => {
          console.error('位置情報取得失敗:', error);
          reject(new Error(`位置情報の取得に失敗しました: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  };
    
      const handlePunch = async () => {
        try {
          const location = await getLocation(); // GPS取得
          const input = {
            userId: 'sachiyo001',
            timestamp: new Date().toISOString(),
            location,
            photoUrl: 'https://example.com/photo.jpg',
          };
      
          console.log('打刻データ送信:', input);
      
          client.graphql({
            query: createPunchLog,
            variables: { input }
          }).then((response) => {
            console.log('打刻成功:', response.data?.createPunchLog);
            if (onPunched) {
              onPunched(new Date().toLocaleString("ja-JP"));
            }
          }).catch((error) => {
            console.error('GraphQL送信エラー:', error);
            alert(`打刻に失敗しました: ${error.message}`);
          });
      
        } catch (error) {
          console.error('位置情報取得エラー:', error);
          alert(`位置情報の取得に失敗しました: ${error.message}`);
        }
      };

  return (
    <button
      onClick={handlePunch}
      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded w-full mb-4"
    >
      打刻する
    </button>
  );
};

export default PunchButton;