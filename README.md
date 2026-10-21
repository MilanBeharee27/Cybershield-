# Cybershield-
A Python and Flask cybersecurity monitoring dashboard that analyses simulated security events, detects repeated failed login attempts, and displays alerts through an interactive web interface.
# CyberShield — Cybersecurity Monitoring Dashboard

CyberShield is a beginner-friendly cybersecurity portfolio project built with Python, Flask, JavaScript, HTML and CSS. It provides a dashboard for analysing simulated security events, identifying repeated failed login attempts, and displaying alerts through a web interface.

The project explores fundamental security monitoring concepts and demonstrates how a Python backend can process event data and provide information to an interactive frontend.

## Features

- **Security Event Monitoring:** Loads and displays simulated security events.
- **Failed Login Detection:** Identifies repeated failed login attempts within a defined five-minute window.
- **Alert Dashboard:** Displays detected alerts and security event summaries.
- **REST-Style API Endpoints:** Provides event, summary and alert data through Flask endpoints.
- **Interactive Frontend:** Uses JavaScript to fetch data from the backend and update the dashboard.
- **Automatic Refresh:** Periodically refreshes dashboard data.
- **Alert Sound:** Supports an optional sound notification when new alerts are detected.
- **Sample Security Data:** Uses simulated events for safe testing and demonstration.

## Technologies Used

| Technology | Purpose |
|---|---|
| Python | Backend logic and event processing |
| Flask | Web application and API endpoints |
| JavaScript | Frontend interactions and API requests |
| HTML5 | Dashboard structure |
| CSS3 | Dashboard styling |
| JSON | Sample security event data |
| Git and GitHub | Version control and project hosting |

## How It Works

CyberShield loads simulated security events from a JSON file and processes them using Python.

The detection logic checks for repeated failed login attempts within a defined time window. When the configured threshold is reached, the application generates an alert that can be displayed on the dashboard.

The frontend communicates with the Flask backend using JavaScript `fetch()` requests. The dashboard then displays event information, summary statistics and detected alerts.

The application also includes an optional sound notification feature for newly detected alerts.

## Detection Logic

The current detection rule looks for:

- Three or more failed login attempts
- Within a five-minute time window
- From the relevant source IP address

This rule demonstrates a basic security monitoring technique that can help identify potentially suspicious authentication activity.

The threshold is configurable in the detection logic and can be extended with additional rules in future versions.

## Project Structure

```text
cybershield/
├── app.py
├── detection.py
├── test_detection_manual.py
├── data/
│   └── sample_events.json
├── static/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── dashboard.js
├── templates/
│   └── index.html
├── tests/
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Python 3.10 or newer recommended
- pip
- Git (optional, for cloning the repository)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/CyberShield.git
cd CyberShield
```

Replace `YOUR-USERNAME` with your GitHub username and adjust the repository name if necessary.

### 2. Create a virtual environment

**Windows:**

```bash
python -m venv .venv
.venv\Scripts\activate
```

**Linux/macOS:**

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install dependencies

```bash
pip install Flask
```

If the project uses additional third-party packages, install those as well. Once your dependencies are finalised, you can create a dependency file with:

```bash
pip freeze > requirements.txt
```

Future installations can then use:

```bash
pip install -r requirements.txt
```

### 4. Run the application

```bash
python app.py
```

Open your browser and navigate to:

```text
http://127.0.0.1:5000
```

The dashboard should load locally.

## API Endpoints

The application includes the following endpoints:

| Endpoint | Purpose |
|---|---|
| `/` | Serves the dashboard |
| `/api/events` | Returns security event data |
| `/api/summary` | Returns dashboard summary statistics |
| `/api/alerts` | Returns detected security alerts |

The API endpoints are intended for local demonstration and learning.

## Testing

The project includes a manual detection test script and a `tests/` directory for testing the detection logic.

To run the manual test, if configured for direct execution:

```bash
python test_detection_manual.py
```

Additional automated tests can be added to verify detection thresholds, time windows, event filtering and alert generation.

## Security and Limitations

CyberShield is an educational portfolio project. It currently analyses simulated security events rather than monitoring live network traffic or collecting events from real systems.

The failed-login detection rule is a basic example and should not be treated as a complete intrusion detection system. Real-world security monitoring requires additional detection rules, reliable log collection, appropriate alert handling and testing against false positives.

Sample IP addresses and event records should remain synthetic. No real credentials, private information or sensitive logs should be committed to the repository.

## Future Improvements

Potential future enhancements include:

- Integration with real authentication logs in a controlled test environment
- Additional detection rules for suspicious activity
- Improved alert severity classification
- Filtering and searching security events
- Automated unit and integration tests
- Alert history and investigation details
- User authentication and access controls
- Docker-based deployment
- Improved dashboard accessibility and responsive design

## Learning Objectives

This project has helped me explore:

- Python backend development with Flask
- API development and JSON responses
- Frontend-to-backend communication
- Basic security event analysis
- Rule-based threat detection
- Dashboard development with JavaScript
- Debugging, testing and version control

## Author

Developed as a personal cybersecurity and software development portfolio project.

**Focus areas:** Security monitoring, threat detection, Python development and cybersecurity fundamentals.
