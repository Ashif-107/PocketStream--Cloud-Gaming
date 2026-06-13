import { spawn, ChildProcess } from "child_process";

let gameProcess: ChildProcess | null = null;

export function isGameRunning() {
    return gameProcess !== null;
}

export function launchGame(sessionId: string) {
    if (gameProcess) {
        console.log(`[game] already running for session ${sessionId}`);
        return;
    }

    console.log(`[game] launching Jelloman for session ${sessionId}`);

    gameProcess = spawn(
        "./jelloman.x86_64",
        [
            "-force-opengl",
            "-logFile",
            "-",
            "-sessionId",
            sessionId,
            "-signalingUrl",
            process.env.SIGNALING_URL ??
            "https://dcw765wncvs32.cloudfront.net/"
        ],
        {
            cwd: "/home/ubuntu/games/jelloman",
            env: {
                ...process.env,
                DISPLAY: ":99",
                LIBGL_ALWAYS_SOFTWARE: "1"
            },
            detached: false
        }
    );

    gameProcess.stdout?.on("data", (data) => {
        console.log(`[game] ${data}`);
    });

    gameProcess.stderr?.on("data", (data) => {
        console.error(`[game-error] ${data}`);
    });

    gameProcess.on("exit", (code) => {
        console.log(`[game] exited with code ${code}`);
        gameProcess = null;
    });
}

export function stopGame() {
    if (!gameProcess) return;

    gameProcess.kill();
    gameProcess = null;

    console.log("[game] stopped");
}