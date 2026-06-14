document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const resultContainer = document.getElementById('result');

    const generateLottoNumbers = () => {
        resultContainer.innerHTML = ''; // Clear previous numbers
        const numbers = new Set();
        while (numbers.size < 6) {
            const randomNumber = Math.floor(Math.random() * 45) + 1;
            numbers.add(randomNumber);
        }

        const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

        sortedNumbers.forEach(number => {
            const numberDiv = document.createElement('div');
            numberDiv.className = 'lotto-number';
            numberDiv.textContent = number;
            resultContainer.appendChild(numberDiv);
        });
    };

    generateBtn.addEventListener('click', generateLottoNumbers);

    // Generate numbers on initial load
    generateLottoNumbers();
});