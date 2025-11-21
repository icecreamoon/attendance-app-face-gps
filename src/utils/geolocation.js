// src/utils/geolocation.js
export const getAddressFromCoords = async (lat, lon) => {
  try {
    const res = await fetch(`https://mreversegeocoder.gsi.go.jp/reverse-geocoder/LonLatToAddress?lat=${lat}&lon=${lon}`);
    const data = await res.json();
    console.log('住所取得結果:', data); // ✅ ここで確認
    return data.results.lv01Nm || '住所取得失敗';
  } catch (err) {
    console.error('住所取得エラー:', err);
    return '住所取得失敗';
  }
};