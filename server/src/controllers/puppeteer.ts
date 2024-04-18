import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

export async function scrapeJobOffer(url: string) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: 'networkidle2'});

    puppeteer.use(StealthPlugin());

    const jobData = await page.evaluate(() => {
        const companyElement = document.querySelector('li.job-ad-display-ve6qfw.at-listing__list-icons-company-name');
        const titleElement = document.querySelector('span.job-ad-display-15gph7y');
        const locationElement = document.querySelector('span.job-ad-display-1whr5zf');
        const descriptionElement = document.querySelector('article.job-ad-display-1lx1y7n');
        const requirementsElement = document.querySelector('article.job-ad-display-1lx1y7n');
        const benefitsElement = document.querySelector('article.job-ad-display-1lx1y7n');
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

// https://www.youtube.com/watch?v=9zwyfrVv3hg