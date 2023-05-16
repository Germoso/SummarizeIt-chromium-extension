chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "injectScript") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.executeScript(tabs[0].id, {
        code: request.script,
      })
    })
  }
})

// chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
//   if (message.action === "popupMessage") {
//     console.log("Mensaje recibido desde la ventana emergente:", message.text)

//     // Enviar una respuesta a la ventana emergente
//     sendResponse({ status: "OK" })

//     // Hacer algo en el fondo (background)
//     // ...
//   }
// })

// async function getCurrentTab() {
//   let queryOptions = { active: true, lastFocusedWindow: true }
//   // `tab` will either be a `tabs.Tab` instance or `undefined`.
//   let [tab] = await chrome.tabs.query(queryOptions)
//   return tab
// }

// async function sendMessageToActiveTab(message) {
//   const [tab] = await chrome.tabs.query({
//     active: true,
//     lastFocusedWindow: true,
//   })
//   const response = await chrome.tabs.sendMessage(tab.id, message)
//   // TODO: Do something with the response.
// }
