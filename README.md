# personal-web

# Personal Web - Express.js

Website portfolio pribadi yang dibangun menggunakan **Node.js**, **Express.js**, dan **Handlebars** sebagai template engine. Proyek ini dibuat untuk memenuhi tugas pembuatan website pribadi menggunakan Express.js dengan konsep server-side rendering.

---

## 📌 Fitur

- 🏠 Home Page
- 👤 About Me
- 💼 Experience
- 🛠 Tech Stack
- 📂 My Projects
- 📞 Contact Page
- ♻️ Handlebars Template Engine
- 📁 Static File Serving (CSS, Images, Assets)

---

## 🛠 Tech Stack

- Node.js
- Express.js
- Handlebars (HBS)
- HTML5
- CSS3
- JavaScript

---

## 📂 Struktur Folder

```
personal-web
│
├── node_modules
│
├── public
│   ├── assets
│   ├── css
│   │   └── style.css
│   └── js
│
├── src
│   ├── partials
│   │   ├── footer.hbs
│   │   └── navbar.hbs
│   │
│   ├── views
│   │   ├── home.hbs
│   │   ├── contact.hbs
│   │   ├── my-project.hbs
│   │   └── layouts
│   │       └── main.hbs
│   │
│   └── index.js
│
├── package.json
├── package-lock.json
└── README.md
```

---

## 🚀 Cara Menjalankan Project

### 1. Clone Repository

```bash
git clone https://github.com/username/personal-web.git
```

### 2. Masuk ke Folder Project

```bash
cd personal-web
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Jalankan Server

```bash
node src/index.js
```

atau menggunakan Nodemon

```bash
npm run dev
```

---

## 🌐 Buka di Browser

```
http://localhost:3000
```

---

## 📄 Routes

| Route | Deskripsi |
|--------|-----------|
| `/` | Home Page |
| `/contact` | Contact Page |
| `/my-project` | Daftar Project |

---

## 📁 Static Files

Project menggunakan folder **public** untuk menyimpan seluruh aset statis.

```
public
│
├── css
│   └── style.css
│
├── assets
│
└── js
```

Static files diakses menggunakan Express:

```javascript
app.use(express.static("public"));
```

---

## 📚 Template Engine

Project ini menggunakan **Handlebars (HBS)** sebagai template engine.

Beberapa partial yang digunakan:

- Navbar
- Footer

Rendering halaman dilakukan menggunakan:

```javascript
res.render("home");
```

dan

```javascript
res.render("my-project", {
    projects: myProjects
});
```

---

## 👨‍💻 Author

**Fiastara Seikha Arthanev**

- Information Systems Graduate
- Front-End Developer
- Backend Developer Enthusiast
- Data Analytics Enthusiast

---

## 📜 License

Project ini dibuat untuk keperluan pembelajaran dan tugas Bootcamp DumbWays.
