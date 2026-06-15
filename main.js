// Teachable Machine model URL
const URL = "https://teachablemachine.withgoogle.com/models/m1_F-kH4p/";

let model, labelContainer, maxPredictions;

// Load the image model
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
}

// Handle image upload and prediction
const imageUpload = document.getElementById('image-upload');
const previewImage = document.getElementById('preview-image');
const loading = document.getElementById('loading');
labelContainer = document.getElementById('label-container');

imageUpload.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            previewImage.src = e.target.result;
            previewImage.style.display = 'block';
            
            loading.style.display = 'block';
            labelContainer.innerHTML = '';

            if (!model) await init();
            await predict();
            loading.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
});

async function predict() {
    const prediction = await model.predict(previewImage);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            `<div class="prediction-item">
                <span class="label">${prediction[i].className}:</span>
                <div class="bar-container">
                    <div class="bar" style="width: ${Math.round(prediction[i].probability * 100)}%"></div>
                </div>
                <span class="percentage">${Math.round(prediction[i].probability * 100)}%</span>
            </div>`;
        labelContainer.innerHTML += classPrediction;
    }
}

// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved theme preference
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    body.classList.add(currentTheme);
}

themeToggle.addEventListener('click', () => {
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light-mode');
    } else {
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark-mode');
    }
});
