const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Reactとの連携用にCORSを許可

// Firebase Admin SDK 初期化
const serviceAccount = require('./serviceAccountKey.json'); // 認証鍵ファイルが必要！

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.get('/', (req, res) => {
  res.send('Hello from Render backend!');
});

// 🔽 ここが重要：Reactから呼び出すエンドポイント
app.get('/api/clients', async (req, res) => {
  try {
    const snapshot = await db.collection('client').get();
    const clients = snapshot.docs.map(doc => ({
      id: doc.id,
      顧客コード: doc.data().code,
      氏名: doc.data().name,
      カナ: doc.data().kana,
      電話番号: doc.data().phone,
      住所: doc.data().address
    }));
    res.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'データ取得エラー' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
