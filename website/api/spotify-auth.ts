import { Application } from "https://deno.land/x/oak/mod.ts";
import { getSpotifyAuthToken } from "./spotify-token.ts";

const app = new Application();

app.use((ctx, next) => {
  const websiteUrl = Deno.env.get("WEBSITE_URL");

  if (!websiteUrl) {
    ctx.response.headers.set("Access-Control-Allow-Origin", "*");
    return next();
  }

  ctx.response.headers.set("Access-Control-Allow-Origin", websiteUrl);

  return next();
});

app.use(async (ctx) => {
  const authToken = await getSpotifyAuthToken();

  if (!authToken) {
    return (ctx.response.status = 401);
  }

  const response = await fetch(
    "https://api.spotify.com/v1/me/player/recently-played",
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  const json = await response.json();
  const lastSong = json.items[0];

  return (ctx.response.body = JSON.stringify(lastSong));
});

await app.listen({ port: 8000 });
