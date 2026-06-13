using UnityEngine;

public class CommandLineConfig : MonoBehaviour
{
    public static string SessionId = "";
    public static string SignalingUrl = "";

    private void Awake()
    {
        var args = System.Environment.GetCommandLineArgs();

        for (int i = 0; i < args.Length; i++)
        {
            if (args[i] == "-sessionId" && i + 1 < args.Length)
                SessionId = args[i + 1];

            if (args[i] == "-signalingUrl" && i + 1 < args.Length)
                SignalingUrl = args[i + 1];
        }

        Debug.Log($"[CONFIG] SessionId={SessionId}");
        Debug.Log($"[CONFIG] SignalingUrl={SignalingUrl}");
    }
}