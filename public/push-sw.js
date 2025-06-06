// add listener for webpush

self.addEventListener("push", (event) => {
  const data = event.data.json();
  event.waitUntil(self.registration.showNotification(data.title, {
    body: data.text + "!@@!",
    icon: "/icon-192x192.png",
    actions: [
      {
        action: 'coffee-action',
        title: 'B',
        type: 'button',
        icon: '/icon-192x192.png',
      },
      {
        action: 'doughnut-action',
        type: 'text',
        title: 'T',
        placeholder: "placeholder"
      }
    ]
  }));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.matchAll({
    type: "window"
  })
  .then((clientList) => {
    for (const client of clientList) {;console.log(client.url, client);
      if (client.url === "/" && "focus" in client) return client.focus();
    }
    if (clients.openWindow) return clients.openWindow("/");
  }));
});