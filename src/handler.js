const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (req, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = req.payload;

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const id = nanoid(16);

  const finished = pageCount === readPage;

  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const res = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });

    res.code(201);
    return res;
  }

  const res = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });

  res.code(400);
  return res;
};

const getAllBooksHandler = (req, h) => {
  const sendResponse = (body) => {
    const res = h.response({
      status: 'success',
      data: {
        books: body.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    }).code(200);

    return res;
  };

  const { reading, finished, name } = req.query;

  if (reading || finished || name) {
    if (reading === '0') {
      const unreadingBook = books.filter((b) => b.reading === false);

      return sendResponse(unreadingBook);
    }

    if (reading === '1') {
      const readingBook = books.filter((book) => book.reading === true);

      return sendResponse(readingBook);
    }

    if (finished === '0') {
      const unfinishedBook = books.filter((b) => b.finished === false);

      return sendResponse(unfinishedBook);
    }

    if (finished === '1') {
      const finishedBook = books.filter((b) => b.finished === true);

      return sendResponse(finishedBook);
    }

    if (name) {
      const dicodingBook = books.filter((book) => book.name.toLowerCase().includes('dicoding'));

      return sendResponse(dicodingBook);
    }
  }

  return sendResponse(books);
};

const getBookByIdHandler = (req, h) => {
  const { id } = req.params;

  const book = books.filter((b) => b.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: { book },
    };
  }

  const res = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });

  res.code(404);
  return res;
};

const editBookByIdHandler = (req, h) => {
  const { id } = req.params;

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = req.payload;

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const updatedAt = new Date().toISOString();

  const finished = pageCount === readPage;

  const index = books.findIndex((b) => b.id === id);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };

    const res = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    res.code(200);
    return res;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (req, h) => {
  const { id } = req.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
