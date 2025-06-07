// add listener for webpush

self.addEventListener("push", (event) => {;console.log(event);
  const data = event.data.json();
  event.waitUntil(self.registration.showNotification(data.title, {
    body: data.text,
    icon: "/icon-192x192.png",
    data: data,
    actions: [
      {
        action: "defaultValue",
        title: "Yes",
        type: "button", // type can be text
        // placeholder: "placeholder"
        // icon: '/icon-192x192.png',
      },
      {
        action: "customValue",
        type: "button",
        title: "New Value",
      }
    ]
  }));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const data = event.notification.data;
  let url = data.url;
  if (event.action === "defaultValue") {
    url = `${url}?cat=${data.cat}&type=${data.type}&value=${data.value}`
  } else if (event.action === "customValue") {
    url = `${url}?cat=${data.cat}&type=${data.type}`
  }
  event.waitUntil(clients.openWindow(url));
  // event.waitUntil(clients.matchAll({
  //   type: "window"
  // })
  // .then((clientList) => {
  //   for (const client of clientList) {;console.log(client.url, client);
  //     if (client.url === "/" && "focus" in client) return client.focus();
  //   }
  //   if (clients.openWindow) return clients.openWindow("/");
  // }));
});