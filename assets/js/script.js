 // JavaScript for Kakao Map and Gallery Modal
        document.addEventListener('DOMContentLoaded', function() {
            
            // --- 꽃잎 떨어지는 애니메이션 ---
            const canvas = document.getElementById('falling-petals');
            const ctx = canvas.getContext('2d');
            
            // Canvas 크기 설정
            function resizeCanvas() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);

            // 꽃잎 클래스 정의
            class Petal {
                constructor() {
                    this.x = Math.random() * canvas.width;
                    this.y = -20;
                    this.size = Math.random() * 8 + 4; // 4-12px 크기
                    this.speedY = Math.random() * 1.5 + 0.5; // 느린 낙하 속도 (0.5-2)
                    this.speedX = Math.random() * 1 - 0.5; // 좌우 움직임
                    this.rotation = Math.random() * 360;
                    this.rotationSpeed = Math.random() * 2 - 1;
                    this.opacity = Math.random() * 0.8 + 0.2;
                    this.color = this.getRandomPetalColor();
                }

                getRandomPetalColor() {
                    const colors = [
                        'rgba(255, 182, 193, ', // 연분홍
                        'rgba(255, 192, 203, ', // 분홍
                        'rgba(255, 228, 225, ', // 미스티로즈
                        'rgba(255, 240, 245, ', // 라벤더블러쉬
                        'rgba(250, 218, 221, ', // 연핑크
                        'rgba(255, 218, 185, ', // 복숭아색
                    ];
                    return colors[Math.floor(Math.random() * colors.length)];
                }

                update() {
                    this.y += this.speedY;
                    this.x += this.speedX;
                    this.rotation += this.rotationSpeed;

                    // 화면 밖으로 나가면 재생성
                    if (this.y > canvas.height + 20) {
                        this.y = -20;
                        this.x = Math.random() * canvas.width;
                    }

                    // 좌우로 너무 멀리 나가면 조정
                    if (this.x < -20 || this.x > canvas.width + 20) {
                        this.speedX = -this.speedX;
                    }
                }

                draw() {
                    ctx.save();
                    ctx.translate(this.x, this.y);
                    ctx.rotate(this.rotation * Math.PI / 180);
                    ctx.globalAlpha = this.opacity;

                    // 꽃잎 모양 그리기
                    ctx.beginPath();
                    ctx.fillStyle = this.color + this.opacity + ')';
                    
                    // 타원형 꽃잎 모양
                    ctx.ellipse(0, 0, this.size, this.size * 1.5, 0, 0, 2 * Math.PI);
                    ctx.fill();
                    
                    // 꽃잎에 약간의 그림자 효과
                    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
                    ctx.shadowBlur = 2;
                    ctx.shadowOffsetX = 1;
                    ctx.shadowOffsetY = 1;

                    ctx.restore();
                }
            }

            // 꽃잎 배열 생성
            const TOTAL_PETALS = 30; // 적당한 수의 꽃잎
            const petals = [];
            
            for (let i = 0; i < TOTAL_PETALS; i++) {
                petals.push(new Petal());
            }

            // 애니메이션 렌더링
            function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                petals.forEach(petal => {
                    petal.update();
                    petal.draw();
                });
                
                requestAnimationFrame(animate);
            }

            // 애니메이션 시작
            animate();
            
            // --- 카카오맵 초기화 및 마커/정보창 설정 ---
            var mapContainer = document.getElementById('map');
            var mapOption = { 
                center: new kakao.maps.LatLng(37.446839, 126.676470),
                level: 4
            };
            var map = new kakao.maps.Map(mapContainer, mapOption);

            var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png';
            var imageSize = new kakao.maps.Size(64, 69);
            var imageOption = {offset: new kakao.maps.Point(27, 69)};
            
            var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
            var markerPosition = new kakao.maps.LatLng(37.446839, 126.676470);

            var marker = new kakao.maps.Marker({
                position: markerPosition, 
                image: markerImage
            });
            marker.setMap(map); 
            
            var iwContent = '<div class="info-message text-center w-full">' +
                            '<div class="font-bold text-base mb-1">○○ 웨딩홀</div>' +
                            '<div class="text-xs text-gray-500">인천광역시 연수구 송도동</div>' +
                            '</div>';
            var iwPosition = new kakao.maps.LatLng(37.446839, 126.676470);
            
            var infowindow = new kakao.maps.InfoWindow({
                position : iwPosition,
                content : iwContent,
                removable : true
            });
            infowindow.open(map, marker);

            // --- 갤러리 모달 로직 ---
            const galleryModal = document.getElementById('gallery-modal');
            const modalImage = document.getElementById('modal-image');
            const closeButton = document.querySelector('.close-button');
            const prevBtn = document.getElementById('prev-btn');
            const nextBtn = document.getElementById('next-btn');
            const galleryItems = document.querySelectorAll('.gallery-item');
            let currentIndex = 0;

            // 모달 열기
            galleryItems.forEach((item, index) => {
                item.addEventListener('click', () => {
                    modalImage.src = item.src;
                    currentIndex = index;
                    galleryModal.classList.remove('hidden');
                });
            });

            // 모달 닫기
            closeButton.addEventListener('click', () => {
                galleryModal.classList.add('hidden');
            });

            // 모달 외부 클릭 시 닫기
            galleryModal.addEventListener('click', (event) => {
                if (event.target === galleryModal) {
                    galleryModal.classList.add('hidden');
                }
            });

            // 이전 버튼
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
                modalImage.src = galleryItems[currentIndex].src;
            });

            // 다음 버튼
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % galleryItems.length;
                modalImage.src = galleryItems[currentIndex].src;
            });

            // --- 음악 플레이어 기능 ---
            const backgroundMusic = document.getElementById('background-music');
            const playPauseBtn = document.getElementById('play-pause-btn');
            const playIcon = document.getElementById('play-icon');
            const pauseIcon = document.getElementById('pause-icon');
            const volumeBtn = document.getElementById('volume-btn');
            const volumeIcon = document.getElementById('volume-icon');

            let isPlaying = false;
            let isMuted = false;

            // 음악 자동 재생 (사용자 상호작용 후)
            function initializeMusic() {
                backgroundMusic.volume = 0.3; // 볼륨 30%로 설정
                
                // 자동 재생 시도
                const playPromise = backgroundMusic.play();
                
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        isPlaying = true;
                        updatePlayPauseIcon();
                    }).catch((error) => {
                        console.log('자동 재생이 차단되었습니다. 사용자가 직접 재생해야 합니다.');
                        // 자동 재생이 실패하면 사용자가 클릭할 때까지 대기
                    });
                }
            }

            // 페이지 로드 후 음악 초기화
            setTimeout(initializeMusic, 1000);

            // 사용자 첫 상호작용 시 자동 재생 시도
            let firstInteraction = true;
            document.addEventListener('click', function() {
                if (firstInteraction && !isPlaying) {
                    firstInteraction = false;
                    backgroundMusic.play().then(() => {
                        isPlaying = true;
                        updatePlayPauseIcon();
                    }).catch(console.log);
                }
            }, { once: true });

            // 재생/일시정지 아이콘 업데이트
            function updatePlayPauseIcon() {
                if (isPlaying) {
                    playIcon.style.display = 'none';
                    pauseIcon.style.display = 'block';
                } else {
                    playIcon.style.display = 'block';
                    pauseIcon.style.display = 'none';
                }
            }

            // 볼륨 아이콘 업데이트
            function updateVolumeIcon() {
                if (isMuted || backgroundMusic.volume === 0) {
                    volumeIcon.className = 'fa-solid fa-volume-xmark';
                } else if (backgroundMusic.volume < 0.5) {
                    volumeIcon.className = 'fa-solid fa-volume-low';
                } else {
                    volumeIcon.className = 'fa-solid fa-volume-high';
                }
            }

            // 재생/일시정지 버튼 이벤트
            playPauseBtn.addEventListener('click', () => {
                if (isPlaying) {
                    backgroundMusic.pause();
                    isPlaying = false;
                } else {
                    backgroundMusic.play().then(() => {
                        isPlaying = true;
                    }).catch(console.log);
                }
                updatePlayPauseIcon();
            });

            // 볼륨 버튼 이벤트 (음소거/음소거 해제)
            volumeBtn.addEventListener('click', () => {
                if (isMuted) {
                    backgroundMusic.volume = 0.3;
                    isMuted = false;
                } else {
                    backgroundMusic.volume = 0;
                    isMuted = true;
                }
                updateVolumeIcon();
            });

            // 음악 종료 시 재생 아이콘 업데이트
            backgroundMusic.addEventListener('ended', () => {
                isPlaying = false;
                updatePlayPauseIcon();
            });

            // 음악 재생 시작 시 아이콘 업데이트
            backgroundMusic.addEventListener('play', () => {
                isPlaying = true;
                updatePlayPauseIcon();
            });

            // 음악 일시정지 시 아이콘 업데이트
            backgroundMusic.addEventListener('pause', () => {
                isPlaying = false;
                updatePlayPauseIcon();
            });

            // 초기 볼륨 아이콘 설정
            updateVolumeIcon();
        });