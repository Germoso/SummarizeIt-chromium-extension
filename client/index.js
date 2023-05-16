const $ = (query) => document.querySelector(query)
const $$ = (query) => document.querySelectorAll(query)

const $root = $(".root")

const exampleResponse =
  "El sitio web es TextGears, un corrector de ortografía y gramática impulsado por IA con corrección automática. Además, proporciona herramientas para resumen de texto, extracción de palabras clave, detección de idioma y cálculo de legibilidad. Está calificado 9.8 de 10, tardó 2.560 milisegundos en cargarse y tuvo un porcentaje de éxito del 49%. Además, proporciona documentación de la API TextGears, y una Playground de la API para comenzar a probarlo.El sitio web es TextGears, un corrector de ortografía y gramática impulsado por IA con corrección automática. Además, proporciona herramientas para resumen de texto, extracción de palabras clave, detección de idioma y cálculo de legibilidad. Está calificado 9.8 de 10, tardó 2.560 milisegundos en cargarse y tuvo un porcentaje de éxito del 49%. Además, proporciona documentación de la API TextGears, y una Playground de la API para comenzar a probarlo."

document.addEventListener("DOMContentLoaded", async function () {
  chrome.runtime.sendMessage({
    action: "injectScript",
    script: `chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "getContent") {
      var elementos = document.querySelectorAll('p, h1, h2, b, strong, i, em');
      var content = '';
      
      elementos.forEach(function(elemento) {
        content += elemento.textContent + '\\n';
      });
          
      sendResponse({ content: content });
    }
  });`,
  })

  $(".btn").addEventListener("click", async function () {
    $root.innerHTML = await importComponent("./components/loader.html")

    const rowPageTextContent = await getTextContent()
    console.log(rowPageTextContent)
    console.log(rowPageTextContent.length)
    const pageTextContent = formatText(rowPageTextContent)
    if (pageTextContent) {
      const data = await analize(pageTextContent)
      $root.innerHTML = await importComponent("./components/result.html")
      // $(".result").textContent = exampleResponse
      $(".result").textContent = data
    }
  })
})

const getTextContent = () =>
  new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "getContent" },
        function (response) {
          if (response && response.content) {
            let result = response.content
            if (result)
              setTimeout(() => {
                resolve(result)
              }, 2000)
            else reject("No content found")
          }
        }
      )
    })
  })

const importComponent = async (route) => {
  const url = "../" + route
  console.log(url)
  try {
    const response = await fetch("../" + route)
    const data = await response.text()
    return data
  } catch (error) {
    console.log("Error al importar componente", route, "Error:", error)
  }
}

const analize = async (p) => {
  prompt = `Toma las siguientes condiciones
  - No me respondas cosas con las palabras como: el texto que proporcionaste, el texto proporcionado, etc...
  - Responde como si estas analizando el contenido de un sition web, como por ejemplo: El sitio web es..., El sitio web trata..., el sitio dice..., el contenido....
  
  Analiza lo siguiente:
  ${p}
  `

  try {
    const response = await fetch("http://localhost:3000", {
      method: "POST",
      body: JSON.stringify({
        prompt,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await response.json()
    return data.result
  } catch (error) {
    console.log(error)
  }
}

const formatText = (text, maxLength = 2000) => {
  if (text.length <= maxLength) {
    return text
  }
  const textoReducido = text.slice(0, maxLength)
  const ultimaPosicionEspacio = textoReducido.lastIndexOf(" ")
  const textoFinal = textoReducido.slice(0, ultimaPosicionEspacio)
  return textoFinal
}
