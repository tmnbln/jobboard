function extractJobOfferData() {
    const jobTitle = document.querySelector('h1').innerText;
    const company = document.querySelector('.company-name').innerText;
    const location = document.querySelector('.location').innerText;
    const description = document.querySelector('.job-description').innerText;

    return {
        title: jobTitle,
        company: company,
        location: location,
        description: description
    };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getJobOffer') {
        const jobOfferData = extractJobOfferData();
        sendResponse(jobOfferData);
    }
});
