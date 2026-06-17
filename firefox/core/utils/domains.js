import { disposableDomains } from "../config.js";


export function loadDisposableDomains() {
    return fetch("https://raw.githubusercontent.com/disposable-email-domains/disposable-email-domains/master/disposable_email_blocklist.conf")
        .then(response => {
            if (!response.ok) throw new Error();
            return response.text();
        })
        .then(text => {
            text.split("\n").forEach(d => {
                const domain = d.trim().toLowerCase();
                if (domain) disposableDomains.add(domain);
            });

        })
        .catch(() => {});
}