using UnityEngine;
using Unity.WebRTC;

public class WebRTCManager : MonoBehaviour
{
    public RenderTexture streamTexture;

    private RTCPeerConnection peer;
    private VideoStreamTrack videoTrack;

    private void Start()
    {
        Debug.Log("WEBRTC START CALLED");

        StartCoroutine(WebRTC.Update());

        Debug.Log("[WEBRTC] Initializing");

        RTCConfiguration config = new RTCConfiguration
        {
            iceServers = new[]
            {
                new RTCIceServer
                {
                    urls = new[]
                    {
                        "stun:stun.l.google.com:19302",
                        "stun:stun1.l.google.com:19302"
                    }
                }
            }
        };

        peer = new RTCPeerConnection(ref config);

        Debug.Log("[WEBRTC] Peer created");

        videoTrack = new VideoStreamTrack(streamTexture);

        peer.AddTrack(videoTrack);

        Debug.Log("[VIDEO] Track added");
    }

    private void OnDestroy()
    {
        videoTrack?.Dispose();

        if (peer != null)
        {
            peer.Close();
            peer.Dispose();
        }
    }
}