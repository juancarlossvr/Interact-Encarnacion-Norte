
const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000; 

app.use(cors());

app.use('/img/uploads', express.static(path.join(__dirname, 'img/uploads')));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'img/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('projectImage'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ningún archivo.' });
  }
  
  const fileUrl = `/img/uploads/${req.file.filename}`;
  res.json({ imageUrl: fileUrl });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});