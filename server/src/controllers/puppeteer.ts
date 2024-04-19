import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { executablePath } from 'puppeteer';

puppeteer.use(StealthPlugin());

export async function scrapeJobOffer(url: string) {
    const browser = await puppeteer.launch({ headless: true, executablePath: executablePath() });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const jobData = await page.evaluate(() => {
        const regexSalary = /[\d,]+(?:\.?\d+)?\s*(k|K|\$|€|GBP|USD|EUR)?/;
        const regexCleanText = /\s\s+/g;

        const companyElement = document.querySelector('a.ci__link');
        const titleElement = document.querySelector('h1.title');
        const locationElement = document.querySelector('a.bsj-tag.tag--location');
        const descriptionElement = document.querySelector('div.bsj-template__content');
        const salaryElement = document.querySelector('.salary');
        const url = window.location.href;

        return {
            company: companyElement ? companyElement.textContent.trim().replace(regexCleanText, ' ') : null,
            title: titleElement ? titleElement.textContent.trim().replace(regexCleanText, ' ') : null,
            location: locationElement ? locationElement.textContent.trim().replace(regexCleanText, ' ') : null,
            description: descriptionElement ? descriptionElement.textContent.trim().replace(regexCleanText, ' ') : null,
            salary: salaryElement && regexSalary.test(salaryElement.textContent) ? salaryElement.textContent.match(regexSalary)[0] : null,
            url: url
        };
    });

    await browser.close();
    return jobData;
}

export default { scrapeJobOffer };
