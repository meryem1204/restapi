# RESTful API - Ürün ve Sipariş Yönetimi

Bu proje, Node.js (Express), MongoDB ve Mongoose kullanılarak geliştirilmiş bir RESTful API'dir. Sistemde kullanıcılar kayıt olabilir, giriş yapabilir, ürün ekleyebilir ve sadece kendilerine ait siparişleri oluşturup görebilir, güncelleyebilir ve silebilir.

## 🚀 Özellikler

* ✅ Kullanıcı kayıt ve giriş (JWT token ile doğrulama)
* ✅ Ürün oluşturma, listeleme, görüntüleme, güncelleme, silme
* ✅ Ürünlere görsel (resim) yükleyebilme
* ✅ Sipariş oluşturma, listeleme, güncelleme, silme (kullanıcıya özel)
* ✅ Sadece giriş yapan kullanıcı kendi siparişlerine erişebilir
* ✅ MongoDB ile veri saklama

## 📁 Proje Yapısı

```
restapi/
│
├── api/
│   ├── controllers/        # İş mantığı burada (products, orders, user)
│   ├── middleware/         # Doğrulama ve dosya yükleme
│   ├── models/             # Mongoose veri şemaları
│   └── routes/             # Tüm endpoint tanımları
│
├── uploads/                # Yüklenen resimler
├── app.js                  # Express app ayarları
└── server.js               # Uygulama başlangıç noktası
```

## 🧪 Kurulum

### Gereklilikler

* Node.js (v18+)
* MongoDB (lokal veya uzak)
* Postman (istekleri test etmek için)

### 1. Bağımlılıkları yükle

```bash
npm install
```

### 2. MongoDB bağlantısını ayarla

Lokal MongoDB kullanıyorsan varsayılan olarak `mongodb://localhost:27017/restapi` bağlantısı çalışır.

### 3. Sunucuyu başlat

```bash
npm start
```

veya geliştirme modunda:

```bash
npm run dev
```

## 🔐 Authentication (JWT)

Kayıt veya giriş yapan kullanıcıya bir `JWT token` verilir. Tüm yetkili işlemler (örneğin sipariş oluşturma) bu token ile yapılır.

**Token'ı aşağıdaki gibi header'a eklemelisin:**

```
Authorization: Bearer <token>
```

## 💠 API Endpointleri

### 👤 Kullanıcı

* `POST /user/signup` → Kayıt
* `POST /user/login` → Giriş (JWT döner)
* `GET /user/all` → Tüm kullanıcılar (kayıt/giriş gerektirmez)

### 📦 Ürünler

* `GET /products` → Tüm ürünleri getir
* `GET /products/:productId` → Belirli ürün
* `POST /products` → Ürün oluştur (resim ile)
* `PATCH /products/:productId` → Ürün güncelle
* `DELETE /products/:productId` → Ürün sil

**Ürün oluşturma örnek form-data:**

```
name: Kalem
price: 10
productImage: (resim dosyası)
```

### 🧳 Siparişler

* `GET /orders` → Sadece kendi siparişlerin
* `GET /orders/:orderId` → Kendi sipariş detayın
* `POST /orders` → Sipariş oluştur (productId ve quantity gönderilmeli)
* `PATCH /orders/:orderId` → Siparişi güncelle
* `DELETE /orders/:orderId` → Siparişi sil

## 📸 Resim Görüntüleme

Yüklenen görseller `uploads/` klasöründe saklanır. Örneğin:

```
GET http://localhost:3000/uploads/2025-07-27T12:34:56.789Zkalem.jpg
```

## 🛡️ Middleware

* `check-auth.js` → JWT doğrulaması
* `upload.js` → `multer` ile görsel yükleme desteği

## 🪩 Hata Yönetimi

Tüm geçersiz isteklerde `404 Not Found`, sunucu hatalarında `500 Internal Server Error` mesajı döner.

---

## 📞 İletişim

Herhangi bir katkı, hata bildirimi ya da sorunuz olursa çekinmeden iletebilirsiniz.
