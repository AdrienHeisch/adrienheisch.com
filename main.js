const API_BASE_URL = "https://api-adrienheisch-com.herokuapp.com";

const nav = document.getElementById("nav");
const navButton = document.getElementById("nav-button");
const content = document.getElementById("content");
const sharePopup = document.getElementById("share-popup");
const sharePopupText = document.getElementById("share-popup-text");
const newsletterForm = document.getElementById("newsletter-form");
const newsletterFormWait = document.getElementById("newsletter-wait");
const newsletterFormSuccess = document.getElementById("newsletter-success");
const newsletterFormFailure = document.getElementById("newsletter-failure");
const contactForm = document.getElementById("contact-form");
const contactFormWait = document.getElementById("contact-wait");
const contactFormSuccess = document.getElementById("contact-success");
const contactFormFailure = document.getElementById("contact-failure");
// const contactLink = document.getElementById("contact-link");
const codeButton = document.getElementById("code-button");
const codeWait = document.getElementById("code-wait");
const codeSuccess = document.getElementById("code-success");
const codeFailure = document.getElementById("code-failure");

let navOpen = false;

const l = window.location;
window.onpopstate = _ => loadPage(l.pathname.substring(1), true);
window.onpopstate();

navButton.addEventListener("click", _ => {
    if (navOpen) {
        nav.style.width = "0";
        content.style.color = "white";
        navOpen = false;
    } else {
        nav.style.width = "17em";
        if (mobileCheck()) content.style.color = "#999999";
        navOpen = true;
    }
});

for (const el of document.querySelectorAll("#nav>p>span")) el.addEventListener("click", _ => {
    loadPage(el.dataset.page);
    nav.style.width = "0";
    content.style.color = "white";
    navOpen = false;
});

// contactLink.addEventListener("click", _ => loadPage("contact"));

newsletterForm.addEventListener("submit", _ => {
    newsletterForm.hidden = true;
    newsletterFormWait.hidden = false;

    const email = new FormData(newsletterForm).get("email");

    fetch(`${API_BASE_URL}/newsletter-subscription`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ email })
    })
    .then(res => {
        newsletterFormWait.hidden = true;
        if (res.ok) {
            newsletterFormSuccess.innerHTML = `${email} - ${newsletterFormSuccess.innerHTML}`
            newsletterFormSuccess.hidden = false;
        } else newsletterFormFailure.hidden = false;
    })
    .catch(_ => {
        newsletterFormWait.hidden = true;
        newsletterFormFailure.hidden = false;
    });

    event.preventDefault();
});

contactForm.addEventListener("submit", _ => {
    contactForm.hidden = true;
    contactFormWait.hidden = false;

    const formData = new FormData(contactForm);
    const from = formData.get("from");
    const content = formData.get("content");

    fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ from, content })
    })
    .then(res => {
        contactFormWait.hidden = true;
        if (res.ok) contactFormSuccess.hidden = false;
        else contactFormFailure.hidden = false;
    })
    .catch(_ => {
        contactFormWait.hidden = true;
        contactFormFailure.hidden = false;
    });

    event.preventDefault();
});

codeButton.addEventListener("click", _ => {
    codeButton.hidden = true;

    let code = localStorage.getItem("code");
    
    function success () {
        codeSuccess.innerHTML = codeSuccess.innerHTML.replace("xxxx-xxxx", code);
        codeSuccess.hidden = false;
    }

    if (code === null) {
        codeWait.hidden = false;
        fetch(`${API_BASE_URL}/code`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
        })
        .then(res => {
            if (res.ok) return res.text();
            throw new Error();
        })
        .then(_code => {
            code = _code;
            localStorage.setItem("code", _code);
            codeWait.hidden = true;
            success();
        })
        .catch(_ => {
            codeWait.hidden = true;
            codeFailure.hidden = false;
            return;
        });
    } else success();
});
    
if (mobileCheck()) {
    document.addEventListener('DOMContentLoaded', _ => {
        /** @type {HTMLElement} */
        let elem;
        for (elem of document.querySelectorAll("#text-container > *")) {
            console.log(`${window.innerHeight} - ${elem.offsetTop} - ${elem.clientHeight} = ${window.innerHeight - elem.offsetTop - elem.clientHeight}`);
            elem.style.bottom = `${window.innerHeight - elem.offsetTop - elem.clientHeight}px`;
        };
    });

    document.getElementById("bandcamp-mobile").style.display = "block";
} else {
    document.getElementById("bandcamp-desktop").style.display = "block";
}

function loadPage (path, replace = false) {
    let page;
    switch (path) {
        case "about":
        case "lyrics":
        // case "mix":
        case "contact":
        case "codes":
            page = path;
            break;
        default:
            page = "homepage";
            path = "";
    }

    for (const el of content.children) {
        if (el.id === page) el.hidden = false;
        else el.hidden = true;
    }

    const url = l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') + '/' + path;
    if (replace) window.history.replaceState(null, null, url);
    else window.history.pushState(null, null, url);
}

function mobileCheck () {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};
