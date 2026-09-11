import { DeepgramClient } from "@deepgram/sdk";

const deepgram = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
});

export const setupDeepgramSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    // =====================================================
    // CONNECTION STATE
    // =====================================================

    let connection = null;

    let deepgramReady = false;

    // True when interview/socket is intentionally shutting down
    let shuttingDown = false;

    // Prevent multiple simultaneous connection attempts
    let connecting = false;

    // Reconnect timer
    let reconnectTimer = null;

    // Used to identify the current Deepgram connection
    let connectionGeneration = 0;

    // =====================================================
    // CLEAR RECONNECT TIMER
    // =====================================================

    const clearReconnectTimer = () => {
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
    };

    // =====================================================
    // CONNECT TO DEEPGRAM
    // =====================================================

    const connectToDeepgram = async () => {
      // ---------------------------------------------------
      // DO NOT CONNECT AFTER SHUTDOWN
      // ---------------------------------------------------

      if (shuttingDown) {
        console.log(
          "🛑 Not connecting to Deepgram - socket shutting down:",
          socket.id
        );

        return;
      }

      // ---------------------------------------------------
      // SOCKET MUST STILL EXIST
      // ---------------------------------------------------

      if (!socket.connected) {
        console.log(
          "⚠️ Socket is no longer connected:",
          socket.id
        );

        return;
      }

      // ---------------------------------------------------
      // ALREADY CONNECTING
      // ---------------------------------------------------

      if (connecting) {
        console.log(
          "⏳ Deepgram connection attempt already running:",
          socket.id
        );

        return;
      }

      // ---------------------------------------------------
      // ALREADY CONNECTED
      // ---------------------------------------------------

      if (connection && deepgramReady) {
        console.log(
          "🟢 Deepgram already connected:",
          socket.id
        );

        return;
      }

      // ---------------------------------------------------
      // IF A DEAD CONNECTION OBJECT EXISTS
      // ---------------------------------------------------

      if (connection && !deepgramReady) {
        console.log(
          "⚠️ Clearing stale Deepgram connection:",
          socket.id
        );

        connection = null;
      }

      connecting = true;

      // Give this connection a unique generation number
      const myGeneration = ++connectionGeneration;

      try {
        console.log(
          "🔄 Connecting to Deepgram:",
          socket.id
        );

        // =================================================
        // CREATE DEEPGRAM CONNECTION
        // =================================================

        const dgConnection = await deepgram.listen.v1.connect({
          model: "nova-3",
          language: "en-US",
          encoding: "linear16",
          sample_rate: 16000,
          channels: 1,
          smart_format: true,
          interim_results: true,
          punctuate: true,
          vad_events: true,
          utterance_end_ms: 1000,
        });
        // =================================================
        // CHECK WHETHER THIS ATTEMPT IS STILL VALID
        // =================================================

        if (
          shuttingDown ||
          !socket.connected ||
          myGeneration !== connectionGeneration
        ) {
          console.log(
            "⚠️ Deepgram connection became invalid before opening:",
            socket.id
          );

          try {
            dgConnection.sendCloseStream();
          } catch (error) {
            // Ignore cleanup errors
          }

          connecting = false;

          return;
        }

        // =================================================
        // MAKE THIS THE ACTIVE CONNECTION
        // =================================================

        connection = dgConnection;

        // =================================================
        // DEEPGRAM OPEN
        // =================================================

        dgConnection.on("open", () => {
          // Ignore stale connection
          if (myGeneration !== connectionGeneration) {
            console.log(
              "⚠️ Ignoring stale Deepgram open:",
              socket.id
            );

            try {
              dgConnection.sendCloseStream();
            } catch (error) {
              // Ignore cleanup errors
            }

            return;
          }

          // Socket/interview already ended
          if (
            shuttingDown ||
            !socket.connected
          ) {
            console.log(
              "⚠️ Deepgram opened after shutdown:",
              socket.id
            );

            try {
              dgConnection.sendCloseStream();
            } catch (error) {
              // Ignore cleanup errors
            }

            return;
          }

          console.log(
            "🟢 Deepgram connected:",
            socket.id
          );

          deepgramReady = true;

          socket.emit("deepgram-ready");

          console.log(
            "✅ Deepgram ready to receive audio:",
            socket.id
          );
        });

        // =================================================
        // DEEPGRAM MESSAGE
        // =================================================

        dgConnection.on("message", (data) => {
          // Ignore stale connection
          if (
            shuttingDown ||
            !socket.connected ||
            myGeneration !== connectionGeneration
          ) {
            return;
          }

          // -------------------------------------------------
          // TRANSCRIPT
          // -------------------------------------------------

          if (data.type === "Results") {
            const transcript =
              data.channel?.alternatives?.[0]?.transcript ||
              "";

            if (!transcript.trim()) {
              return;
            }

            console.log(
              "📝 Deepgram transcript:",
              transcript,
              "| final:",
              data.is_final,
              "| speech final:",
              data.speech_final
            );

            socket.emit("transcript", {
              text: transcript,
              isFinal: Boolean(data.is_final),
              speechFinal: Boolean(data.speech_final),
            });
          }

          // -------------------------------------------------
          // SPEECH STARTED
          // -------------------------------------------------

          if (data.type === "SpeechStarted") {
            console.log(
              "🎤 Speech started:",
              socket.id
            );

            socket.emit("speech-started");
          }

          // -------------------------------------------------
          // UTTERANCE END
          // -------------------------------------------------

          if (data.type === "UtteranceEnd") {
            console.log(
              "⏹️ Utterance ended:",
              socket.id
            );

            socket.emit("utterance-end");
          }
        });

        // =================================================
        // DEEPGRAM ERROR
        // =================================================

        dgConnection.on("error", (error) => {
          // Ignore stale connection
          if (
            myGeneration !== connectionGeneration
          ) {
            return;
          }

          console.error(
            "❌ Deepgram error:",
            error
          );

          deepgramReady = false;

          if (
            !shuttingDown &&
            socket.connected
          ) {
            socket.emit("deepgram-error", {
              message:
                error?.message ||
                "Deepgram connection error",
            });
          }
        });

        // =================================================
        // DEEPGRAM CLOSE
        // =================================================

        dgConnection.on("close", () => {
          console.log("🔴 Deepgram connection closed:", socket.id);

          deepgramReady = false;

          if (connection === dgConnection) {
            connection = null;
          }

          if (!shuttingDown && socket.connected) {
            socket.emit("deepgram-error", {
              message: "Deepgram connection closed unexpectedly",
            });
          }
        });

        // =================================================
        // START DEEPGRAM CONNECTION
        // =================================================

        dgConnection.connect();

        await dgConnection.waitForOpen();

        // -------------------------------------------------
        // CHECK AGAIN AFTER WAIT
        // -------------------------------------------------

        if (
          shuttingDown ||
          !socket.connected ||
          myGeneration !== connectionGeneration
        ) {
          console.log(
            "⚠️ Deepgram connection became invalid after waitForOpen:",
            socket.id
          );

          try {
            dgConnection.sendCloseStream();
          } catch (error) {
            // Ignore cleanup errors
          }

          connecting = false;

          return;
        }

        connecting = false;

        console.log(
          "✅ Deepgram connection established:",
          socket.id
        );
      } catch (error) {
        // -------------------------------------------------
        // CONNECTION ATTEMPT FAILED
        // -------------------------------------------------

        connecting = false;

        console.error(
          "❌ Failed to connect to Deepgram:",
          error
        );

        if (
          shuttingDown ||
          !socket.connected
        ) {
          return;
        }

        connection = null;
        deepgramReady = false;

        socket.emit("deepgram-error", {
          message:
            error?.message ||
            "Failed to connect to Deepgram",
        });

        // -------------------------------------------------
        // RETRY
        // -------------------------------------------------

        clearReconnectTimer();

        reconnectTimer = setTimeout(() => {
          reconnectTimer = null;

          if (
            shuttingDown ||
            !socket.connected ||
            connection ||
            connecting
          ) {
            return;
          }

          connectToDeepgram();
        }, 2000);
      }
    };

    // =====================================================
    // START DEEPGRAM
    // =====================================================

    connectToDeepgram();

    // =====================================================
    // RECEIVE MICROPHONE AUDIO
    // =====================================================

    socket.on("microphone-audio", (audio) => {
      const audioSize =
        audio?.byteLength || 0;

      if (
        !audio ||
        audioSize === 0
      ) {
        console.log(
          "⚠️ Empty microphone audio received"
        );

        return;
      }

      console.log(
        "🎤 Audio received:",
        audioSize,
        "bytes"
      );

      // -------------------------------------------------
      // DEEPGRAM NOT READY
      // -------------------------------------------------

      if (
        shuttingDown ||
        !connection ||
        !deepgramReady
      ) {
        console.log(
          "⚠️ Audio ignored: Deepgram not ready"
        );

        return;
      }

      // -------------------------------------------------
      // SEND AUDIO
      // -------------------------------------------------

      try {
        connection.sendMedia(audio);

        console.log(
          "📤 Audio sent to Deepgram:",
          audioSize,
          "bytes"
        );
      } catch (error) {
        console.error(
          "❌ Failed to send audio to Deepgram:",
          error
        );

        deepgramReady = false;
      }
    });

    // =====================================================
    // STOP TRANSCRIPTION
    // =====================================================

    socket.on("stop-transcription", () => {
      console.log(
        "🛑 Stop transcription:",
        socket.id
      );

      // -------------------------------------------------
      // PREVENT DOUBLE SHUTDOWN
      // -------------------------------------------------

      if (shuttingDown) {
        console.log(
          "ℹ️ Deepgram shutdown already requested:",
          socket.id
        );

        return;
      }

      shuttingDown = true;

      // -------------------------------------------------
      // CANCEL RECONNECT
      // -------------------------------------------------

      clearReconnectTimer();

      // Invalidate all old connections
      connectionGeneration++;

      // -------------------------------------------------
      // SAVE ACTIVE CONNECTION
      // -------------------------------------------------

      const activeConnection = connection;

      connection = null;
      deepgramReady = false;
      connecting = false;

      // -------------------------------------------------
      // CLOSE DEEPGRAM
      // -------------------------------------------------

      if (!activeConnection) {
        console.log(
          "ℹ️ No Deepgram connection to close:",
          socket.id
        );

        return;
      }

      try {
        activeConnection.sendCloseStream();

        console.log(
          "✅ Deepgram CloseStream sent:",
          socket.id
        );
      } catch (error) {
        console.log(
          "ℹ️ Deepgram cleanup:",
          error?.message || error
        );
      }
    });

    // =====================================================
    // SOCKET DISCONNECT
    // =====================================================

    socket.on("disconnect", (reason) => {
      console.log(
        "🔴 Socket disconnected:",
        socket.id,
        "Reason:",
        reason
      );

      // -------------------------------------------------
      // SHUTDOWN
      // -------------------------------------------------

      shuttingDown = true;

      // -------------------------------------------------
      // CANCEL RECONNECT
      // -------------------------------------------------

      clearReconnectTimer();

      // Invalidate old Deepgram connections
      connectionGeneration++;

      // -------------------------------------------------
      // SAVE ACTIVE CONNECTION
      // -------------------------------------------------

      const activeConnection = connection;

      connection = null;
      deepgramReady = false;
      connecting = false;

      // -------------------------------------------------
      // CLOSE DEEPGRAM
      // -------------------------------------------------

      if (!activeConnection) {
        console.log(
          "ℹ️ No Deepgram connection to clean up:",
          socket.id
        );

        return;
      }

      try {
        activeConnection.sendCloseStream();

        console.log(
          "🛑 Deepgram CloseStream sent on disconnect:",
          socket.id
        );
      } catch (error) {
        console.log(
          "ℹ️ Deepgram cleanup:",
          error?.message || error
        );
      }
    });
  });
};