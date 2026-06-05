using System;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using UnityEngine;

namespace PocketStream
{
    public class CloudInputReceiver : MonoBehaviour
    {
        [SerializeField] private int listenPort = 7777;
        [SerializeField] private bool persistAcrossScenes = true;

        private readonly object inputLock = new object();
        private UdpClient udpClient;
        private Thread listenerThread;
        private bool isRunning;
        private CloudInputState latestInput = new CloudInputState();

        public CloudInputState LatestInput
        {
            get
            {
                lock (inputLock)
                {
                    return latestInput.Clone();
                }
            }
        }

        private void Awake()
        {
            if (persistAcrossScenes)
            {
                DontDestroyOnLoad(gameObject);
            }
        }

        private void OnEnable()
        {
            StartListener();
        }

        private void OnDisable()
        {
            StopListener();
        }

        private void StartListener()
        {
            if (isRunning)
            {
                return;
            }

            isRunning = true;
            udpClient = new UdpClient(listenPort);
            listenerThread = new Thread(ListenLoop)
            {
                IsBackground = true,
                Name = "PocketStream Cloud Input"
            };
            listenerThread.Start();
            Debug.Log($"PocketStream input listening on UDP port {listenPort}");
        }

        private void StopListener()
        {
            isRunning = false;
            udpClient?.Close();
            udpClient = null;

            if (listenerThread != null && listenerThread.IsAlive)
            {
                listenerThread.Join(100);
            }

            listenerThread = null;
        }

        private void ListenLoop()
        {
            var remoteEndPoint = new IPEndPoint(IPAddress.Any, listenPort);

            while (isRunning)
            {
                try
                {
                    byte[] bytes = udpClient.Receive(ref remoteEndPoint);
                    string json = Encoding.UTF8.GetString(bytes);
                    CloudInputState nextInput = JsonUtility.FromJson<CloudInputState>(json);

                    if (nextInput == null)
                    {
                        continue;
                    }

                    lock (inputLock)
                    {
                        if (nextInput.sequence >= latestInput.sequence)
                        {
                            latestInput = nextInput.Clone();
                        }
                    }
                }
                catch (SocketException)
                {
                    if (isRunning)
                    {
                        Debug.LogWarning("PocketStream input socket interrupted.");
                    }
                }
                catch (ObjectDisposedException)
                {
                    break;
                }
                catch (Exception error)
                {
                    Debug.LogWarning($"PocketStream input parse failed: {error.Message}");
                }
            }
        }
    }
}
