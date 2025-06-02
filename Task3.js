// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initCarousel();
    initQuiz();
    initWeather();
});

// Navigation Menu Toggle
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Animate hamburger icon
        hamburger.classList.toggle('active');
    });

    // Close menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Image Carousel Functionality
function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    let currentSlide = 0;
    const totalSlides = slides.length;

    // Auto-play interval (optional)
    let autoPlayInterval;

    function showSlide(index) {
        // Remove active class from all slides and indicators
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Add active class to current slide and indicator
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        
        currentSlide = index;
    }

    function nextSlide() {
        const next = (currentSlide + 1) % totalSlides;
        showSlide(next);
    }

    function prevSlide() {
        const prev = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(prev);
    }

    // Event listeners for navigation buttons
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Event listeners for indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
            resetAutoPlay();
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoPlay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoPlay();
        }
    });

    // Auto-play functionality
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    // Start auto-play
    startAutoPlay();

    // Pause auto-play on hover
    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.addEventListener('mouseenter', stopAutoPlay);
    carouselContainer.addEventListener('mouseleave', startAutoPlay);
}

// Interactive Quiz Functionality
function initQuiz() {
    const questions = [
        {
            question: "What is the capital of France?",
            options: ["London", "Berlin", "Paris", "Madrid"],
            correct: 2
        },
        {
            question: "Which planet is known as the Red Planet?",
            options: ["Venus", "Mars", "Jupiter", "Saturn"],
            correct: 1
        },
        {
            question: "What is the largest ocean on Earth?",
            options: ["Atlantic", "Indian", "Arctic", "Pacific"],
            correct: 3
        },
        {
            question: "Who painted the Mona Lisa?",
            options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Michelangelo"],
            correct: 1
        },
        {
            question: "What is the chemical symbol for gold?",
            options: ["Go", "Gd", "Au", "Ag"],
            correct: 2
        }
    ];

    let currentQuestion = 0;
    let score = 0;
    let selectedOption = null;

    const questionTitle = document.getElementById('question-title');
    const questionText = document.getElementById('question-text');
    const optionButtons = document.querySelectorAll('.option-btn');
    const nextButton = document.getElementById('next-question');
    const progress = document.getElementById('progress');
    const quizResults = document.getElementById('quiz-results');
    const finalScore = document.getElementById('final-score');
    const restartButton = document.getElementById('restart-quiz');
    const quizBody = document.querySelector('.quiz-body');
    const quizFooter = document.querySelector('.quiz-footer');

    function loadQuestion() {
        const question = questions[currentQuestion];
        
        questionTitle.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
        questionText.textContent = question.question;
        
        optionButtons.forEach((btn, index) => {
            btn.textContent = question.options[index];
            btn.classList.remove('correct', 'incorrect');
            btn.disabled = false;
        });
        
        // Update progress bar
        const progressPercent = ((currentQuestion + 1) / questions.length) * 100;
        progress.style.width = `${progressPercent}%`;
        
        selectedOption = null;
        nextButton.disabled = true;
    }

    function selectOption(optionIndex) {
        if (selectedOption !== null) return; // Prevent multiple selections
        
        selectedOption = optionIndex;
        const question = questions[currentQuestion];
        
        // Show correct/incorrect answers
        optionButtons.forEach((btn, index) => {
            btn.disabled = true;
            if (index === question.correct) {
                btn.classList.add('correct');
            } else if (index === optionIndex && index !== question.correct) {
                btn.classList.add('incorrect');
            }
        });
        
        // Update score
        if (optionIndex === question.correct) {
            score++;
        }
        
        nextButton.disabled = false;
    }

    function nextQuestion() {
        currentQuestion++;
        
        if (currentQuestion < questions.length) {
            loadQuestion();
        } else {
            showResults();
        }
    }

    function showResults() {
        quizBody.style.display = 'none';
        quizFooter.style.display = 'none';
        quizResults.style.display = 'block';
        
        const percentage = Math.round((score / questions.length) * 100);
        finalScore.textContent = `Your Score: ${score}/${questions.length} (${percentage}%)`;
    }

    function restartQuiz() {
        currentQuestion = 0;
        score = 0;
        selectedOption = null;
        
        quizBody.style.display = 'block';
        quizFooter.style.display = 'block';
        quizResults.style.display = 'none';
        
        loadQuestion();
    }

    // Event listeners
    optionButtons.forEach((btn, index) => {
        btn.addEventListener('click', () => selectOption(index));
    });

    nextButton.addEventListener('click', nextQuestion);
    restartButton.addEventListener('click', restartQuiz);

    // Initialize quiz
    loadQuestion();
}

