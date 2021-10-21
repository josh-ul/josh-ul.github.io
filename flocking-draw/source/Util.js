class Util {
    static clamp(val, min, max) {
        //return Math.min(Math.max(val, min), max);
        return Math.max(Math.min(num, Math.max(min, max)), Math.min(min, max));
    }

    static randInt(min, max) {
        if(max) return Math.round(Math.random() * (max - min) + min);
        else return Math.round(Math.random() * min);
    }

    static randFloat(min, max) {
        if(max) return Math.random() * (max - min) + min;
        else return Math.random() * min;
    }

    static bound(val, input, output) {
        return ((val - input[0]) / input[1] - input[0]) * (output[1] - output[0]) + output[0];
    }

    static degsToRads(deg) {
        return (deg * Math.PI) / 180.0;
    }

    static radsToDegs(rad) {
        return (rad * 180.0) / Math.PI;
    }

    static stripHTMLtags(str) {
        return str.replace(/<[^>]*>/g, "");
    }

    static $(selector, context) {
        return (context || document).querySelectorAll(selector);
    }

    static $1(selector, context) {
        return (context || document).querySelector(selector);
    }

    static $i(selector, context) {
        return (context || document).getElementById(selector);
    }

    static $c(selector, context) {
        return (context || document).getElementsByClassName(selector);
    }

    static $t(selector, context) {
        return (context || document).getElementsByTagName(selector);
    }

    static htmlToElement(html) {
        let template = document.createElement("template");
        template.innerHTML = html.trim();
        return template.content.firstChild;
    }

    static nodeValue(el) {
        return el.firstChild.nodeValue;
    }

    static nodeArray(nodeList) {
        let elementList = [];
        nodeList.forEach(element => {
            elementList.push(element);
        });
        return elementList;
        //return [...nodeList];
        //return Array.prototype.slice.call(nodeList);
    }

    static replaceElement(oldEl, newEl) {
        oldEl.parentNode.replaceChild(newEl, oldEl);
    }

    static unwrap(el) {
        let parent = el.parentNode;
        while (el.firstChild) parent.insertBefore(el.firstChilde, el);
        parent.removeChild(el);
    }

    static empty(el) {
        el.innerHTML = "";
    }

    static remove(el) {
        el.parentNode.removeChild(el);
    }

    static insertAfter(el, ref) {
        ref.parentNode.insertBefore(el, ref.nextSibling);
        //el.insertAdjacentHTML("afterend", htmlString);
    }

    static insertBefore(el, ref) {
        ref.parentNode.insertBefore(el, ref)
    }

    static elementText(el) {
        return el.textContent || el.innerText;
    }

    static wrap(el, wrapper) {
        el.parentNode.insertBefore(wrapper, el);
        wrapper.appendChild(el);
    }

    static hasClass(el, className) {
        return el.classList.contains(className);
    }

    static ajax(url, data, success) {
        let params = typeof data === "string" ? data : Object.keys(data).map(k => {
            return encodeURIComponent(k) + "=" + encodeURIComponent(data[k])
        }).join("&");
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.onreadystatechange = () => {
            if (xhr.readyState > 3 && xhr.status === 200) {
                success(xhr.responseText);
            }
        }
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(params);
        return xhr;
    }

    static parseCookie(str) {
        return str
            .split(";")
            .map(v => v.split("="))
            .reduce((acc, v) => {
                acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
                return acc;
            }, {});
    }

    static serializeCookie(name, val) {
        return `${encodeURIComponent(name)}=${encodeURIComponent(val)}`;
    }
}
