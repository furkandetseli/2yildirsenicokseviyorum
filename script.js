// Smooth scrolling for navigation
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to all links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Parallax effect for floating flowers
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const flowers = document.querySelectorAll('.flower');
        
        flowers.forEach((flower, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            flower.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.1}deg)`;
        });
    });

    // Hero background slideshow (7 fotoğraf)
    const heroBackgrounds = document.querySelectorAll('.hero-bg');
    let activeIndex = 0;
    if (heroBackgrounds.length) {
        // İlkini aktif yap
        heroBackgrounds[activeIndex].classList.add('active');
        setInterval(() => {
            heroBackgrounds[activeIndex].classList.remove('active');
            activeIndex = (activeIndex + 1) % heroBackgrounds.length;
            heroBackgrounds[activeIndex].classList.add('active');
        }, 4000); // 4 saniyede bir değişsin (7 fotoğraf için daha hızlı)
    }

    // HEIC to JPG Converter (Eğer heic2any kütüphanesi yüklüyse)
    function convertHEICtoJPG(heicFile) {
        if (typeof heic2any !== 'undefined') {
            return heic2any({
                blob: heicFile,
                toType: "image/jpeg",
                quality: 0.8
            }).then(function(convertedBlob) {
                return convertedBlob[0];
            });
        } else {
            console.log('heic2any kütüphanesi yüklenmemiş');
            return Promise.resolve(heicFile);
        }
    }

    // Fotoğraf yükleme fonksiyonu (HEIC desteği ile)
    function loadPhotoAsBackground(photoFile, backgroundElement) {
        if (photoFile.type === 'image/heic' || photoFile.name.toLowerCase().endsWith('.heic')) {
            convertHEICtoJPG(photoFile).then(function(convertedBlob) {
                const url = URL.createObjectURL(convertedBlob);
                backgroundElement.style.backgroundImage = `url(${url})`;
            });
        } else {
            const url = URL.createObjectURL(photoFile);
            backgroundElement.style.backgroundImage = `url(${url})`;
        }
    }

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections for fade-in effect
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Add click effect to gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Flower like functionality
    const likeButtons = document.querySelectorAll('.like-btn');
    likeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const flowerId = this.getAttribute('data-flower');
            const likeCount = this.querySelector('.like-count');
            const heartIcon = this.querySelector('i');
            
            if (this.classList.contains('liked')) {
                // Unlike
                this.classList.remove('liked');
                heartIcon.classList.remove('fas');
                heartIcon.classList.add('far');
                likeCount.textContent = parseInt(likeCount.textContent) - 1;
            } else {
                // Like
                this.classList.add('liked');
                heartIcon.classList.remove('far');
                heartIcon.classList.add('fas');
                likeCount.textContent = parseInt(likeCount.textContent) + 1;
                
                // Add heart animation
                createFloatingHeart();
            }
        });
    });

    // Interactive Game System
    let currentQuestion = 1;
    const totalQuestions = 6;
    const answers = {};
    let flowerLiked = false;

    function showQuestion(questionNumber) {
        // Hide all questions
        document.querySelectorAll('.question-card').forEach(card => {
            card.classList.remove('active');
        });
        
        // Show current question
        const currentCard = document.querySelector(`[data-question="${questionNumber}"]`);
        if (currentCard) {
            currentCard.classList.add('active');
        }
        
        // Update progress
        updateProgress(questionNumber);
    }

    function updateProgress(questionNumber) {
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        const percentage = (questionNumber / totalQuestions) * 100;
        
        progressFill.style.width = percentage + '%';
        progressText.textContent = `${questionNumber} / ${totalQuestions}`;
    }

    function nextQuestion() {
        if (currentQuestion < totalQuestions) {
            currentQuestion++;
            showQuestion(currentQuestion);
        } else {
            // All questions answered
            showResults();
        }
    }

    function showResults() {
        const questionsContainer = document.querySelector('.questions-container');
        questionsContainer.innerHTML = `
            <div class="question-card active">
                <h3>Teşekkürler! 💕</h3>
                <p>Cevapların için çok teşekkür ederim. Seni çok seviyorum!</p>
                <div class="results-summary">
                    <h4>Aşk Hikayemiz:</h4>
                    <ul>
                        <li>13 Ağustos 2023: Gözlerimiz ilk defa denk geldi 💫</li>
                        <li>28 Ekim 2023: Sevgili olduk 💕</li>
                        <li>Bugün: 2. yılımızı kutluyoruz! 🎉</li>
                    </ul>
                    <h4>Oyun Cevapların:</h4>
                    <ul>
                        ${Object.entries(answers).map(([question, answer]) => 
                            `<li>Soru ${question}: ${answer}</li>`
                        ).join('')}
                    </ul>
                </div>
                <button class="restart-btn" onclick="location.reload()">
                    <i class="fas fa-redo"></i>
                    Tekrar Oyna
                </button>
            </div>
        `;
    }

    // Answer button functionality
    document.addEventListener('click', function(e) {
        if (e.target.closest('.answer-btn')) {
            const button = e.target.closest('.answer-btn');
            const answer = button.getAttribute('data-answer');
            const questionNumber = parseInt(button.closest('.question-card').getAttribute('data-question'));
            
            // Store answer
            answers[questionNumber] = button.textContent.trim();
            
            // Add selection effect
            button.style.background = 'linear-gradient(135deg, #e91e63, #9c27b0)';
            button.style.color = 'white';
            button.style.transform = 'scale(1.05)';
            
            // Disable all buttons in this question
            const allButtons = button.parentElement.querySelectorAll('.answer-btn');
            allButtons.forEach(btn => {
                btn.disabled = true;
                btn.style.opacity = '0.6';
            });
            
            // Show selected button
            button.style.opacity = '1';
            
            // Special logic for flower liking game
            if (questionNumber === 1) {
                if (answer === 'yes') {
                    flowerLiked = true;
                    // Skip question 2 (the "really?" question) and go to question 3
                    setTimeout(() => {
                        currentQuestion = 3;
                        showQuestion(3);
                    }, 1500);
                } else {
                    // Go to question 2 (the "really?" question)
                    setTimeout(() => {
                        nextQuestion();
                    }, 1500);
                }
            } else if (questionNumber === 2) {
                if (answer === 'yes') {
                    flowerLiked = true;
                    // Skip to question 3
                    setTimeout(() => {
                        currentQuestion = 3;
                        showQuestion(3);
                    }, 1500);
                } else {
                    // Keep asking the same question (question 2)
                    setTimeout(() => {
                        // Reset the question 2 buttons
                        const question2Buttons = document.querySelectorAll('[data-question="2"] .answer-btn');
                        question2Buttons.forEach(btn => {
                            btn.disabled = false;
                            btn.style.opacity = '1';
                            btn.style.background = 'linear-gradient(135deg, #ff9a9e, #fecfef)';
                            btn.style.color = '#2d3436';
                            btn.style.transform = 'scale(1)';
                        });
                        // Show question 2 again
                        showQuestion(2);
                    }, 2000);
                }
            } else {
                // Normal flow for other questions
                setTimeout(() => {
                    nextQuestion();
                }, 1500);
            }
        }
    });

    // Initialize game
    showQuestion(1);

    // Add hover effect to memory items
    const memoryItems = document.querySelectorAll('.memory-item');
    memoryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });

    // Create floating hearts animation
    function createFloatingHeart() {
        const heart = document.createElement('div');
        heart.innerHTML = '💕';
        heart.style.position = 'fixed';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.top = '100vh';
        heart.style.fontSize = '2rem';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '1000';
        heart.style.animation = 'floatUp 4s linear forwards';
        
        document.body.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 4000);
    }

    // Add CSS for floating hearts animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatUp {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Create floating hearts periodically
    setInterval(createFloatingHeart, 3000);

    // Add typing effect to main title
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }

    // Apply typing effect to main title after page load
    setTimeout(() => {
        const mainTitle = document.querySelector('.main-title');
        const originalText = mainTitle.textContent;
        typeWriter(mainTitle, originalText, 150);
    }, 1000);

    // Add sparkle effect to heart animation
    const heartElement = document.querySelector('.heart-animation');
    if (heartElement) {
        heartElement.addEventListener('click', function() {
            // Create sparkle effect
            for (let i = 0; i < 10; i++) {
                setTimeout(() => {
                    const sparkle = document.createElement('div');
                    sparkle.innerHTML = '✨';
                    sparkle.style.position = 'absolute';
                    sparkle.style.left = Math.random() * 100 + '%';
                    sparkle.style.top = Math.random() * 100 + '%';
                    sparkle.style.fontSize = '1.5rem';
                    sparkle.style.pointerEvents = 'none';
                    sparkle.style.animation = 'sparkle 1s ease-out forwards';
                    sparkle.style.zIndex = '1000';
                    
                    this.appendChild(sparkle);
                    
                    setTimeout(() => {
                        sparkle.remove();
                    }, 1000);
                }, i * 100);
            }
        });
    }

    // Add sparkle animation CSS
    const sparkleStyle = document.createElement('style');
    sparkleStyle.textContent = `
        @keyframes sparkle {
            0% {
                transform: scale(0) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: scale(1) rotate(180deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(sparkleStyle);

    // Add scroll progress indicator
    const progressBar = document.createElement('div');
    progressBar.style.position = 'fixed';
    progressBar.style.top = '0';
    progressBar.style.left = '0';
    progressBar.style.width = '0%';
    progressBar.style.height = '4px';
    progressBar.style.background = 'linear-gradient(90deg, #e91e63, #9c27b0)';
    progressBar.style.zIndex = '9999';
    progressBar.style.transition = 'width 0.1s ease';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });

    // Add confetti effect on page load
    function createConfetti() {
        const colors = ['#e91e63', '#9c27b0', '#ff9800', '#4caf50', '#2196f3'];
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.position = 'fixed';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.top = '-10px';
                confetti.style.width = '10px';
                confetti.style.height = '10px';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.pointerEvents = 'none';
                confetti.style.zIndex = '1000';
                confetti.style.animation = 'confettiFall 3s linear forwards';
                
                document.body.appendChild(confetti);
                
                setTimeout(() => {
                    confetti.remove();
                }, 3000);
            }, i * 50);
        }
    }

    // Add confetti animation CSS
    const confettiStyle = document.createElement('style');
    confettiStyle.textContent = `
        @keyframes confettiFall {
            0% {
                transform: translateY(-100vh) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(confettiStyle);

    // Trigger confetti on page load
    setTimeout(createConfetti, 2000);
});
