// utils/fileReaders.ts

// Read a plain text file
export const readTextFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };
  
  // Read a DOCX file
//   export const readDocxFile = (file: File): Promise<string> => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = () => {
//         const arrayBuffer = reader.result as ArrayBuffer;
//         // Use a library to read DOCX content, for example 'docxtemplater' or similar
//         const doc = new window.Docxtemplater(arrayBuffer); // This is just a placeholder
//         const text = doc.getFullText(); // Assuming docxtemplater is used
//         resolve(text);
//       };
//       reader.onerror = reject;
//       reader.readAsArrayBuffer(file);
//     });
//   };
  