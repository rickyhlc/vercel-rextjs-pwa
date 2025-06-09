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
    event.waitUntil(self.registration.showNotification("test?", {
      body: "go to /camera/[[...params]]",
      icon: "/icon-192x192.png",
      data: data,
      actions: [
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
      ]
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
  } else {
    url = `${url}/camera/p1/p2/123`;
  }
  // this open a new window in desktop and open pwa in android
  event.waitUntil(clients.openWindow(url));
});