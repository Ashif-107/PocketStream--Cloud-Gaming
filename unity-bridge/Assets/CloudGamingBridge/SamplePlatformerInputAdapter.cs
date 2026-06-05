using UnityEngine;

namespace PocketStream
{
    public class SamplePlatformerInputAdapter : MonoBehaviour
    {
        [SerializeField] private CloudInputReceiver inputReceiver;
        [SerializeField] private Rigidbody2D playerBody;
        [SerializeField] private float moveSpeed = 7f;
        [SerializeField] private float jumpForce = 12f;
        [SerializeField] private LayerMask groundMask;
        [SerializeField] private Transform groundCheck;
        [SerializeField] private float groundRadius = 0.18f;

        private bool jumpWasPressed;

        private void Reset()
        {
            playerBody = GetComponent<Rigidbody2D>();
        }

        private void Update()
        {
            if (inputReceiver == null)
            {
                return;
            }

            CloudInputState input = inputReceiver.LatestInput;
            bool isGrounded = groundCheck == null || Physics2D.OverlapCircle(groundCheck.position, groundRadius, groundMask);

            Vector2 velocity = playerBody.velocity;
            velocity.x = input.moveX * moveSpeed;
            playerBody.velocity = velocity;

            if (input.jump && !jumpWasPressed && isGrounded)
            {
                playerBody.AddForce(Vector2.up * jumpForce, ForceMode2D.Impulse);
            }

            if (input.attack)
            {
                Debug.Log("Cloud attack pressed. Wire this into your attack system.");
            }

            jumpWasPressed = input.jump;
        }
    }
}
