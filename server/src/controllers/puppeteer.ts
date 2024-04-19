import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { executablePath } from 'puppeteer';

puppeteer.use(StealthPlugin());

export async function scrapeJobOffer(url: string) {
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: executablePath(),
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36');

    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

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

        return jobData;
    } catch (error) {
        console.error('Failed to scrape the job offer:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

export default { scrapeJobOffer };
