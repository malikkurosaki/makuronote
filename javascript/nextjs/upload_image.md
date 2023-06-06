# Upload image

## Use Multer and Fetch

### server

```js
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'your-directory-path');
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default upload.single('image');
```

### client

```jsx
import { useState } from 'react';

function ImageUploadForm() {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedImage) {
      const formData = new FormData();
      formData.append('image', selectedImage);

      try {
        await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        // Image uploaded successfully
      } catch (error) {
        // Handle any errors that occurred during the upload
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button type="submit">Upload Image</button>
    </form>
  );
}

export default ImageUploadForm;
```
