using UnityEngine;

public class SocketIOSignaling : MonoBehaviour
{
    void Start()
    {
        Debug.Log("[SIGNAL] SocketIOSignaling started");
        Debug.Log($"[SIGNAL] Session={CommandLineConfig.SessionId}");
        Debug.Log($"[SIGNAL] URL={CommandLineConfig.SignalingUrl}");
    }
}