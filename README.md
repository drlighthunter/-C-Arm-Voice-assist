# 🎙️ C-ARM VOICE COMMAND INTERFACE (VCI)

### *Hands-Free Precision for the Modern Operating Room*

[![Status: Prototype](https://img.shields.io/badge/Status-Prototype-orange.svg)]()
[![Hardware: Raspberry Pi](https://img.shields.io/badge/Hardware-Raspberry%20Pi-red.svg)]()
[![Tech: React + Express](https://img.shields.io/badge/Tech-React%20%2B%20Express-blue.svg)]()

---

## 🚀 Overview

The **C-Arm Voice Command Interface** is a high-tech, hands-free control dashboard designed for medical imaging professionals. This prototype demonstrates how voice recognition can be integrated with **Raspberry Pi** hardware to control **Kiran** or **Allengers** C-arm machines, allowing surgeons and technicians to adjust equipment without breaking the sterile field.

---

## ✨ Key Features

- **🗣️ Voice-Activated Kinematics**: Control vertical lift, horizontal travel, and C-arm rotation using natural language commands.
- **⚡ Real-Time Telemetry**: A dynamic, low-latency visualizer built with `motion/react` that reflects machine state instantly.
- **☢️ Exposure Control**: Trigger simulated X-ray captures with "Expose" or "Shoot" commands, featuring visual radiation warnings.
- **🛡️ Safety-First Design**: Integrated **Emergency Stop** protocols and hardware-ready backend simulation.
- **📟 Raspberry Pi Ready**: Backend architecture designed to bridge Web APIs with GPIO or Serial motor controllers.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Animations**: `motion/react` (Framer Motion)
- **Icons**: Lucide React
- **Backend**: Node.js / Express (Hardware Simulation Layer)
- **Voice Engine**: Web Speech API (Native Browser Integration)

---

## 🎙️ Voice Commands

| Action | Commands |
| :--- | :--- |
| **Vertical** | "Up", "Higher", "Elevate", "Down", "Lower" |
| **Rotation** | "Rotate Clockwise", "Turn Right", "Rotate CCW" |
| **Imaging** | "Expose", "Shoot", "Capture", "Take Picture" |
| **Safety** | "Stop", "Halt", "Freeze", "Cancel" |

---

## 🏗️ Hardware Architecture (Conceptual)

1.  **Voice Input**: Captured via browser-based Web Speech API.
2.  **API Bridge**: React frontend sends commands to the Express backend.
3.  **Hardware Control**: Express backend interfaces with Raspberry Pi GPIO pins (using `rpi-gpio` or Serial) to drive stepper motors or hydraulic actuators.
4.  **Feedback Loop**: Encoders return position data to the dashboard for real-time telemetry.

---

## ⚠️ Safety Warning

> **IMPORTANT**: This project is a **PROTOTYPE** and a **SIMULATION**. 
> 
> Real-world medical equipment control requires:
> - Hardware-level interlocks (Physical E-Stops).
> - Radiation shielding protocols.
> - Compliance with FDA, CE, and ISO 13485 medical device regulations.
> - Redundant fail-safe systems.

---

## 🚦 Getting Started

1.  **Clone the Repo**:
    ```bash
    git clone https://github.com/your-repo/c-arm-vci.git
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Run the Simulation**:
    ```bash
    npm run dev
    ```
4.  **Open in Browser**: Navigate to `http://localhost:3000`. Ensure you grant **Microphone Permissions**.

---

*Built with ❤️ for the future of surgical technology.*
