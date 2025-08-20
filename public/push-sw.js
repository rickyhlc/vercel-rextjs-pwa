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
  if (data.notificationType === "bank") {
    event.waitUntil(self.registration.showNotification("Create this new record?", {
      body: data.value ? `${data.name}: $${data.value}` : data.name,
      icon: "/icon-192x192.png",
      data: data
    }));
  } else {
    event.waitUntil(self.registration.showNotification("Test Notification", {
      body: data.msg,
      icon: "/icon-192x192.png",
      data: data
    }));
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const data = event.notification.data;
  let url = data.url;
  if (data.notificationType === "bank") {
    url = `${url}/bank?cat=${data.cat}&type=${data.type}`;
    if (data.value) {
      url += `&value=${data.value}`;
    }
    if (data.flags?.length) {
      url += `&flags=${data.flags.join()}`;
    }
  }
  // this open a new window in desktop and open pwa in android
  event.waitUntil(clients.openWindow(url));
});