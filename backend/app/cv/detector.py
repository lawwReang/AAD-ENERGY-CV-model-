import torch
from ultralytics import YOLO


MODEL_PATH = "models/yolov8n.pt"

PERSON_CLASS = 0
KNIFE_CLASS = 43

CONFIDENCE = 0.20


class SmartMCBDetector:
    def __init__(
        self,
        model_path: str = MODEL_PATH,
        confidence: float = CONFIDENCE,
    ):
        self.model_path = model_path
        self.confidence = confidence

        # Apple Silicon GPU
        if torch.backends.mps.is_available():
            self.device = "mps"
        else:
            self.device = "cpu"

        print(f"[CV] Device: {self.device}")
        print(f"[CV] Loading YOLO model: {model_path}")

        self.model = YOLO(model_path)

        print("[CV] YOLO model loaded successfully.")

    def detect(self, frame):
        """
        Run YOLO detection on a single OpenCV frame.
        """

        results = self.model(
            frame,
            device=self.device,
            classes=[
                PERSON_CLASS,
                KNIFE_CLASS,
            ],
            conf=self.confidence,
            verbose=False,
        )

        return results[0]

    def annotate(self, frame):
        """
        Run detection and return an annotated frame.
        """

        result = self.detect(frame)

        return result.plot()

    def get_detection_data_from_result(self, result):
        """
        Extract structured detection information
        from an already-processed YOLO result.

        This avoids running YOLO twice on the same frame.
        """

        person_count = 0
        knife_count = 0

        person_confidence = 0.0
        knife_confidence = 0.0

        detections = []

        if result.boxes is None:
            return {
                "person_detected": 0,
                "knife_detected": 0,
                "person_confidence": 0.0,
                "knife_confidence": 0.0,
                "detections": [],
            }

        for box in result.boxes:

            class_id = int(box.cls[0])
            confidence = float(box.conf[0])

            x1, y1, x2, y2 = map(
                int,
                box.xyxy[0].tolist(),
            )

            class_name = self.model.names.get(
                class_id,
                str(class_id),
            )

            detections.append(
                {
                    "class_id": class_id,
                    "class_name": class_name,
                    "confidence": round(confidence, 4),
                    "bbox": {
                        "x1": x1,
                        "y1": y1,
                        "x2": x2,
                        "y2": y2,
                    },
                }
            )

            if class_id == PERSON_CLASS:
                person_count += 1
                person_confidence = max(
                    person_confidence,
                    confidence,
                )

            elif class_id == KNIFE_CLASS:
                knife_count += 1
                knife_confidence = max(
                    knife_confidence,
                    confidence,
                )

        return {
            "person_detected": person_count,
            "knife_detected": knife_count,
            "person_confidence": round(
                person_confidence,
                4,
            ),
            "knife_confidence": round(
                knife_confidence,
                4,
            ),
            "detections": detections,
        }

    def get_detection_data(self, frame):
        """
        Run detection and return structured data.

        This method is useful when only detection
        information is required.
        """

        result = self.detect(frame)

        return self.get_detection_data_from_result(result)