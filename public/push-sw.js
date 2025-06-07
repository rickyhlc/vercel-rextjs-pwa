// add listener for webpush

self.addEventListener("install", (event) => {
  // The promise that skipWaiting() returns can be safely ignored.
  self.skipWaiting();

  // Perform any other actions required for your
  // service worker to install, potentially inside
  // of event.waitUntil();
});

self.addEventListener("push", (event) => {
  const data = event.data.json();
  event.waitUntil(self.registration.showNotification("Add this record?", {
    body: data.value ? `${data.name}: $${data.value}` : data.name,
    icon: "/icon-192x192.png",
    data: data,
    actions: data.value ? [
      {
        action: "default",
        title: "Yes",
        type: "button", // type can be text
        // placeholder: "placeholder"
        // icon: '/icon-192x192.png',
      },
      {
        action: "custom",
        type: "button",
        title: "New Value",
      }
    ] : []
  }));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const data = event.notification.data;
  let url = data.url;
  if (event.action === "default") {
    url = `${url}?cat=${data.cat}&type=${data.type}&value=${data.value}`
  } else if (!data.value || event.action === "custom") {
    url = `${url}?cat=${data.cat}&type=${data.type}`
  }
  // this open a new window in desktop and open pwa in android
  event.waitUntil(clients.openWindow(url));
});