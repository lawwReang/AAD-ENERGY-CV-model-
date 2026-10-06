import threading
import time

import cv2

from app.cv.detector import SmartMCBDetector
from app.emergency.service import trigger_automatic_sos


class CameraService:
    def __init__(self):
        self.detector = SmartMCBDetector()

        self.camera = None
        self.running = False
        self.thread = None

        self.lock = threading.Lock()

        self.latest_frame = None

        self.latest_detection = {
            "camera_status": "OFFLINE",
            "cv_engine_status": "STANDBY",
            "person_detected": 0,
            "knife_detected": 0,
            "person_confidence": 0.0,
            "knife_confidence": 0.0,
            "detections": [],
        }

    # ---------------------------------------------------------
    # START CAMERA SERVICE
    # ---------------------------------------------------------

    def start(self):
        if self.running:
            return

        print("[CV] Starting camera service...")

        self.camera = cv2.VideoCapture(0)

        if not self.camera.isOpened():
            print("[CV] ERROR: Could not open camera.")

            with self.lock:
                self.latest_detection = {
                    "camera_status": "OFFLINE",
                    "cv_engine_status": "STANDBY",
                    "person_detected": 0,
                    "knife_detected": 0,
                    "person_confidence": 0.0,
                    "knife_confidence": 0.0,
                    "detections": [],
                }

            return

        self.running = True

        with self.lock:
            self.latest_detection["camera_status"] = "ONLINE"
            self.latest_detection["cv_engine_status"] = "ACTIVE"

        self.thread = threading.Thread(
            target=self._capture_loop,
            daemon=True,
            name="smart-mcb-camera",
        )

        self.thread.start()

        print("[CV] Camera service started.")

    # ---------------------------------------------------------
    # STOP CAMERA SERVICE
    # ---------------------------------------------------------

    def stop(self):
        self.running = False

        if self.thread:
            self.thread.join(timeout=2)

        if self.camera:
            self.camera.release()

        self.camera = None
        self.thread = None

        with self.lock:
            self.latest_frame = None
            self.latest_detection = {
                "camera_status": "OFFLINE",
                "cv_engine_status": "STANDBY",
                "person_detected": 0,
                "knife_detected": 0,
                "person_confidence": 0.0,
                "knife_confidence": 0.0,
                "detections": [],
            }

        print("[CV] Camera service stopped.")

    # ---------------------------------------------------------
    # CAMERA + YOLO LOOP
    # ---------------------------------------------------------

    def _capture_loop(self):
        print("[CV] Capture thread started.")

        while self.running:

            if self.camera is None:
                print("[CV] Camera object is unavailable.")
                break

            success, frame = self.camera.read()

            if not success:
                print("[CV] Failed to read camera frame.")
                time.sleep(0.1)
                continue

            try:
                # -------------------------------------------------
                # YOLO DETECTION
                # -------------------------------------------------

                result = self.detector.detect(frame)

                detection_data = (
                    self.detector.get_detection_data_from_result(
                        result
                    )
                )

                # -------------------------------------------------
                # INTRUDER ALERT
                #
                # Person + knife detected simultaneously
                # → Automatic SOS
                # -------------------------------------------------

                person_detected = (
                    detection_data["person_detected"] > 0
                )

                knife_detected = (
                    detection_data["knife_detected"] > 0
                )

                if person_detected and knife_detected:
                    trigger_automatic_sos(
                        reason=(
                            "Intruder alert: person and knife "
                            "detected simultaneously"
                        ),
                        device_id="MCB-001",
                        sensor="security",
                        value=detection_data["knife_confidence"],
                    )

                # -------------------------------------------------
                # DRAW REAL YOLO DETECTIONS
                #
                # result.plot() creates the actual bounding boxes
                # visible in /api/security/video.
                # -------------------------------------------------

                annotated_frame = result.plot()

                # -------------------------------------------------
                # UPDATE SHARED STATE
                # -------------------------------------------------

                with self.lock:
                    self.latest_frame = annotated_frame

                    self.latest_detection = {
                        "camera_status": "ONLINE",
                        "cv_engine_status": "ACTIVE",
                        **detection_data,
                    }

            except Exception as exc:
                print(f"[CV] Detection error: {exc}")

                with self.lock:
                    self.latest_detection["camera_status"] = "ONLINE"
                    self.latest_detection["cv_engine_status"] = "DEGRADED"

        print("[CV] Capture thread stopped.")

    # ---------------------------------------------------------
    # GET LATEST VIDEO FRAME
    # ---------------------------------------------------------

    def get_frame(self):
        with self.lock:
            if self.latest_frame is None:
                return None

            success, buffer = cv2.imencode(
                ".jpg",
                self.latest_frame,
            )

            if not success:
                return None

            return buffer.tobytes()

    # ---------------------------------------------------------
    # GET LATEST CV STATUS
    # ---------------------------------------------------------

    def get_status(self):
        with self.lock:
            return dict(self.latest_detection)


# -------------------------------------------------------------
# GLOBAL CAMERA SERVICE
# -------------------------------------------------------------

camera_service = CameraService()