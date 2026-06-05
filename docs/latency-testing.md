# Latency Testing Notes

Track metrics in the README and demo video. Even simple measurements make the project look engineered instead of improvised.

## MVP Metrics

- Phone-to-server ping from Socket.IO.
- Input event timestamp to Unity receive timestamp.
- WebRTC stats: frames per second, bitrate, packet loss, round trip time.
- Laptop CPU usage while streaming.

## Test Matrix

| Mode | Resolution | Network | FPS | Notes |
| --- | --- | --- | --- | --- |
| Stable | 854x480 | Same Wi-Fi | TBD | Best for low-end laptop demo |
| Balanced | 1280x720 | Same Wi-Fi | TBD | Resume demo target |
| Stress | 1280x720 | Phone hotspot | TBD | Optional |
