import multer from 'multer';
import path from 'path';

// Define storage settings
const storage = multer.memoryStorage(); // We'll store files in memory so we don't have to clean up temp files

// Filter for generic data files (CSV, JSON)
const dataFileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (
    file.mimetype === 'text/csv' ||
    file.mimetype === 'application/json' ||
    file.originalname.endsWith('.csv') ||
    file.originalname.endsWith('.json')
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only .csv and .json files are allowed!'));
  }
};

// Filter for documents (PDF, TXT, DOCX)
const docFileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'text/plain' ||
    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.originalname.endsWith('.pdf') ||
    file.originalname.endsWith('.txt') ||
    file.originalname.endsWith('.docx')
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only .pdf, .txt, and .docx files are allowed!'));
  }
};

// Filter for images
const imageFileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

export const uploadDataFile = multer({ storage, fileFilter: dataFileFilter, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB
export const uploadDocument = multer({ storage, fileFilter: docFileFilter, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB
export const uploadImage = multer({ storage, fileFilter: imageFileFilter, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB
