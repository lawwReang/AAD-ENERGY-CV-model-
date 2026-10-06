from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.cv.service import camera_service


router = APIRouter(
    prefix="/api/security",
    tags=["Security"],
)


def generate_frames():
    """
    Generate an MJPEG stream from the CV camera service.
    """

    while True:

        frame = camera_service.get_frame()

        if frame is None:
            continue

        yield (
            b"--frame\r\n"
            b"Content-Type: image/jpeg\r\n\r\n"
            + frame
            + b"\r\n"
        )


@router.get("/video")
def security_video():
    """
    Live annotated camera stream.
    """

    return StreamingResponse(
        generate_frames(),
        media_type="multipart/x-mixed-replace; boundary=frame",
    )


@router.get("/status")
def security_status():
    """
    Latest YOLO detection/security state.
    """

    return camera_service.get_status()