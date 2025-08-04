import { useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = ''; // assuming proxy is set in package.json

function App() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ title: '', author: '', genre: '', cover: null });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/books`);
      setBooks(res.data);
    } catch (err) {
      console.error("Error fetching books:", err);
      alert('فشل في جلب الكتب.');
    }
  };

  const addBook = async () => {
    if (!form.title || !form.author || !form.genre || !form.cover) {
      alert('جميع الحقول مطلوبة!');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('author', form.author);
      formData.append('genre', form.genre);
      formData.append('cover', form.cover);

      await axios.post(`${BASE_URL}/books`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setForm({ title: '', author: '', genre: '', cover: null });
      fetchBooks();
    } catch (err) {
      console.error("Error adding book:", err);
      alert('فشل في إضافة الكتاب.');
    }
  };

  const deleteBook = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/books/${id}`);
      fetchBooks();
    } catch (err) {
      console.error("Error deleting book:", err);
      alert('فشل في حذف الكتاب.');
    }
  };

  return (
    <div style={{ padding: 20, direction: 'rtl', fontFamily: "'Cairo', Tahoma, sans-serif" }}>
      <h1 style={{ textAlign: 'center', marginBottom: 20 }}>📚 مكتبة المحمدية</h1>

      {/* Search */}
      <div style={{ textAlign: 'center', marginBottom: 30 }}>
        <input
          type="text"
          placeholder="🔍 ابحث عن كتاب أو مؤلف أو نوع"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            padding: '10px',
            width: '90%',
            maxWidth: '400px',
            textAlign: 'right',
            border: '1px solid #ccc',
            borderRadius: '5px',
            fontFamily: 'inherit'
          }}
        />
      </div>

      {/* Add Book Form */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          marginBottom: 30,
          justifyContent: 'center',
          alignItems: 'flex-end',
          maxWidth: 600,
          marginInline: 'auto'
        }}
      >
        <input
          style={{ padding: '8px', flex: '1 1 140px', minWidth: '120px', textAlign: 'right' }}
          placeholder="العنوان"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
        />
        <input
          style={{ padding: '8px', flex: '1 1 140px', minWidth: '120px', textAlign: 'right' }}
          placeholder="المؤلف"
          value={form.author}
          onChange={e => setForm({ ...form, author: e.target.value })}
        />
        <input
          style={{ padding: '8px', flex: '1 1 140px', minWidth: '120px', textAlign: 'right' }}
          placeholder="النوع"
          value={form.genre}
          onChange={e => setForm({ ...form, genre: e.target.value })}
        />

        <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 200px', minWidth: '120px' }}>
          <label style={{ marginBottom: 5, fontWeight: 'bold' }}>غلاف الكتاب</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setForm({ ...form, cover: e.target.files[0] })}
            style={{
              padding: '6px',
              border: '1px solid #ccc',
              borderRadius: 5,
              direction: 'rtl',
              cursor: 'pointer',
              fontFamily: 'inherit'
            }}
          />
        </div>

        <button
          onClick={addBook}
          style={{
            padding: '8px 15px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: 5,
            height: '42px',
            flex: '1 1 100px',
            minWidth: '120px',
            cursor: 'pointer'
          }}
        >
          إضافة كتاب
        </button>
      </div>

      {/* No books */}
      {books.length === 0 && (
        <p style={{ textAlign: 'center', color: 'gray' }}>لا توجد كتب مضافة بعد.</p>
      )}

      {/* Book Grid */}
      <ul
        style={{
          listStyleType: 'none',
          padding: 0,
          maxWidth: 1000,
          margin: 'auto',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          justifyContent: 'center'
        }}
      >
        {books
          .filter(book =>
            [book.title, book.author, book.genre].some(field =>
              field?.toLowerCase().includes(searchTerm.toLowerCase())
            )
          )
          .map(book => (
            <li
              key={book._id}
              style={{
                backgroundColor: '#f9f9f9',
                borderRadius: 5,
                padding: 10,
                width: '100%',
                maxWidth: 180,
                textAlign: 'center',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                marginInline: 'auto'
              }}
            >
              {book.cover && (
                <img
                  src={book.cover}
                  alt="غلاف الكتاب"
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: 5
                  }}
                />
              )}
              <div style={{ marginTop: 10, fontWeight: 'bold' }}>{book.title}</div>
              <div style={{ fontSize: 'small', color: '#555' }}>{book.author}</div>
              <div style={{ fontSize: 'small', color: '#777' }}>{book.genre}</div>
              <button
                onClick={() => deleteBook(book._id)}
                style={{
                  backgroundColor: '#cc3300',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: 5,
                  cursor: 'pointer',
                  marginTop: 10
                }}
              >
                حذف
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default App;
