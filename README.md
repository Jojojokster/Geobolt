# Geobolt

## Description

Geobolt is a Node.js and Express-based web application designed to provide users with weather and country information, along with landmark management. Users can register and log in to access functionalities such as viewing weather conditions, exploring country details, and managing personal landmarks.

## Features

* **User Authentication:** Secure user registration and login system with password hashing.
* **Weather Data:** Retrieve and display weather information for specific locations.
* **Country Information:** Access details about various countries.
* **Landmark Management:** Create, view, update, and delete custom landmarks.

## Prerequisites

To run Geobolt, ensure the following software is installed:

* Node.js
* MySQL database server

## Installation

Follow these steps to install and run the application:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Jojojokster/Geobolt.git
   cd Geobolt
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Database setup:**
   Run the provided `create_db.sql` script in your MySQL environment to set up the necessary database schema.

4. **Run the application:**
   Launch the application by executing:

   ```bash
   node index.js
   ```

   The server typically runs on `localhost:3000`. Open this URL in a web browser to access the application.

## Usage

Upon launching the application, users can:

* Register or log in to their account.
* View and search for weather data by location.
* View detailed information about countries.
* Add, update, or delete landmarks.

## System Requirements

* Node.js (latest stable version recommended)
* MySQL database server
* Any modern web browser
