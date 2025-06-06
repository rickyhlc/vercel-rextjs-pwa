// add listener for webpush

self.addEventListener("push", (event) => {
  const data = event.data.json();
  event.waitUntil(self.registration.showNotification(data.title, {
    body: data.text,
    icon: "/icon-192x192.png",
    actions: ["ook", "go"]
  }));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.text + "__" + event.action,
  });
});