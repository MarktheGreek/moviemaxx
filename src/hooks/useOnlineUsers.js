import { useEffect, useState } from "react";

const DB_URL = "https://moviemaxx-online-default-rtdb.firebaseio.com";
const HEARTBEAT_INTERVAL = 5000; // 5s
const TIMEOUT = 15000; // 15s = offline

export const useOnlineUsers = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const userId =
      Date.now().toString() + Math.random().toString(36).slice(2);

    const userUrl = `${DB_URL}/onlineUsers/${userId}.json`;

    // 🔹 heartbeat (mark active)
    const heartbeat = async () => {
      try {
        await fetch(userUrl, {
          method: "PUT",
          body: JSON.stringify({ lastActive: Date.now() }),
        });
      } catch {}
    };

    heartbeat();

    const heartbeatTimer = setInterval(heartbeat, HEARTBEAT_INTERVAL);

    // 🔹 poll + cleanup stale users
    const poll = setInterval(async () => {
      try {
        const res = await fetch(`${DB_URL}/onlineUsers.json`);
        const data = await res.json();

        if (!data) {
          setCount(0);
          return;
        }

        const now = Date.now();
        let active = 0;

        for (const [id, user] of Object.entries(data)) {
          if (now - user.lastActive < TIMEOUT) {
            active++;
          } else {
            // 🔥 remove ghost users
            fetch(`${DB_URL}/onlineUsers/${id}.json`, {
              method: "DELETE",
            }).catch(() => {});
          }
        }

        setCount(active);
      } catch {
        setCount(0);
      }
    }, HEARTBEAT_INTERVAL);

    return () => {
      clearInterval(heartbeatTimer);
      clearInterval(poll);

      // best-effort cleanup
      fetch(userUrl, { method: "DELETE" }).catch(() => {});
    };
  }, []);

  return count;
};
