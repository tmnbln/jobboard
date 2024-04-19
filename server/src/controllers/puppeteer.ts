import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { executablePath } from 'puppeteer';

puppeteer.use(StealthPlugin());

export async function scrapeJobOffer(url: string) {
    const browser = await puppeteer.launch( {headless: true, executablePath: executablePath()} );
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });


    const jobData = await page.evaluate(() => {
        const companyElement = document.querySelector('a.ci__link');
        const titleElement = document.querySelector('h1.title');
        const locationElement = document.querySelector('a.bsj-tag.tag--location');
        const descriptionElement = document.querySelector('div.bsj-template__content');
        const requirementsElement = document.querySelector('div.bsj-template__content');
        const benefitsElement = document.querySelector('div.bsj-tags');
        const salaryElement = document.querySelector('.salary');
        const url = window.location.href;

        return {
            company: companyElement ? companyElement.textContent : null,
            title: titleElement ? titleElement.textContent : null,
            location: locationElement ? locationElement.textContent : null,
            description: descriptionElement ? descriptionElement.textContent : null,
            requirements: requirementsElement ? requirementsElement.textContent : null,
            benefits: benefitsElement ? benefitsElement.textContent : null,
            salary: salaryElement ? salaryElement.textContent : null,
            url: url
        };
    });

    await browser.close();
    return jobData;
}

export default { scrapeJobOffer };

// https://berlinstartupjobs.com/engineering/search-ks-platform-lead-orb-software-worldcoin/