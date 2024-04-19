import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { executablePath } from 'puppeteer';

puppeteer.use(StealthPlugin());

const siteConfigs = {
    "berlinstartupjobs.com": {
        companySelector: 'a.ci__link',
        titleSelector: 'h1.title',
        locationSelector: 'a.bsj-tag.tag--location',
        descriptionSelector: 'div.bsj-template__content',
        salarySelector: '.salary',
        cleanRegex: /\s\s+/g,
        salaryRegex: /[\d,]+(?:\.?\d+)?\s*(k|K|\$|€|GBP|USD|EUR)?/,
    },

};

export async function scrapeJobOffer(url: string) {
    const domain = new URL(url).hostname;
    const config = siteConfigs[domain] || {};

    const browser = await puppeteer.launch({
        headless: true,
        executablePath: executablePath(),
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36');

    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        const jobData = await page.evaluate((config) => {
            const extractText = (selector) => {
                const element = document.querySelector(selector);
                return element ? element.textContent.trim().replace(config.cleanRegex, ' ') : null;
            };

            return {
                company: extractText(config.companySelector),
                title: extractText(config.titleSelector),
                location: extractText(config.locationSelector),
                description: extractText(config.descriptionSelector),
                salary: (() => {
                    const element = document.querySelector(config.salarySelector);
                    return element && config.salaryRegex.test(element.textContent) ? element.textContent.match(config.salaryRegex)[0] : null;
                })(),
                url: window.location.href,
            };
        }, config);

        return jobData;
    } catch (error) {
        console.error('🦆 Failed to scrape the job offer:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

export default { scrapeJobOffer };