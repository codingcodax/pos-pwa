import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";
import { db } from "~/lib/db";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig, EventTarget {
    // Change this attribute's name to your `injectionPoint`.
    // `injectionPoint` is an InjectManifest option.
    // See https://serwist.pages.dev/docs/build/configuring
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: WorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  fallbacks: {
    entries: [
      {
        url: "/~offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

self.addEventListener("online", async () => {
  console.log("online");

  const orders = await db.orders.toArray();
  const req = await fetch("/api/hello", {
    method: "GET",
  });
  const data = await req.json();

  console.log(orders);
  console.log(data);

  console.log("finished");
});

self.addEventListener("offline", () => console.log("offline"));

serwist.addEventListeners();
