const upload = new FileUploadWithPreview.FileUploadWithPreview('myFirstImage');
const btn = document.querySelector(".btn");
const error = document.querySelector(".error");
const data = document.querySelector(".data");
const imgUrl = document.querySelector(".img-url");
const copyBtn = document.querySelector(".btn2");
const toolTipText = document.querySelector(".tooltiptext");

const allowedExtension = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif"
]

btn.addEventListener("click", (e) => {
  e.preventDefault()
  const file = upload.cachedFileArray[0]
  if(!file) {
    return
  }

  btn.disabled = true
  btn.innerHTML = "<div class='spinner'></div>"

  if (!isValidFileType(file.type)) {
    error.innerHTML = "Invalid File Type!"
    error.style.display = "block"

    upload.resetPreviewPanel();
    btn.disabled = false
    btn.innerHTML = "Upload"


    setTimeout(() => {
      error.innerHTML = ""
      error.style.display = "none"
    }, 2600)

    return
  }

  let formData = new FormData();
  formData.append("file", file, file.name.split(":")[0])



  const sendReq = async () => {
    const req = await fetch('https://images.misterh.dev/upload', {
      method: "POST",
      body: formData
    });

    const res = await req.text()

    if (res.startsWith("error")) {
      error.innerHTML = "Error while trying to upload. Please try again!"
      error.style.display = "block"
    } else {
      data.style.display = "flex"
      imgUrl.innerHTML = `https://images.misterh.dev/i/${res}`
      imgUrl.href = `https://images.misterh.dev/i/${res}`
    }

    btn.disabled = false
    upload.resetPreviewPanel();
    btn.innerHTML = "Upload"
  }


  sendReq()
})

function isValidFileType(type) {
  return allowedExtension.includes(type)
}

copyBtn.addEventListener("click", () => {
  toolTipText.innerText = "Copied!"
  navigator.clipboard.writeText(imgUrl.href)

  setTimeout(() => {
    toolTipText.innerText = "Copy Link!"
  }, 1000)
})