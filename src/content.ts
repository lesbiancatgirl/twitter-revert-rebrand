function waitForElement<T extends HTMLElement>(selectors: string[], callback: (element: T) => void) {
    function doTheThing() {
        selectors.forEach(selector => {
            const element = document.querySelector<T>(selector);
            if (element) {
                callback(element);
            }
        });
    }

    doTheThing();
    new MutationObserver(doTheThing).observe(document.body, { childList: true, subtree: true });
}

function waitForElements<T extends HTMLElement>(selectors: string[], callback: (element: T) => void) {
    function doTheThing() {
        selectors.forEach(selector => {
            const elements = document.querySelectorAll<T>(selector);
            elements.forEach(element => callback(element));
        });
    }

    doTheThing();
    new MutationObserver(doTheThing).observe(document.body, { childList: true, subtree: true });
}

function replaceText(element: HTMLElement, findValue: string, replaceValue: string) {
    if (element.textContent?.includes(findValue)) {
        element.innerHTML = element.innerHTML?.replace(findValue, replaceValue);
    }
}

function replaceImage(element: HTMLElement, imagePath: string, size: number) {
    if (element.classList.contains('twitter-icon')) {
        return;
    }

    fetch(chrome.runtime.getURL(imagePath)).then(response => response.text()).then(text => {
        const content = new DOMParser().parseFromString(text, 'image/svg+xml');
        const svg = content.querySelector<HTMLElement>('svg');
        const path = svg?.querySelector<HTMLElement>('path');

        element.innerHTML = path?.outerHTML || '<path></path>';

        element.setAttribute('viewBox', svg?.getAttribute('viewBox') || '0 0 16 16');
        element.style.width = `${size}px`;
        element.style.height = `${size}px`;
        element.style.fill = document.querySelector<HTMLElement>('[data-testid="SideNav_NewTweet_Button"]')?.style.backgroundColor || '#1d9bf0';

        element.classList.add('twitter-icon');
    });
}



if (window.location.hostname === 'x.com') {
    window.location.href = `https://twitter.com${window.location.pathname}?mx=1`;
}

waitForElement<HTMLTitleElement>(['title' /* title */ ], element => {
    const values = {
        'Posts / X': 'Tweets / Twitter',
        'post / X': 'Tweet / Twitter',
        ' on X': ' on Twitter',
        ' / X': ' / Twitter',
        'repost': 'Retweet',
        'Quotes': 'Quote Tweets'
    };

    Object.entries(values).forEach(([key, value]) => {
        replaceText(element, key, value);
    });
});

waitForElement<HTMLAnchorElement>(['[rel~="icon"]' /* favicon */ ], element => {
    element.href = chrome.runtime.getURL('images/twitter-128.png');
});

waitForElement(['#placeholder > svg' /* loading icon */ ], element => {
    replaceImage(element, 'images/twitter.svg', 64);
});

waitForElement(['[aria-label="X"] svg' /* sidebar icon */ ], element => {
    replaceImage(element, 'images/twitter.svg', 32);
});

waitForElements(['[data-testid="socialContext"]' /* retweeted text */ ], element => {
    replaceText(element, 'reposted', 'Retweeted');
});

waitForElement([
    '[data-testid="SideNav_NewTweet_Button"] span span span', // sidebar tweet button
    '[data-testid="toolBar"] > div span span', // inline tweet button
    '[data-testid="pillLabel"] span span span', // show new tweets popup
    '[data-testid="notification"] span span', // notification title (before username)
    '[dir="ltr"] div ~ span span', // notification title (after username)
    '.public-DraftEditorPlaceholder-inner', // reply placeholder
], element => {
    replaceText(element, 'post', 'Tweet');
    replaceText(element, 'Post', 'Tweet');
});

waitForElement(['[aria-label="Home timeline"] h2 ~ div' /* tweet counter */ ], element => {
    const json = JSON.parse(document.head.querySelector('[data-testid="UserProfileSchema-test"]')?.innerHTML ?? '{}');
    const tweets: number = json.author?.interactionStatistic?.at(-1)?.userInteractionCount || -1;

    if (!element.textContent?.includes('posts') && !element.textContent?.includes('Tweets')) {
        return;
    }

    if (tweets === -1) {
        replaceText(element, 'posts', 'Tweets');
    } else if (tweets < 1000) {
        element.textContent = `${tweets} Tweets`;
    } else if (tweets < 10_000) {
        element.textContent = `${tweets.toString().slice(0, 1)},${tweets.toString().slice(1)} Tweets`;
    } else if (tweets < 1_000_000) {
        const formattedNumber = (tweets / 1000).toFixed(1)
        element.textContent = `${formattedNumber.endsWith('.0') ? (tweets / 1000).toFixed(0) : formattedNumber}K Tweets`;
    } else {
        const formattedNumber = (tweets / 1_000_000).toFixed(1)
        element.textContent = `${formattedNumber.endsWith('.0') ? (tweets / 1_000_000).toFixed(0) : formattedNumber}M Tweets`;
    }
});

waitForElement(['[data-testid="cellInnerDiv"] span' /* show new tweets button */ ], element => {
    if (element.textContent?.startsWith('Show ') && element.textContent.endsWith(' posts')) {
        replaceText(element, 'posts', 'Tweets');
    }
});

waitForElements(['[data-testid="trend"] > div > div:nth-child(3) > span' /* trending tweets */ ], element => {
    replaceText(element, 'post', 'Tweet');
});

waitForElements(['h2 > span' /* heading */ ], element => {
    if (document.querySelector('[aria-label="Home timeline"] h2 ~ div')?.textContent?.slice(1) !== window.location.pathname.slice(1).split('/', 1)[0]) {
        replaceText(element, 'post', 'Tweet');
        replaceText(element, 'Post', 'Tweet');
    }
});

waitForElements(['[role="tablist"] > [role="presentation"]' /* tabs */ ], element => {
    const span = element.querySelector('span');

    if (!span) {
        return;
    }

    replaceText(span, 'Reposts', 'Retweets');
    replaceText(span, 'Quotes', 'Quote Tweets');
    replaceText(span, 'Posts', 'Tweets');

    if (['Subs', 'Highlights', 'Articles', 'Verified Followers', 'Subscriptions', 'Verified'].includes(span.textContent || '')) {
        element.remove();
    }
});

waitForElements(['[role="menuitem"] span' /* menu items */ ], element => {
    if (element.textContent === 'Quote') {
        element.textContent = 'Quote Tweet';
    }

    if (element.textContent === 'Repost') {
        element.textContent = 'Retweet';
    }

    replaceText(element, ' repost', ' Retweet');
    replaceText(element, ' Quotes', ' Quote Tweets');
    replaceText(element, ' post', ' Tweet');
});

waitForElement([
    '[data-testid="empty_state_header_text"] span', // tweet engagements empty (header)
    '[data-testid="empty_state_body_text"] span' // tweet engagements empty (body)
], element => {
    replaceText(element, 'Quotes', 'Quote Tweets');
    replaceText(element, 'quoted', 'Quote Tweeted');
    replaceText(element, 'Repost', 'Retweet');
    replaceText(element, 'repost', 'Retweet');
    replaceText(element, 'post', 'Tweet');
});

waitForElement<HTMLInputElement>(['[placeholder="Search"]' /* search bar placeholder */ ], element => {
    element.placeholder = 'Search Twitter';
});
