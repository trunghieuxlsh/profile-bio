export const SITE_CONFIG = {
    quote: "Lúc bạn còn nhỏ, bạn hẳn đã ăn rất nhiều thứ, và ắt hẳn bạn cũng không nhớ bạn đã ăn gì. Nhưng cơ thể bạn lớn khôn nhường này là nhờ những gì bạn hấp thu trước kia. Sách cũng thế, có thể bạn không nhớ được những trang sách đã từng đọc qua, nhưng những vần câu ấy đã khắc sâu vào tâm hồn bạn, những thứ ấy thể hiện qua cách bạn nói chuyện, thể hiện trong khí chất, sự hiểu biết và trong tấm lòng rộng mở.",
    spotifyPlaylistUrl: "https://open.spotify.com/embed/playlist/42Vn3BkuzHoErKgE23B1LW?utm_source=generator"
};

export const JOURNAL_POSTS = [
    {
        "slug": "status-update",
        "title": "Status Update",
        "date": "2026-01-15",
        "tags": ["personal", "update"],
        "excerpt": "Latest updates and thoughts.",
        "content": `
# Status

# About me:
* mình tên đầy đủ là Nguyễn Trung Hiếu
* nickname mà mọi người biết đến mình nhiều nhất là byouku | byou
* mình sẽ có cách đối xử khác nhau với từng người.

# Hobbies:
* mình chơi game, list :
+ Shooting game: Valorant, CS2, Apex
+ Moba: LOL
+ Rhythm: osu, rhythmplus, maimai

* mình thích mèo
* mình thích học, không chỉ riêng về mặt học thuật và còn về những mảng khác liên quan đến công nghệ, nghệ thuật. Các field hiện tại mình đang join:
+ Projector | UI UX | Graphic | Design
+ Cinematograph | Videograph | Photograph
+ (AI) Web | Coding
+ Podcast
+ Gear | PC | Setup
+ ngoài ra còn rất nhiều mảng random mà mình đã từng tiếp xúc/ thử qua
`
    },
    {
        "slug": "welcome-to-my-bio",
        "title": "Welcome to my Bio",
        "date": "2026-01-14",
        "tags": ["personal", "intro"],
        "excerpt": "A short intro to who I am and what I do.",
        "content": `
# Welcome to my Bio

Hi, I'm Trung Hieu. I love art, but there is art in everything.

## What I do
I sleep a lot.
But i still have a passion to study anything in the world. For instance i can writting journal, designing, playing game (kinda sweaty), playing sports, photographing,etc.

This site is a place i can share my thoughts and experiences.

`
    },
    {
        "slug": "my-video-gear-2024",
        "title": "My Video Gear",
        "date": "2024-01-15",
        "tags": ["gear", "video"],
        "excerpt": "A breakdown of the camera and lenses I use for my daily work.",
        "content": `
# My Gear

Here is a list of what I use:

- **Mic**: Elgato Wave 3
- **Personal Camera**: Sony A6400 | Canon EOS 700D
- **Lens**: 17-40mm f/1.8 | 17-50 f/2.8

> "The best camera is the one you have with you."
`
    }
];

export const PORTFOLIO_DATA = {
    categories: [
        {
            slug: 'photograph',
            title: 'Photography',
            description: 'My Vision.',
            icon: 'camera'
        },
        {
            slug: 'design',
            title: 'Design',
            description: 'My Creative.',
            icon: 'pen-tool'
        },
        {
            slug: 'video',
            title: 'Video',
            description: 'My Motion.',
            icon: 'film'
        }
    ],
    items: {
        'photograph': [
            {
                slug: 'random',
                title: 'Random',
                year: '2026',
                description: 'Moments captured.',
                coverImage: '/portfolio/photograph/Random/DSC08435_Facebook.webp',
                tags: ['Random', 'Life'],
                photos: [
                    { src: '/portfolio/photograph/Random/DSC08435_Facebook.webp', alt: 'DSC08435' },
                    { src: '/portfolio/photograph/Random/DSC08436_Facebook.webp', alt: 'DSC08436' },
                    { src: '/portfolio/photograph/Random/DSC08665_Facebook.webp', alt: 'DSC08665' },
                    { src: '/portfolio/photograph/Random/DSC08682_Facebook.webp', alt: 'DSC08682' }
                ]
            },
            {
                slug: 'fonephoto',
                title: 'Fonephoto',
                year: '2026',
                description: 'Shot on Phone.',
                coverImage: '/portfolio/photograph/Fonephoto/1.webp',
                tags: ['Mobile', 'Life'],
                photos: [
                    { src: '/portfolio/photograph/Fonephoto/1.webp', alt: 'Photo 1' },
                    { src: '/portfolio/photograph/Fonephoto/2.webp', alt: 'Photo 2' },
                    { src: '/portfolio/photograph/Fonephoto/3.webp', alt: 'Photo 3' },
                    { src: '/portfolio/photograph/Fonephoto/4.webp', alt: 'Photo 4' }
                ]
            },
            {
                slug: 'ntmk-high-school',
                title: 'NTMK High School',
                year: '2026',
                description: 'Memories from school.',
                coverImage: '/portfolio/photograph/NTMK High School/5.webp',
                tags: ['School', 'Memories'],
                photos: [
                    { src: '/portfolio/photograph/NTMK High School/5.webp', alt: 'Photo 5' },
                    { src: '/portfolio/photograph/NTMK High School/6.webp', alt: 'Photo 6' },
                    { src: '/portfolio/photograph/NTMK High School/7.webp', alt: 'Photo 7' },
                    { src: '/portfolio/photograph/NTMK High School/8.webp', alt: 'Photo 8' },
                    { src: '/portfolio/photograph/NTMK High School/9.webp', alt: 'Photo 9' }
                ]
            }
        ],
        'design': [
            // Drop your images in /portfolio/design/ and update names here
            { title: 'Design Sample 1', year: '2026', image: '/portfolio/design/1.jpg', tags: ['Sample'] }
        ],
        'video': [
            // Drop your images in /portfolio/video/ and update names here
            { title: 'Video Sample 1', year: '2026', image: '/portfolio/video/1.jpg', tags: ['Sample'] }
        ]
    }
};
