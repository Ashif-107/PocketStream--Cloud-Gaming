using PocketStream;
using UnityEngine;

public class PlayerMovement : MonoBehaviour
{
    [Header("Cloud Input")]
    [SerializeField] private CloudInputReceiver cloudInput;
    [SerializeField] private bool useCloudInput = true;

    [Header("Movement")]
    [SerializeField] private float moveSpeed = 7f;
    [SerializeField] private float jumpForce = 12f;

    [Header("Ground Check")]
    [SerializeField] private Transform groundCheck;
    [SerializeField] private float groundCheckRadius = 0.2f;
    [SerializeField] private LayerMask groundLayer;

    private Rigidbody2D rb;
    private bool jumpWasPressed;

    private void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
    }

    private void Update()
    {
        InputFrame input = ReadInput();

        Move(input.moveX);

        if (input.jump && !jumpWasPressed && IsGrounded())
        {
            Jump();
        }

        if (input.attack)
        {
            Attack();
        }

        jumpWasPressed = input.jump;
    }

    private InputFrame ReadInput()
    {
        if (useCloudInput && cloudInput != null)
        {
            CloudInputState cloud = cloudInput.LatestInput;

            return new InputFrame
            {
                moveX = Mathf.Clamp(cloud.moveX, -1f, 1f),
                jump = cloud.jump,
                attack = cloud.attack
            };
        }

        return new InputFrame
        {
            moveX = Input.GetAxisRaw("Horizontal"),
            jump = Input.GetButton("Jump"),
            attack = Input.GetButton("Fire1")
        };
    }

    private void Move(float moveX)
    {
        Vector2 velocity = rb.velocity;
        velocity.x = moveX * moveSpeed;
        rb.velocity = velocity;

        if (moveX > 0.01f)
        {
            transform.localScale = new Vector3(1f, 1f, 1f);
        }
        else if (moveX < -0.01f)
        {
            transform.localScale = new Vector3(-1f, 1f, 1f);
        }
    }

    private void Jump()
    {
        Vector2 velocity = rb.velocity;
        velocity.y = 0f;
        rb.velocity = velocity;

        rb.AddForce(Vector2.up * jumpForce, ForceMode2D.Impulse);
    }

    private bool IsGrounded()
    {
        if (groundCheck == null)
        {
            return true;
        }

        return Physics2D.OverlapCircle(
            groundCheck.position,
            groundCheckRadius,
            groundLayer
        );
    }

    private void Attack()
    {
        // Connect this to your attack / shoot / interact logic later.
        Debug.Log("Attack pressed");
    }

    private struct InputFrame
    {
        public float moveX;
        public bool jump;
        public bool attack;
    }
}