// Weather API Functionality
function initWeather() {
    const API_KEY = '1a2b3c4d5e6f7g8h9i0j'; // Replace with your actual API key
    const API_URL = 'https://api.openweathermap.org/data/2.5/weather';
    
    const cityInput = document.getElementById('city-input');
    const searchButton = document.getElementById('search-weather');
    const weatherLoading = document.getElementById('weather-loading');
    const weatherInfo = document.getElementById('weather-info');
    const weatherError = document.getElementById('weather-error');
    
    const cityName = document.getElementById('city-name');
    const temperature = document.getElementById('temperature');
    const weatherDescription = document.getElementById('weather-description');
    const feelsLike = document.getElementById('feels-like');
    const humidity = document.getElementById('humidity');
    const windSpeed = document.getElementById('wind-speed');

    async function fetchWeather(city) {
        try {
            showLoading();
            
            const response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            displayWeatherData(data);
            
        } catch (error) {
            console.error('Error fetching weather data:', error);
            showError();
        }
    }

    function showLoading() {
        weatherLoading.style.display = 'block';
        weatherInfo.style.display = 'none';
        weatherError.style.display = 'none';
    }

    function displayWeatherData(data) {
        weatherLoading.style.display = 'none';
        weatherInfo.style.display = 'block';
        weatherError.style.display = 'none';
        
        cityName.textContent = `${data.name}, ${data.sys.country}`;
        temperature.textContent = `${Math.round(data.main.temp)}°C`;
        weatherDescription.textContent = data.weather[0].description;
        feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
        humidity.textContent = `${data.main.humidity}%`;
        windSpeed.textContent = `${data.wind.speed} m/s`;
    }

    function showError() {
        weatherLoading.style.display = 'none';
        weatherInfo.style.display = 'none';
        weatherError.style.display = 'block';
    }

    // Alternative weather API with no API key required (for demo purposes)
    async function fetchWeatherDemo(city) {
        try {
            showLoading();
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Mock weather data for demonstration
            const mockData = {
                name: city,
                sys: { country: 'Demo' },
                main: {
                    temp: Math.floor(Math.random() * 30) + 5,
                    feels_like: Math.floor(Math.random() * 30) + 5,
                    humidity: Math.floor(Math.random() * 40) + 40
                },
                weather: [{
                    description: ['sunny', 'cloudy', 'rainy', 'partly cloudy'][Math.floor(Math.random() * 4)]
                }],
                wind: {
                    speed: (Math.random() * 10).toFixed(1)
                }
            };
            
            displayWeatherData(mockData);
            
        } catch (error) {
            console.error('Error in demo weather:', error);
            showError();
        }
    }

    // Event listeners
    searchButton.addEventListener('click', () => {
        const city = cityInput.value.trim();
        if (city) {
            // Use fetchWeatherDemo for demo without API key
            // Replace with fetchWeather(city) when you have a real API key
            fetchWeatherDemo(city);
        }
    });

    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const city = cityInput.value.trim();
            if (city) {
                // Use fetchWeatherDemo for demo without API key
                // Replace with fetchWeather(city) when you have a real API key
                fetchWeatherDemo(city);
            }
        }
    });

    // Load default weather for demo
    setTimeout(() => {
        cityInput.value = 'London';
        fetchWeatherDemo('London');
    }, 1000);
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Smooth scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top button functionality
document.addEventListener('scroll', debounce(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    // You can add a scroll-to-top button here if needed
}, 100));

// Intersection Observer for animations (optional enhancement)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});