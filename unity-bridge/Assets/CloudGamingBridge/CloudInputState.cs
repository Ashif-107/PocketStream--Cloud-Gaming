using System;
using UnityEngine;

namespace PocketStream
{
    [Serializable]
    public class CloudInputState
    {
        public string sessionId;
        public int sequence;
        public double timestamp;
        public float moveX;
        public bool jump;
        public bool attack;

        public CloudInputState Clone()
        {
            return new CloudInputState
            {
                sessionId = sessionId,
                sequence = sequence,
                timestamp = timestamp,
                moveX = Mathf.Clamp(moveX, -1f, 1f),
                jump = jump,
                attack = attack
            };
        }
    }
}
