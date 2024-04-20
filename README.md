Job Board is a web application that allows users to manage and track job offers using a kanban board interface. It provides features such as web scraping job offer details, storing them in a database, and a Chrome extension for easy access and editing of job offers.

## Features

* Kanban board interface for organizing job offers
* Web scraping functionality to extract job offer details from websites
* Backend API for storing and retrieving job offers
* Chrome extension for accessing and editing job offers directly from the browser
* Ability to add notes and update the status of job offers
* Drag and drop functionality to move job offers between different stages

## Technologies Used

* Backend:
  * Node.js
  * Express.js
  * MongoDB
  * Mongoose
  * Puppeteer (for web scraping)
* Frontend:
  * Angular
  * TypeScript
  * HTML
  * CSS/SCSS
  * Angular Material (for UI components)
* Chrome Extension:
  * Chrome Extension API
  * HTML/CSS/JavaScript

## Getting Started

### Prerequisites

* Node.js and npm installed on your machine
* MongoDB database connection

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/jobboard.git
   ```
2. Install the dependencies for the backend:
   ```
   cd job-tracker/server
   npm install
   ```
3. Install the dependencies for the frontend:
   ```
   cd ../client
   npm install
   ```
4. Configure the database connection:
   * Open the `server/config/db.js` file
   * Update the MongoDB connection URL with your own database credentials
5. Start the backend server:
   ```
   cd ../server
   npm start
   ```
6. Start the frontend development server:
   ```
   cd ../client
   ng serve
   ```
7. Open your browser and visit `http://localhost:4200` to access the application.

### Chrome Extension

1. Open Google Chrome and navigate to `chrome://extensions`.
2. Enable the "Developer mode" toggle switch in the top right corner.
3. Click on "Load unpacked" and select the `chrome-extension` directory from the project.
4. The Job Tracker extension should now be installed and visible in the Chrome toolbar.

## Usage

* Open the Job Tracker application in your browser.
* Use the kanban board to organize and track your job offers.
* Drag and drop job offers between different stages to update their status.
* Click on a job offer to view its details and add notes.
* Use the Chrome extension to easily access and edit job offers while browsing job websites.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License]().

## Contact

For any questions or inquiries, please contact [smssms@wp.pl.](mailto:smssms@wp.pl.)
