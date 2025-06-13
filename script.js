function hidePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        document.body.classList.add('loaded');
    }
}
window.addEventListener('load', hidePreloader);
setTimeout(hidePreloader, 3000);

class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="dud">${char}</span>`;
            } else {
                output += from;
            }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}


document.addEventListener('DOMContentLoaded', function () {

    const header = document.getElementById('botoes');
    if(header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    const scrambleElements = document.querySelectorAll('.scramble-text');
    scrambleElements.forEach(el => {
        const fx = new TextScramble(el);
        const originalText = el.textContent;
        setTimeout(() => {
            fx.setText(originalText);
        }, 1000);
    });

    const processoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.5 });
    const processoWrapper = document.querySelector('.processo-wrapper');
    if (processoWrapper) {
        processoObserver.observe(processoWrapper);
    }

    const cursorDot = document.querySelector('#cursor-dot');
    const cursorOutline = document.querySelector('#cursor-outline');
    window.addEventListener('mousemove', e => {
        const posX = e.clientX;
        const posY = e.clientY;
        if (cursorDot) {
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
        }
        if (cursorOutline) {
            requestAnimationFrame(() => {
                cursorOutline.style.transform = `translate(${posX - 20}px, ${posY - 20}px)`;
            });
        }
    });
    
    document.querySelectorAll('a, button, .magnetic-link, .swiper-button-next, .swiper-button-prev, .swiper-pagination-bullet, [data-tilt]').forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursorOutline) cursorOutline.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            if (cursorOutline) cursorOutline.classList.remove('hover');
        });
    });

    const scrollProgressBar = document.getElementById('scroll-progress-bar');
    window.addEventListener('scroll', () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / scrollHeight) * 100;
        if (scrollProgressBar) scrollProgressBar.style.width = `${progress}%`;
    });

    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
            max: 10,
            speed: 600,
            glare: true,
            "max-glare": 0.15,
            perspective: 1500
        });
    }

    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => { entry.target.classList.add('is-visible'); }, delay);
                
                if (entry.target.hasAttribute('data-stagger-parent')) {
                    const children = entry.target.querySelectorAll('[data-animation="stagger"]');
                    children.forEach((child, index) => { child.style.transitionDelay = `${index * 150}ms`; });
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-animation]').forEach(el => {
        animationObserver.observe(el);
    });

    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.getElementById('nav');
    const navLinks = nav.querySelectorAll('.nav-link');
    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', () => {
            nav.classList.toggle('is-open');
            document.body.classList.toggle('nav-open');
            const isOpen = nav.classList.contains('is-open');
            mobileMenuToggle.setAttribute('aria-expanded', isOpen);
            mobileMenuToggle.querySelector('i').className = isOpen ? 'fas fa-times' : 'fas fa-bars';
        });
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (nav.classList.contains('is-open')) {
                    nav.classList.remove('is-open');
                    document.body.classList.remove('nav-open');
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                    mobileMenuToggle.querySelector('i').className = 'fas fa-bars';
                }
            });
        });
    }

    const sections = Array.from(document.querySelectorAll('main section[id]'));
    function updateActiveNavLink() {
        let currentSectionId = 'home';
        const triggerPoint = window.scrollY + window.innerHeight * 0.4;
        
        for (const section of sections) {
            if (section.offsetTop <= triggerPoint) {
                currentSectionId = section.id;
            }
        }
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', updateActiveNavLink, { passive: true });
    updateActiveNavLink();

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const isExternal = this.hasAttribute('target');
            if (!isExternal) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId.length > 1) {
                    const targetEl = document.querySelector(targetId);
                    if (targetEl) {
                        targetEl.scrollIntoView({ behavior: 'smooth' });
                        if(history.pushState) {
                            history.pushState(null, null, targetId);
                        }
                    }
                }
            }
        });
    });

    if (typeof Swiper !== 'undefined') {
        new Swiper('.team-swiper', {
            loop: true,
            autoplay: { delay: 4000, disableOnInteraction: false },
            pagination: { el: '.team-swiper .swiper-pagination', clickable: true, dynamicBullets: true },
            slidesPerView: 1,
            spaceBetween: 30,
            grabCursor: true,
            breakpoints: {
                600: { slidesPerView: 2 },
                900: { slidesPerView: 3 },
                1200: { slidesPerView: 4 }
            }
        });

        new Swiper('.gallery-swiper', {
            effect: 'coverflow',
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 'auto',
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            coverflowEffect: {
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
            },
            pagination: {
                el: '.gallery-swiper .swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.gallery-swiper .swiper-button-next',
                prevEl: '.gallery-swiper .swiper-button-prev',
            },
        });
    }

    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    const quizContainer = document.getElementById('quiz-container');
    if (quizContainer) {
        const startScreen = document.getElementById('quiz-start-screen');
        const questionScreen = document.getElementById('quiz-question-screen');
        const resultsScreen = document.getElementById('quiz-results-screen');
        
        const startBtn = document.getElementById('start-quiz-btn');
        const replayBtn = document.getElementById('replay-quiz-btn');

        const progressText = document.getElementById('quiz-progress');
        const questionText = document.getElementById('quiz-question-text');
        const answersContainer = document.getElementById('quiz-answers');
        const scoreText = document.getElementById('quiz-score-text');
        const resultMessage = document.getElementById('quiz-result-message');

        const questions = [
            {
                question: "Qual é um dos pilares da Nexo, representando nossa busca por otimização e performance?",
                answers: ["Culinária", "Visão", "Jardinagem", "Missão"],
                correctIndex: 3
            },
            {
                question: "Qual das cores abaixo é mais proeminente na identidade visual da Nexo?",
                answers: ["Amarelo e Verde", "Laranja e Preto", "Roxo e Ciano", "Vermelho e Azul"],
                correctIndex: 2
            },
            {
                question: "Qual destes é um serviço oferecido pela Nexo?",
                answers: ["Passeio com cães", "Consultoria de moda", "Remoção de Vírus e Segurança", "Aulas de ioga"],
                correctIndex: 2
            },
            {
                question: "Qual o nome da empresa parceira estratégica destacada na página?",
                answers: ["Micron", "Inteli", "Nexora", "Googlo"],
                correctIndex: 2
            },
            {
                question: "Qual é a primeira etapa do nosso processo de trabalho?",
                answers: ["Implementação", "Suporte Contínuo", "Estratégia", "Diagnóstico"],
                correctIndex: 3
            }
        ];

        let currentQuestionIndex = 0;
        let score = 0;

        function startGame() {
            currentQuestionIndex = 0;
            score = 0;
            startScreen.classList.add('hidden');
            resultsScreen.classList.add('hidden');
            questionScreen.classList.remove('hidden');
            showQuestion();
        }

        function showQuestion() {
            resetState();
            const currentQuestion = questions[currentQuestionIndex];
            progressText.innerText = `Questão ${currentQuestionIndex + 1} de ${questions.length}`;
            questionText.innerText = currentQuestion.question;

            currentQuestion.answers.forEach((answer, index) => {
                const button = document.createElement('button');
                button.innerText = answer;
                button.classList.add('quiz-answer-btn');
                button.dataset.index = index;
                button.addEventListener('click', selectAnswer);
                answersContainer.appendChild(button);
            });
        }

        function resetState() {
            while (answersContainer.firstChild) {
                answersContainer.removeChild(answersContainer.firstChild);
            }
        }

        function selectAnswer(e) {
            const selectedButton = e.target;
            const selectedIndex = parseInt(selectedButton.dataset.index);
            const correctIndex = questions[currentQuestionIndex].correctIndex;

            Array.from(answersContainer.children).forEach(button => {
                button.disabled = true;
                if(parseInt(button.dataset.index) === correctIndex) {
                    button.classList.add('correct');
                }
            });

            if (selectedIndex === correctIndex) {
                score++;
            } else {
                selectedButton.classList.add('incorrect');
            }
            
            setTimeout(() => {
                currentQuestionIndex++;
                if (currentQuestionIndex < questions.length) {
                    showQuestion();
                } else {
                    showResults();
                }
            }, 2000);
        }

        function showResults() {
            questionScreen.classList.add('hidden');
            resultsScreen.classList.remove('hidden');

            scoreText.innerText = `Você acertou ${score} de ${questions.length} perguntas!`;
            
            let message = '';
            const percentage = (score / questions.length) * 100;
            if (percentage === 100) {
                message = "Incrível! Você é um verdadeiro especialista Nexo. Conexão perfeita!";
            } else if (percentage >= 60) {
                message = "Ótimo trabalho! Você está bem conectado com a gente.";
            } else {
                message = "Foi quase! Que tal dar mais uma olhada no site e tentar de novo?";
            }
            resultMessage.innerText = message;
        }

        startBtn.addEventListener('click', startGame);
        replayBtn.addEventListener('click', startGame);
    }

    const nexMascotContainer = document.getElementById('nex-mascot-container');
    if (nexMascotContainer) {
        const speechBubble = document.getElementById('nex-speech-bubble');
        const speechText = document.getElementById('nex-speech-text');
        const closeBubbleBtn = document.getElementById('nex-close-bubble');
        const hideMascotBtn = document.getElementById('nex-hide-mascot');
        const mascotImage = document.getElementById('nex-mascot-image');

        const nexMessages = {
            'home': "Olá! Eu sou o Nex, o mascote da Nexo. Estou aqui para te guiar pelo nosso universo de soluções. Vamos explorar juntos!",
            'equipe': "Essa é a nossa equipe de craques! Eles são os cérebros por trás da tecnologia que vai impulsionar o seu negócio.",
            'sobre': "Missão, Visão e Valores... Este é o nosso DNA! É o que nos guia para oferecer sempre o melhor para você.",
            'servicos': "Computador lento? Vírus? Deixa com a gente! Dê uma olhada em como podemos turbinar sua tecnologia.",
            'diferenciais': "Não somos só mais uma empresa de TI. Qualidade, inovação e parceria de verdade é o que nos move. Esse é o jeito Nexo!",
            'depoimentos': "A melhor parte do nosso trabalho é ver a satisfação de quem confia na gente. Olha só o que dizem por aí!",
            'parceiros': "Juntos somos mais fortes! A parceria com a Nexora nos permite oferecer um ecossistema tecnológico completo.",
            'processo': "Tudo aqui é pensado para ser simples e eficiente. Do diagnóstico ao suporte, nosso processo garante o melhor resultado.",
            'contato': "Gostou do que viu? Não seja tímido! Mande uma mensagem e vamos começar a transformar sua tecnologia.",
            'galeria': "Aqui estão alguns dos nossos momentos. É um gostinho da nossa jornada e do trabalho que nos move.",
            'desafio': "Opa, um desafio! Será que você estava prestando atenção? Teste seus conhecimentos e mostre que é um expert Nexo!"
        };

        let messageTimeout;
        let lastShownSection = null;

        const showMessage = (text, autoHideDelay = 8000) => {
            clearTimeout(messageTimeout);
            speechText.textContent = text;
            speechBubble.classList.add('visible');

            messageTimeout = setTimeout(() => {
                speechBubble.classList.remove('visible');
            }, autoHideDelay);
        };

        const hideMessage = () => {
            clearTimeout(messageTimeout);
            speechBubble.classList.remove('visible');
        };

        closeBubbleBtn.addEventListener('click', hideMessage);

        hideMascotBtn.addEventListener('click', () => {
            nexMascotContainer.classList.add('hidden');
        });

        mascotImage.addEventListener('click', () => {
            if (lastShownSection && nexMessages[lastShownSection]) {
                 showMessage(nexMessages[lastShownSection]);
            } else {
                 showMessage(nexMessages['home']);
            }
        });
        
        const mascotObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    if (sectionId && nexMessages[sectionId]) {
                        lastShownSection = sectionId;
                        showMessage(nexMessages[sectionId]);
                    }
                }
            });
        }, { threshold: 0.5, rootMargin: "-100px 0px -100px 0px" });

        document.querySelectorAll('main section[id]').forEach(section => {
            mascotObserver.observe(section);
        });
        
        window.addEventListener('load', () => {
            setTimeout(() => {
                if (nexMascotContainer) {
                   showMessage(nexMessages['home'], 10000);
                   lastShownSection = 'home';
                }
            }, 1500);
        });
    }
});