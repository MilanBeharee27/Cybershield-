
const API_EVENTS = "/api/events";
const API_SUMMARY = "/api/summary";
const API_ALERTS = "/api/alerts";

// Sound settings
let audioContext = null;
let soundEnabled = false;

// Keep track of alerts we've already announced
let previousAlertKeys = new Set();

/**
 * Create a short alert beep using the browser's audio system.
 */
function playAlertSound() {
    if (!soundEnabled || !audioContext) {
        return;
    }

    // Browsers may suspend audio until the user interacts
    if (audioContext.state === "suspended") {
        return;
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(
        880,
        audioContext.currentTime
    );

    // Control the volume so the sound fades out smoothly
    gainNode.gain.setValueAtTime(
        0.0001,
        audioContext.currentTime
    );

    gainNode.gain.exponentialRampToValueAtTime(
        0.2,
        audioContext.currentTime + 0.03
    );

    gainNode.gain.exponentialRampToValueAtTime(
        0.0001,
        audioContext.currentTime + 0.35
    );

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.36);
}

/**
 * Enable or disable alert sounds.
 */
function setupSoundToggle() {
    const soundButton = document.getElementById("sound-toggle");

    if (!soundButton) {
        console.warn("Sound toggle button was not found.");
        return;
    }

    soundButton.addEventListener("click", async () => {
        const AudioContextClass =
            window.AudioContext || window.webkitAudioContext;

        if (!AudioContextClass) {
            soundButton.textContent = "Audio Unsupported";
            return;
        }

        try {
            if (!audioContext) {
                audioContext = new AudioContextClass();
            }

            if (!soundEnabled) {
                await audioContext.resume();

                soundEnabled = true;
                soundButton.textContent = "Sound: ON";

                // Test beep confirms that sound is working
                playAlertSound();
            } else {
                soundEnabled = false;
                soundButton.textContent = "Sound: OFF";
            }
        } catch (error) {
            console.error("Could not enable alert sound:", error);
            soundButton.textContent = "Sound Error";
        }
    });
}

/**
 * Display the summary cards.
 */
function updateSummary(summary) {
    document.getElementById("total-events").textContent =
        summary.total_events;

    document.getElementById("high-events").textContent =
        summary.high_severity;

    document.getElementById("medium-events").textContent =
        summary.medium_severity;

    document.getElementById("low-events").textContent =
        summary.low_severity;
}

/**
 * Display security events in the table.
 */
function displayEvents(events) {
    const tableBody = document.getElementById("events-table");

    tableBody.replaceChildren();

    events.forEach((event) => {
        const row = document.createElement("tr");

        const values = [
            event.timestamp,
            event.source_ip,
            event.event_type,
            event.protocol,
            event.port,
            event.severity
        ];

        values.forEach((value, index) => {
            const cell = document.createElement("td");

            cell.textContent = value ?? "Unknown";

            if (index === 5) {
                const severity = String(value ?? "unknown").toLowerCase();
                cell.classList.add("severity", severity);
            }

            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });
}

/**
 * Display detected security alerts.
 */
function displayAlerts(alerts) {
    const alertsContainer =
        document.getElementById("alerts-container");

    alertsContainer.replaceChildren();

    if (alerts.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No security alerts detected.";
        alertsContainer.appendChild(message);
        return;
    }

    alerts.forEach((alert) => {
        const alertCard = document.createElement("div");
        alertCard.classList.add("alert-card");

        const heading = document.createElement("h3");
        heading.textContent = alert.alert_type.replaceAll("_", " ");

        const message = document.createElement("p");
        message.textContent = alert.message;

        const severity = document.createElement("span");
        severity.classList.add(
            "severity",
            String(alert.severity ?? "unknown").toLowerCase()
        );
        severity.textContent =
            `Severity: ${alert.severity ?? "Unknown"}`;

        alertCard.appendChild(heading);
        alertCard.appendChild(message);
        alertCard.appendChild(severity);

        alertsContainer.appendChild(alertCard);
    });
}

/**
 * Create a consistent key for each alert.
 * This lets us recognise alerts across dashboard refreshes.
 */
function getAlertKey(alert) {
    return [
        alert.alert_type,
        alert.source_ip,
        alert.attempts,
        alert.window_minutes
    ].join("|");
}

/**
 * Fetch data from Flask and update the dashboard.
 */
async function loadDashboard() {
    const statusElement = document.getElementById("status");

    try {
        const [eventsResponse, summaryResponse, alertsResponse] =
            await Promise.all([
                fetch(API_EVENTS),
                fetch(API_SUMMARY),
                fetch(API_ALERTS)
            ]);

        if (
            !eventsResponse.ok ||
            !summaryResponse.ok ||
            !alertsResponse.ok
        ) {
            throw new Error("One or more API requests failed.");
        }

        const [events, summary, alerts] = await Promise.all([
            eventsResponse.json(),
            summaryResponse.json(),
            alertsResponse.json()
        ]);

        // Update the visible dashboard
        updateSummary(summary);
        displayEvents(events);
        displayAlerts(alerts);

        // Only beep for alerts that weren't present last time
        const currentAlertKeys = new Set(
            alerts.map(getAlertKey)
        );

        const hasNewAlerts = [...currentAlertKeys].some(
            (key) => !previousAlertKeys.has(key)
        );

        if (hasNewAlerts && previousAlertKeys.size > 0) {
            playAlertSound();
        }

        previousAlertKeys = currentAlertKeys;

        statusElement.textContent =
            `Dashboard updated at ${new Date().toLocaleTimeString()}`;
    } catch (error) {
        console.error("Error loading CyberShield:", error);

        statusElement.textContent =
            "Unable to load dashboard data. Check that Flask is running.";
    }
}

// Initialise the dashboard
document.addEventListener("DOMContentLoaded", () => {
    setupSoundToggle();

    // First load displays existing alerts without announcing them
    loadDashboard();

    // Refresh dashboard data every 10 seconds
    setInterval(loadDashboard, 10000);
});
