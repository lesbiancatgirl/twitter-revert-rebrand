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
    '[data-testid="notification"] span span' // notifications
], element => {
    replaceText(element, 'post', 'Tweet');
    replaceText(element, 'Post', 'Tweet');
});

waitForElement(['[data-testid="cellInnerDiv"] span', /* show new tweets button */ ], element => {
    if (element.textContent?.startsWith('Show ') && element.textContent.endsWith(' posts')) {
        replaceText(element, 'posts', 'Tweets');
    }
});

waitForElements([
    '[data-testid="trend"] > div > div:nth-child(3) > span', // trending tweets
    'h2 > span', // heading
], element => {
    replaceText(element, 'post', 'Tweet');
    replaceText(element, 'Post', 'Tweet');
});
