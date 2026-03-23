# Smart To-Do List App

A modern, responsive to-do list application with a unique Apple Notes screenshot import feature using OCR technology.

## Features

### Core To-Do Functionality
- ✅ Add new tasks
- ✅ Mark tasks as complete/incomplete
- ✅ Edit existing tasks inline
- ✅ Delete tasks with confirmation
- ✅ Filter tasks (All, Active, Completed)
- ✅ Task statistics and counters
- ✅ Local storage persistence

### Special Apple Notes Import Feature
- 📸 Upload screenshots of Apple Notes
- 🔍 OCR text extraction using Tesseract.js
- 📝 Intelligent parsing of tasks from extracted text
- ✨ Preview and selectively import tasks
- 🎯 Handles various bullet points, checkboxes, and list formats

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **OCR**: Tesseract.js
- **Icons**: Font Awesome
- **Storage**: Browser LocalStorage

## How to Use

### Basic Task Management
1. Type a task in the input field and press Enter or click "Add Task"
2. Click the circle next to a task to mark it complete/incomplete
3. Click the edit icon to modify a task
4. Click the trash icon to delete a task
5. Use the filter buttons to view All, Active, or Completed tasks

### Apple Notes Import
1. Take a screenshot of your Apple Notes list
2. Click the upload area or drag and drop the image
3. Wait for OCR processing (progress bar will show status)
4. Review the extracted tasks in the preview
5. Uncheck any tasks you don't want to import
6. Click "Import Tasks" to add them to your list

## Supported Image Formats
- PNG
- JPG/JPEG
- WebP

## Browser Compatibility
- Modern browsers with ES6+ support
- Chrome, Firefox, Safari, Edge

## Live Demo
The app is deployed and ready to use at the GitHub Pages URL.

## Local Development
1. Clone this repository
2. Open `index.html` in a web browser
3. No build process required - it's a client-side only application

## OCR Accuracy Tips
For best results when uploading Apple Notes screenshots:
- Use clear, high-contrast images
- Ensure text is readable and not blurry
- Avoid screenshots with too much background noise
- Works best with simple bullet point or checkbox lists

## Privacy
- All data is stored locally in your browser
- No data is sent to external servers
- OCR processing happens entirely in your browser