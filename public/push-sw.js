// add listener for webpush

self.addEventListener("push", (event) => {
  const data = event.data.json();
  event.waitUntil(self.registration.showNotification(data.title, {
    body: data.text,
  }));
});

// self.addEventListener("notificationclick", (event) => {
//   const data = event.data.json();
//   self.registration.showNotification(data.title, {
//     body: data.text,
//   });
// });