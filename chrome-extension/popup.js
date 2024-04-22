document.addEventListener('DOMContentLoaded', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'getJobOffer' }, (response) => {
        document.getElementById('title').value = response.title;
        document.getElementById('company').value = response.company;
        document.getElementById('location').value = response.location;
        document.getElementById('description').value = response.description;
      });
    });
  
    document.getElementById('jobOfferForm').addEventListener('submit', (event) => {
      event.preventDefault();
  
      const formData = new FormData(event.target);
      const jobOffer = Object.fromEntries(formData.entries());
  
      console.log('Job offer saved:', jobOffer);
    });
  });
  