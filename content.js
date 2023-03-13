chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.text === "u there content.js?") {
        sendResponse({ status: "yes" });
    }
});

const banned_words = ["aloha", "!", ".", ":", "?"];

const checkBannedWords = text => {
    if (banned_words.filter(e => text.toLowerCase().includes(e.toLowerCase())).length > 0) {
        return true;
    }

    return false;
};

const filter_posts = () => {
    if (window.location.href.includes("https://www.facebook.com")) {
        document.querySelectorAll(".x1yztbdb").forEach(e => {
            if (e.classList.length === 1) {
                const body = e.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.childNodes[1].firstChild;
                let video_content = body.firstChild.firstChild.firstChild.firstChild.firstChild.innerHTML;

                if (body.childNodes.length > 2) {
                    video_content += '\n' + body.childNodes[1].firstChild.firstChild.innerHTML;
                }

                if (checkBannedWords(video_content)) {
                    e.remove();
                }
            }
        });

        document.querySelectorAll("*[style]").forEach(e => {
            if (e.style.backgroundPosition === "0px -262px" && e.style.backgroundSize === "auto" && e.style.width === "18px" && e.style.height === "18px" &&
                e.style.backgroundRepeat === "no-repeat" && e.style.display === "inline-block") {
                const post = e.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
                const group_post_unique = post.firstChild.firstChild.firstChild.childNodes[1].firstChild.childNodes[1].firstChild.childNodes[1].firstChild.firstChild;
                const is_group_post = group_post_unique === null;

                let sponsored_unique;

                if (!is_group_post) {
                    sponsored_unique = group_post_unique.firstChild.firstChild;
                }

                const is_sponsored = sponsored_unique === null || sponsored_unique === undefined;
                let sponsored_parent;

                if (!is_sponsored && !is_group_post) {
                    sponsored_parent = sponsored_unique.firstChild;
                }

                if (sponsored_parent === undefined) {
                    let video_content = post.firstChild.childNodes[1].firstChild.innerText;

                    if (post.firstChild.childNodes[2] !== undefined) {
                        video_content += '\n' + post.firstChild.childNodes[2].innerText;
                    }

                    if (checkBannedWords(video_content)) {
                        post.parentNode.parentNode.parentNode.parentNode.parentNode.remove(); // full post
                    }
                }
            }
        });
    }
    else if (window.location.href.includes("https://www.youtube.com")) {
        document.querySelectorAll("ytd-rich-grid-slim-media span[id=video-title]").forEach(e => {
            if (checkBannedWords(e.innerText)) {
                e.parentNode.parentNode.parentNode.parentNode.remove();
            }
        });

        document.querySelectorAll("ytd-rich-item-renderer yt-formatted-string[id=video-title], ytd-compact-video-renderer span[id=video-title]").forEach(e => {
            if (checkBannedWords(e.innerText)) {
                e.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
            }
        });

        document.querySelectorAll("ytd-video-renderer yt-formatted-string[aria-label]").forEach(e => {
            if (checkBannedWords(e.innerText)) {
                e.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
            }
        });
    }
};

new MutationObserver((mutationsList, observer) => {
    filter_posts();
}).observe(document.body, { attributes: true, childList: true, subtree: true });
