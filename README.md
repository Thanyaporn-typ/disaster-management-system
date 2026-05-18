# app

## Project setup

```bash
npm install
```

---

## Compiles and hot-reloads for development

```bash
npm run serve
```

---

## Compiles and minifies for production

```bash
npm run build
```

---

## Lints and fixes files

```bash
npm run lint
```

---

## Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/)

---

# Deploy

## 1. Commit code to GitHub

```bash
git add .
git commit -m "edit : checkinTime"
git push
```

---

# Deploy to GitHub Pages

ใช้สำหรับ URL:

```text
https://thanyaporn-typ.github.io/disaster-management-system/
```

## 1. Update `vue.config.js`

```js
publicPath: '/disaster-management-system/'
```

## 2. Build and Deploy

```bash
npm run build
npm run deploy
```

---

# Deploy to Firebase Hosting

ใช้สำหรับ URL:

```text
https://your-project.web.app/
```

## 1. Update `vue.config.js`

```js
publicPath: '/'
```

## 2. Build and Deploy

```bash
npm run build
firebase deploy
```

---

# Notes

หากเจอ error:

```text
Uncaught SyntaxError: Unexpected token '<'
```

แปลว่า `publicPath` ไม่ตรงกับ hosting ที่ deploy

- GitHub Pages ใช้:

```js
publicPath: '/disaster-management-system/'
```

- Firebase Hosting ใช้:

```js
publicPath: '/'
```