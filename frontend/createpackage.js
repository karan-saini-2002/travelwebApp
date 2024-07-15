document.addEventListener('DOMContentLoaded', function() {
    const packageForm = document.getElementById('packageForm');
  
    packageForm.addEventListener('submit', async function(event) {
      event.preventDefault(); 
  
      try {
        const formData = gatherFormData(packageForm);
        const response = await submitPackage(formData);
        
        if (response.ok) {
          alert('Package created successfully!');
          window.location.href = 'destinations.html';
          packageForm.reset(); 
          
        } else {
          throw new Error('Error creating package');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error creating package');
      }
    });
  
    function gatherFormData(form) {
      const formData = {
        activities: [],
        policies: [],
        itinerary: []
      };
  
      formData.destination = form.elements['destination'].value;
      formData.name = form.elements['name'].value;
      formData.duration = form.elements['duration'].value;
      formData.transfers = form.elements['transfers'].value;
      formData.meals = form.elements['meals'].value;
      formData.price = form.elements['price'].value;
      formData.img = form.elements['img'].value;
      formData.imgUrls = form.elements['imgUrls'].value.split(',').map(url => url.trim());
  
      formData.flights = {
        details: form.elements['flights.details'].value,
        flightNumber: form.elements['flights.flightNumber'].value,
        departureDate: form.elements['flights.departureDate'].value,
        returnDate: form.elements['flights.returnDate'].value,
      };
  
      formData.hotels = {
        details: form.elements['hotels.details'].value,
        name: form.elements['hotels.name'].value,
        address: form.elements['hotels.address'].value,
        checkIn: form.elements['hotels.checkIn'].value,
        checkOut: form.elements['hotels.checkOut'].value,
        bookingDetails: form.elements['hotels.bookingDetails'].value,
      };
  
      const activityCount = form.querySelectorAll('.activity').length;
      for (let i = 0; i < activityCount; i++) {
        formData.activities.push({
          name: form.elements[`activities[${i}].name`].value,
          img: form.elements[`activities[${i}].img`].value,
          description: form.elements[`activities[${i}].description`].value,
        });
      }
  
      const policyCount = form.querySelectorAll('.policy').length;
      for (let i = 0; i < policyCount; i++) {
        formData.policies.push({
          title: form.elements[`policies[${i}].title`].value,
          description: form.elements[`policies[${i}].description`].value,
        });
      }
  
      const itineraryCount = form.querySelectorAll('.itinerary').length;
      for (let i = 0; i < itineraryCount; i++) {
        formData.itinerary.push({
          day: form.elements[`itinerary[${i}].day`].value,
          date: form.elements[`itinerary[${i}].date`].value,
          hotel: form.elements[`itinerary[${i}].hotel`].value,
          hotelStars: form.elements[`itinerary[${i}].hotelStars`].value,
          car: form.elements[`itinerary[${i}].car`].value,
          sightseeing: form.elements[`itinerary[${i}].sightseeing`].value,
        });
      }
  
      return formData;
    }
  
    async function submitPackage(formData) {
      try {
        const response = await fetch('http://localhost:5000/submit_package', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        return response;

      } catch (error) {
        console.error('Error submitting package:', error);
        throw error;
      }
    }
  });
  
  