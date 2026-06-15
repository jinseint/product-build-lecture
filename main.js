// Teachable Machine model URL
const URL = "https://teachablemachine.withgoogle.com/models/m1_F-kH4p/";

let model, labelContainer, maxPredictions;

// Translations for multilingual support
const translations = {
    en: {
        title: "Cat vs Dog AI - Intelligent Pet Image Classifier",
        description: "Use our advanced AI technology to instantly identify whether your pet photo shows a cat or a dog. Fast, free, and educational pet classification.",
        h1: "Cat vs Dog AI",
        subtitle: "Intelligent Image Recognition Technology",
        "tool-intro": "Upload a photo of your pet, and our AI model will analyze its features to provide an accurate classification.",
        "upload-btn": "Analyze Your Pet Photo",
        "preview-alt": "Uploaded Image Preview",
        "loading-text": "AI is analyzing image patterns...",
        "about-title": "About the Technology",
        "about-p1": "This classifier uses <strong>Convolutional Neural Networks (CNN)</strong>, a class of deep neural networks most commonly applied to analyzing visual imagery. Our model has been trained on thousands of diverse images of cats and dogs to recognize specific anatomical features and patterns.",
        "how-it-works-title": "How it Works",
        "how-it-works-p": "The AI looks for shapes, edges, and textures (like fur patterns or ear shapes) to distinguish between feline and canine characteristics.",
        "accuracy-title": "Tips for Accuracy",
        "accuracy-li1": "Ensure the pet is clearly visible.",
        "accuracy-li2": "Use good lighting for better feature detection.",
        "accuracy-li3": "A single subject in the frame works best.",
        "contact-title": "Partnership & Feedback",
        "contact-p": "Have suggestions to improve our AI? Interested in a partnership? Let us know!",
        "form-email": "Your Email Address",
        "form-message": "How can we help you?",
        "form-submit": "Send Message",
        "comments-title": "Community Discussion",
        "footer-copyright": "&copy; 2024 Cat vs Dog AI Classifier. All rights reserved.",
        "footer-privacy": "Privacy Policy",
        "footer-terms": "Terms of Service"
    },
    ko: {
        title: "고양이 vs 강아지 AI - 지능형 반려동물 이미지 분류기",
        description: "첨단 AI 기술을 사용하여 반려동물 사진이 고양이인지 강아지인지 즉시 식별하세요. 빠르고 무료이며 교육적인 반려동물 분류 서비스입니다.",
        h1: "고양이 vs 강아지 AI",
        subtitle: "지능형 이미지 인식 기술",
        "tool-intro": "반려동물 사진을 업로드하면 AI 모델이 특징을 분석하여 정확한 분류 결과를 제공합니다.",
        "upload-btn": "반려동물 사진 분석하기",
        "preview-alt": "업로드된 이미지 미리보기",
        "loading-text": "AI가 이미지 패턴을 분석 중입니다...",
        "about-title": "기술 소개",
        "about-p1": "이 분류기는 시각적 이미지를 분석하는 데 가장 일반적으로 사용되는 딥러닝 신경망의 한 종류인 <strong>합성곱 신경망(CNN)</strong>을 사용합니다. 저희 모델은 수천 장의 다양한 고양이와 강아지 이미지를 학습하여 특정 해부학적 특징과 패턴을 인식합니다.",
        "how-it-works-title": "작동 방식",
        "how-it-works-p": "AI는 고양이와 강아지의 특징을 구별하기 위해 모양, 가장자리, 질감(털 패턴이나 귀 모양 등)을 분석합니다.",
        "accuracy-title": "정확도를 위한 팁",
        "accuracy-li1": "반려동물이 선명하게 보여야 합니다.",
        "accuracy-li2": "더 나은 특징 감지를 위해 좋은 조명을 사용하세요.",
        "accuracy-li3": "프레임 안에 하나의 대상만 있는 것이 가장 좋습니다.",
        "contact-title": "파트너십 및 피드백",
        "contact-p": "AI 개선을 위한 제안이 있으신가요? 파트너십에 관심이 있으신가요? 알려주세요!",
        "form-email": "이메일 주소",
        "form-message": "무엇을 도와드릴까요?",
        "form-submit": "메시지 보내기",
        "comments-title": "커뮤니티 토론",
        "footer-copyright": "&copy; 2024 고양이 vs 강아지 AI 분류기. 모든 권리 보유.",
        "footer-privacy": "개인정보 처리방침",
        "footer-terms": "서비스 이용약관"
    }
};

// Function to change language
const changeLanguage = (lang) => {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.getAttribute('data-key');
        const translation = translations[lang][key];
        if (translation) {
            if (element.tagName === 'META' && element.name === 'description') {
                element.content = translation;
            } else if (element.hasAttribute('placeholder')) {
                element.placeholder = translation;
            } else {
                element.innerHTML = translation;
            }
        }
    });
    // Update active button
    document.getElementById('lang-en').classList.toggle('active', lang === 'en');
    document.getElementById('lang-ko').classList.toggle('active', lang === 'ko');
    // Save preference
    localStorage.setItem('language', lang);
};

// Language switcher logic
const langEnBtn = document.getElementById('lang-en');
const langKoBtn = document.getElementById('lang-ko');

langEnBtn.addEventListener('click', () => changeLanguage('en'));
langKoBtn.addEventListener('click', () => changeLanguage('ko'));

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

// Initialize language
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('language') || 'en';
    changeLanguage(savedLang);
});