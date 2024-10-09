import Echo from "laravel-echo";
import Pusher from "pusher-js";

Pusher.logToConsole = import.meta.env.VITE_REVERB_APP_DEBUG === "true";

window.Pusher = Pusher;

// Crea una instancia de Echo y configura el canal y el evento de Laravel Reverb
export const echo = new Echo({
  broadcaster: "reverb",
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST,
  wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
  wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
  forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? "https") === "https",
  enabledTransports: ["ws", "wss"],
  authEndpoint: import.meta.env.VITE_SANDIAPI_URL + "/api/broadcasting/auth",
  auth: {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    },
},
});