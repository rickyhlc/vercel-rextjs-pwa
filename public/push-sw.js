// add listener for webpush

self.addEventListener("push", (event) => {
  const data = event.data.json();
  event.waitUntil(self.registration.showNotification(data.title, {
    body: data.text + "!@@!",
    icon: "/icon-192x192.png",
    actions: [
      {
        action: 'coffee-action',
        title: 'Coffee',
        type: 'button',
        icon: '/icon-192x192.png',
      },
      {
        action: 'doughnut-action',
        type: 'text',
        title: 'Doughnut',
        placeholder: "placeholder"
      }
    ]
  }));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const data = event.data.json();
  event.waitUntil(self.clients.openWindow('https://web.dev'));
});